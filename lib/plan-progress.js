export const planIdPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
export const today = () => new Date().toISOString().slice(0, 10);

export function addDays(date, days) {
  return new Date(Date.parse(date) + days * 86400000).toISOString().slice(0, 10);
}

export function formatDate(date, year = false) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
    ...(year ? { year: "numeric" } : {}),
  }).format(new Date(date));
}

export function planTasks(content) {
  const tasks = content.tasks ?? (content.weeks ?? []).flatMap(({ sessions }) =>
    sessions.map(title => ({ title, date: "", minutes: 0, why: "" })));
  return [
    ...tasks.map((task, index) => ({ ...task, key: "task-" + index, kind: "Study task" })),
    ...(content.deadlines ?? []).map((entry, index) => ({ ...entry, key: "deadline-" + index })),
  ];
}

export function reviewItems(plan) {
  return (plan.content.quiz ?? []).flatMap((question, index) =>
    plan.missed_questions["quiz-" + index] ? [{ ...question, key: "quiz-" + index }] : []);
}
