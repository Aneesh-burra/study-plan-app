# StudyLane

StudyLane turns syllabus text and lecture notes into a weekly schedule, practice quizzes, and flashcards. Built with Next.js, Neon Postgres, OpenAI, and Stripe.

## Local setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local`. Set `DATABASE_URL` to a Neon connection and `OPENAI_API_KEY` to a funded server-side OpenAI key.
3. For checkout, create a recurring $7 USD monthly price in Stripe and set `STRIPE_PRICE_ID` and its matching `STRIPE_SECRET_KEY`. Enable the Stripe customer portal so subscribers can manage or cancel a subscription.
4. Run `npm run db:migrate`. The migration also upgrades the original accounts database in place.
5. To create the assignment demo, add `DEMO_PASSWORD` with the assigned password to your local env file and run `node --env-file=.env.local scripts/seed-demo.mjs`. Sign in normally as `demo@demo.com`. The demo has paid feature access and keeps generated plans in its current page only because its credentials are shared.
6. Run `npm run dev` and visit http://localhost:3000.

## Production setup

Run the migration and seed against the production Neon database before deploying the code. In Vercel, set the production database, OpenAI and Stripe variables listed in `.env.example`, with `APP_URL` set to the public app origin. Use matching live-mode Stripe keys and prices to accept real payments. The seed password is only needed when running the seed script. Keep secrets in environment variables and out of Git.

Push to the GitHub branch connected to Vercel, check the production deployment, and verify signup, logout, repeat login, the seeded demo login and AI generation, and Stripe Checkout. StudyLane checks Stripe directly for active subscriber access. Generation is capped at 20 attempts per account per UTC day, including the shared demo.

For the Canvas submission, sign up a fresh account and capture Neon’s users table showing the real signup rows. Hide the password_hash column in the screenshot. Put the screenshot and the public Vercel and GitHub URLs on one page.
