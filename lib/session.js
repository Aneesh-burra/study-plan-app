import { cookies } from "next/headers";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { store } from "./db";

const COOKIE = "studylane_session";
const DEMO_COOKIE = "studylane_demo_workspace";
const DAYS = 30;

// The browser holds the token. The database holds its SHA-256 hash.
const hashToken = token => createHash("sha256").update(token).digest("hex");
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: DAYS * 24 * 60 * 60,
};

export async function startSession(userId, isDemo = false) {
  const token = randomBytes(32).toString("base64url");
  await store.createSession(userId, hashToken(token), DAYS);
  const jar = await cookies();
  jar.set(COOKIE, token, options);
  if (isDemo) jar.set(DEMO_COOKIE, jar.get(DEMO_COOKIE)?.value || randomBytes(32).toString("base64url"), options);
}

export const getUser = cache(async () => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const user = await store.findSession(hashToken(token));
  if (!user) return null;
  return { ...user, workspace: user.is_demo ? hashToken(jar.get(DEMO_COOKIE)?.value || token) : "" };
});

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  jar.delete(COOKIE);
  if (token) {
    try {
      await store.deleteSession(hashToken(token));
    } catch (error) {
      console.error("Could not delete session row", error.code ?? error.name);
    }
  }
}
