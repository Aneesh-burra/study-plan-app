import { addDays, formatDate, planTasks } from "../../lib/plan-progress";
import ProgressButton from "./ProgressButton";

export function TaskList({ items, currentDate }) {
  return (
    <ul className="task-list">
      {items.map(item => (
        <li className={item.marked ? "task-complete" : undefined} key={item.plan + item.key}>
          <div>
            <span className="task-meta">
              {item.course && item.course + " · "}{item.kind}
              {item.date && " · " + formatDate(item.date)}
              {item.minutes > 0 && " · " + item.minutes + " min"}
              {item.date && item.date < currentDate && !item.marked && <strong> · Overdue</strong>}
              {item.date && item.date >= currentDate && item.date <= addDays(currentDate, 2) && !item.marked && item.kind !== "Study task" && <strong> · Due soon</strong>}
            </span>
            <strong className="task-title">{item.title}</strong>
          </div>
          <ProgressButton plan={item.plan} item={item} marked={item.marked} label="Mark done" doneLabel="Undo" />
        </li>
      ))}
    </ul>
  );
}

export default function Plan({ course, currentDate }) {
  const plan = course.content;
  const groups = new Map();
  for (const task of planTasks(plan).sort((a, b) => a.date.localeCompare(b.date))) {
    const weekday = task.date ? new Date(task.date).getUTCDay() : 0;
    const week = task.date ? formatDate(addDays(task.date, -((weekday + 6) % 7))) : "";
    if (!groups.has(week)) groups.set(week, []);
    groups.get(week).push({ ...task, plan: course.id, marked: Boolean(course.completed_tasks[task.key]) });
  }

  return (
    <div className="plan-result">
      <h3>{course.title}</h3>
      {plan.topics?.length > 0 && <p className="topic-list">{plan.topics.join(" · ")}</p>}
      <h4>Weekly schedule</h4>
      {groups.size === 0 && <p className="quiet">Add dated course work or more details to build a weekly schedule.</p>}
      {[...groups].map(([week, items]) => (
        <div className="plan-week" key={week}>
          {week && <h5>Week of {week}</h5>}
          <TaskList items={items} currentDate={currentDate} />
        </div>
      ))}
      {plan.deadlines?.length > 0 && (
        <details>
          <summary>View syllabus deadline sources</summary>
          <ul>{plan.deadlines.map(({ title, source, date }, index) => <li key={index}><strong>{title} · {formatDate(date, true)}</strong><p>{source}</p></li>)}</ul>
        </details>
      )}
      {plan.notesRequest && <p className="notice">{plan.notesRequest} <a href="#new-plan">Add course material</a></p>}
      {!!plan.quiz?.length && <h4>Practice quiz</h4>}
      {(plan.quiz ?? []).map((item, index) => {
        const key = "quiz-" + index;
        return (
          <details key={key} id={key}>
            <summary>{item.question} {course.missed_questions[key] && <span className="count">Review</span>}</summary>
            <p>{item.answer}</p>
            {item.source && <p className="source-quote">Source excerpt: {item.source}</p>}
            <ProgressButton plan={course.id} field="quiz" item={{ ...item, key }} marked={Boolean(course.missed_questions[key])} label="I missed this" doneLabel="Mark reviewed" />
          </details>
        );
      })}
      {!!plan.flashcards?.length && <h4>Flashcards</h4>}
      {(plan.flashcards ?? []).map(({ front, back, source }, index) => (
        <details key={index}><summary>{front}</summary><p>{back}</p>{source && <p className="source-quote">Source excerpt: {source}</p>}</details>
      ))}
    </div>
  );
}
