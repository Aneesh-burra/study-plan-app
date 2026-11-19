"use client";

import { useActionState } from "react";
import { updateProgress } from "./actions";

export default function ProgressButton({ plan, field = "task", item, marked, label, doneLabel }) {
  const [state, action, pending] = useActionState(updateProgress, null);
  const text = marked ? doneLabel : label;
  return (
    <form action={action} className="progress-action">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="key" value={item.key} />
      <input type="hidden" name="marked" value={String(!marked)} />
      <button className="task-button" aria-label={text + ": " + (item.title ?? item.question)} disabled={pending}>
        {pending ? "Saving…" : text}
      </button>
      {state?.error && <small role="alert">{state.error}</small>}
    </form>
  );
}
