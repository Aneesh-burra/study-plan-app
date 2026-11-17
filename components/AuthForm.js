"use client";

import { useActionState } from "react";
import Link from "next/link";

export default function AuthForm({ mode, action }) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="auth-form">
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={state.email ?? ""}
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : undefined}
          required
        />
        {isSignup && <small>At least 8 characters.</small>}
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "One moment..." : isSignup ? "Create account" : "Log in"}
      </button>
      <p className="auth-alt">
        {isSignup ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            New to StudyLane? <Link href="/signup">Create an account</Link>
          </>
        )}
      </p>
    </form>
  );
}
