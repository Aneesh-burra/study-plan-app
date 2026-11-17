"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPlan } from "./actions";
import Plan from "./Plan";

export default function PlanForm() {
  const [state, action, pending] = useActionState(createPlan, null);

  return (
    <>
      <form className="plan-form" action={action}>
        <label>Course name<input name="title" required maxLength={100} placeholder="Intro to psychology" /></label>
        <label>Syllabus or notes
          <textarea name="material" required minLength={40} maxLength={18000} rows={8}
            placeholder="Paste topics, assignment deadlines, and lecture notes." />
        </label>
        <div className="plan-grid">
          <label>Weeks<input type="number" name="weeks" min={1} max={12} defaultValue={4} required /></label>
          <label>Hours per week<input type="number" name="hours" min={1} max={40} defaultValue={5} required /></label>
        </div>
        <button className="btn btn-primary" disabled={pending}>{pending ? "Generating…" : "Generate study plan"}</button>
        <p role="status">
          {state?.error}
          {state?.id && <Link href={`/dashboard?plan=${state.id}`}>Open your new study plan →</Link>}
        </p>
      </form>
      {state?.plan && <Plan plan={state.plan} />}
    </>
  );
}
