import { neon } from "@neondatabase/serverless";
import { hashPassword } from "../lib/password.js";

if (!process.env.DATABASE_URL || !process.env.DEMO_PASSWORD) {
  throw new Error("Set DATABASE_URL and DEMO_PASSWORD before seeding.");
}

const sql = neon(process.env.DATABASE_URL);
const email = "demo@demo.com";
const hash = await hashPassword(process.env.DEMO_PASSWORD);
const rows = await sql`
  insert into users (email, password_hash, is_demo)
  values (${email}, ${hash}, true)
  on conflict (email) do update set password_hash = excluded.password_hash
  where users.is_demo
  returning id`;
if (!rows.length) throw new Error("The demo email belongs to an existing regular account.");
console.log("Demo account ready.");
