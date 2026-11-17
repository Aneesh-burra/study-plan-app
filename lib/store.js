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
        select u.id, u.email
        from sessions s join users u on u.id = s.user_id
        where s.token_hash = ${tokenHash} and s.expires_at > now()`;
      return rows[0] ?? null;
    },

    async deleteSession(tokenHash) {
      await sql`delete from sessions where token_hash = ${tokenHash}`;
    },
  };
}
