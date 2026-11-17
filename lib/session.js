import { cookies } from "next/headers";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { store } from "./db";

const COOKIE = "studylane_session";
const DAYS = 30;

// The browser holds a random token. The database holds only its SHA-256 hash,
// so a leaked database cannot be used to log in as anyone.
const hashToken = (token) => createHash("sha256").update(token).digest("hex");

export async function startSession(userId) {
  const token = randomBytes(32).toString("base64url");
  await store.createSession(userId, hashToken(token), DAYS);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 24 * 60 * 60,
  });
}

// Returns { id, email } for the logged-in user, or null.
export const getUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return store.findSession(hashToken(token));
});

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  jar.delete(COOKIE);
  if (token) {
    try {
      await store.deleteSession(hashToken(token));
    } catch (e) {
      console.error("Could not delete session row", e);
    }
  }
}
