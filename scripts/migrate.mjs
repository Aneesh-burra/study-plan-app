// Creates the users and sessions tables in the database at DATABASE_URL.
// Run with: npm run db:migrate   (reads DATABASE_URL from .env.local)
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.STUDY_LANE_DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Put it in .env.local first.");
  process.exit(1);
}

const sql = neon(url);
const statements = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Done: ran ${statements.length} statements.`);
