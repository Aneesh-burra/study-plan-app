"use client";

import { useActionState } from "react";
import { createPlan } from "./actions";

export default function PlanForm({ course }) {
  const [state, action, pending] = useActionState(createPlan, null);

  return (
    <form className="plan-form" action={action}>
      <label>Course name<input name="title" required maxLength={100} defaultValue={course} placeholder="Engineering Statics" /></label>
      <div className="plan-grid">
        <div className="material-field">
          <label>Syllabus<textarea name="syllabus" maxLength={24000} rows={5} placeholder="Paste topics and dated assignments or exams." /></label>
          <label>Upload syllabus<input name="syllabusFile" type="file" accept=".pdf,.txt,.md" /></label>
        </div>
        <div className="material-field">
          <label>Lecture notes<textarea name="notes" maxLength={24000} rows={5} placeholder="Paste lecture notes or worked examples for practice." /></label>
          <label>Upload notes<input name="notesFile" type="file" accept=".pdf,.txt,.md" /></label>
        </div>
      </div>
      <small>PDF, TXT, or Markdown, up to 1 MB per file.</small>
      <div className="plan-grid">
        <label>Weeks<input type="number" name="weeks" min={1} max={12} defaultValue={4} required /></label>
        <label>Hours per week<input type="number" name="hours" min={1} max={40} defaultValue={5} required /></label>
      </div>
      <button className="btn btn-primary" disabled={pending}>{pending ? "Generating…" : "Generate study plan"}</button>
      <div role="status">{pending ? "Reading your materials and building a schedule…" : state?.error}</div>
    </form>
  );
}
