# StudyLane

Landing page for StudyLane (placeholder name), a planned $7/month web app that turns college students' syllabi and notes into a week-by-week study schedule, practice quizzes, and flashcards.

Built by Aneesh Burra. Next.js (App Router), plain JavaScript and CSS, no backend yet.

## Run locally

Requires Node.js 20.9 or newer (https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3000. The page reloads as you edit `app/page.js` or `app/globals.css`.

To test the production build:

```bash
npm run build
npm start
```

## Accounts and database (Neon Postgres)

Sign up, log in, log out and persistent login are built in. Users and sessions live in Postgres via the `DATABASE_URL` environment variable.

- Passwords are hashed with scrypt (salted) and never stored in plain text.
- The browser gets a random token in an httpOnly cookie. The database stores only its SHA-256 hash, and sessions last 30 days.
- Tables are defined in `db/schema.sql` (`users`, `sessions`).

Local setup:

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your Neon connection string (or run `vercel env pull .env.local`).
2. Create the tables: `npm run db:migrate`, or paste `db/schema.sql` into the Neon SQL Editor.
3. `npm run dev`, then try /signup.

On Vercel, add `DATABASE_URL` under Project Settings > Environment Variables (the Neon integration does this for you), then redeploy.

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. At vercel.com, choose **Add New... > Project** and import the repo.
3. Keep the detected Next.js settings and click **Deploy**.

## Layout

- `app/page.js`: homepage content
- `app/actions.js`: sign up, log in, log out
- `lib/`: database access, password hashing, sessions
- `db/schema.sql`: table definitions
- `app/layout.js`: page title and description
- `app/globals.css`: styles
- `app/icon.svg`: favicon
