// All SQL for auth lives here. `sql` is a tagged-template query function
// (the Neon driver in the app) that resolves to an array of row objects.
export function makeStore(sql) {
  return {
    // Returns { id, email }, or null if the email is already taken.
    async createUser(email, passwordHash) {
      const rows = await sql`
        insert into users (email, password_hash)
        values (${email}, ${passwordHash})
        on conflict (email) do nothing
        returning id, email`;
      return rows[0] ?? null;
    },

    async findUserByEmail(email) {
      const rows = await sql`
        select id, email, password_hash from users where email = ${email}`;
      return rows[0] ?? null;
    },

    async createSession(userId, tokenHash, days) {
      await sql`
        insert into sessions (token_hash, user_id, expires_at)
        values (${tokenHash}, ${userId}, now() + make_interval(days => ${days}::int))`;
    },

    // Returns { id, email } for a live (unexpired) session, else null.
    async findSession(tokenHash) {
      const rows = await sql`
        select u.id, u.email, u.is_demo, u.stripe_customer_id
        from sessions s join users u on u.id = s.user_id
        where s.token_hash = ${tokenHash} and s.expires_at > now()`;
      return rows[0] ?? null;
    },


    async setStripeCustomer(userId, customerId) {
      const [row] = await sql`
        update users set stripe_customer_id = coalesce(stripe_customer_id, ${customerId})
        where id = ${userId} returning stripe_customer_id`;
      return row.stripe_customer_id;
    },

    async reserveGeneration(userId) {
      const rows = await sql`
        insert into study_generation_usage (user_id, usage_date, attempts)
        values (${userId}, (now() at time zone 'UTC')::date, 1)
        on conflict (user_id, usage_date) do update
        set attempts = study_generation_usage.attempts + 1
        where study_generation_usage.attempts < 20
        returning attempts`;
      return rows.length > 0;
    },

    async savePlan(userId, title, content) {
      const [row] = await sql`
        insert into study_plans (user_id, title, content)
        values (${userId}, ${title}, ${JSON.stringify(content)}::jsonb) returning id`;
      return row.id;
    },

    async listPlans(userId) {
      return sql`select id, title from study_plans where user_id = ${userId}
        order by created_at desc`;
    },

    async getPlan(userId, planId) {
      const [row] = await sql`
        select title, content from study_plans where user_id = ${userId} and id = ${planId}`;
      return row ?? null;
    },

    async deleteSession(tokenHash) {
      await sql`delete from sessions where token_hash = ${tokenHash}`;
    },
  };
}
