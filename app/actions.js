"use server";

import { redirect } from "next/navigation";
import { store } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/password";
import { startSession, endSession } from "../lib/session";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readForm(formData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

function failure(error, email) {
  console.error(error);
  const message =
    error?.message === "DATABASE_URL is not set"
      ? "The database is not configured yet (DATABASE_URL is missing)."
      : error?.code === "42P01"
        ? "The database tables are missing. Run db/schema.sql in your Neon database."
        : "Something went wrong. Please try again.";
  return { error: message, email };
}

// Compared against when the email is unknown, so "no such user" and
// "wrong password" take about the same time.
let dummyHash;
const getDummyHash = () => (dummyHash ??= hashPassword("not-a-real-password"));

export async function signup(_prev, formData) {
  const { email, password } = readForm(formData);
  if (email === "demo@demo.com") return { error: "Use the login page for the demo account.", email };
  if (!EMAIL.test(email) || email.length > 254) {
    return { error: "Enter a valid email address.", email };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", email };
  }
  if (password.length > 128) {
    return { error: "Password must be 128 characters or fewer.", email };
  }

  let user;
  try {
    user = await store.createUser(email, await hashPassword(password));
    if (user) await startSession(user.id);
  } catch (e) {
    return failure(e, email);
  }
  if (!user) {
    return { error: "An account with that email already exists. Try logging in.", email };
  }
  redirect("/dashboard");
}

export async function login(_prev, formData) {
  const { email, password } = readForm(formData);
  if (!email || !password || password.length > 128) {
    return { error: "Incorrect email or password.", email };
  }

  try {
    const found = await store.findUserByEmail(email);
    const ok = await verifyPassword(password, found ? found.password_hash : await getDummyHash());
    if (!found || !ok) {
      return { error: "Incorrect email or password.", email };
    }
    await startSession(found.id, found.email === "demo@demo.com");
  } catch (e) {
    return failure(e, email);
  }
  redirect("/dashboard");
}

export async function logout() {
  await endSession();
  redirect("/");
}
