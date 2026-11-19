import Link from "next/link";
import { redirect } from "next/navigation";
import { getBillingState } from "../../lib/billing";
import { store } from "../../lib/db";
import { addDays, formatDate, planTasks, reviewItems, today } from "../../lib/plan-progress";
import { getUser } from "../../lib/session";
import { logout } from "../actions";
import { loadSample, openBilling } from "./actions";
import Plan, { TaskList } from "./Plan";
import PlanForm from "./PlanForm";

export const metadata = { title: "Dashboard | StudyLane" };
export const maxDuration = 90;

export default async function DashboardPage({ searchParams }) {
  const user = await getUser();
  if (!user) redirect("/login");
  const { plan, billing } = await searchParams;
  const [subscription, saved] = await Promise.all([
    getBillingState(user).catch(() => null),
    store.listPlans(user),
  ]);

  const selected = plan ? saved.find(item => item.id === plan) : saved[0];
  const date = today();
  const weekEnd = addDays(date, 6);
  const work = saved.flatMap(course => planTasks(course.content).map(task => ({
    ...task, plan: course.id, course: course.title, marked: Boolean(course.completed_tasks[task.key]),
  }))).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const due = work.filter(item => item.date && item.date <= weekEnd && (item.date >= date || !item.marked));
  const remaining = work.filter(item => !item.marked);
  const done = work.length - remaining.length;
  const next = remaining.filter(item => item.kind === "Study task").slice(0, 3);
  const missed = saved.flatMap(course => reviewItems(course).map(item => ({ ...item, course })));
  const name = user.is_demo ? "demo student" : user.email.split("@")[0];

  return (
    <main className="study-dashboard">
      <header className="dashboard-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>StudyLane</Link>
        <nav aria-label="Dashboard">
          {subscription?.paid && <a className="nav-link" href="#new-plan">New plan</a>}
          <form action={logout}><button className="link-btn nav-link">Log out</button></form>
        </nav>
      </header>

      <div className="dashboard-welcome">
        <div>
          <p className="eyebrow">{formatDate(date, true)}</p>
          <h1>Welcome, {name}.</h1>
          <p>{saved.length ? "Pick up where you left off." : "Add a course to start planning your week."}</p>
        </div>
        {!user.is_demo && subscription && (
          <form action={openBilling}>
            <button className="btn btn-small">{subscription.canManage ? "Manage subscription" : "Subscribe for $7/month"}</button>
          </form>
        )}
      </div>
      {billing === "error" && <p role="alert">Billing is unavailable. Please try again later.</p>}
      {billing === "canceled" && <p role="status">Checkout canceled. You can subscribe when you’re ready.</p>}
      {billing === "success" && <p role="status">{subscription?.paid ? "Your subscription is active." : "Stripe is confirming your payment. Check back shortly."}</p>}
      {!subscription && <p role="alert">Subscription status is temporarily unavailable.</p>}
      {subscription?.canManage && !subscription.paid && <p>Update your payment details in the billing portal to restore access.</p>}
      {!subscription?.paid && subscription && !subscription.canManage && <p>Subscribe to generate AI study plans, quizzes, and flashcards.</p>}
      {user.is_demo && !saved.some(course => course.is_sample) && (
        <form action={loadSample}><button className="btn btn-small">Load sample course</button></form>
      )}

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="panel-heading"><h2>Due this week</h2><span>{formatDate(date)} – {formatDate(weekEnd)}</span></div>
          {due.length ? <TaskList items={due} currentDate={date} /> : <p className="quiet">No due dates or study tasks in the next seven days.</p>}
        </section>
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <h2>Your progress</h2>
            <p><strong className="progress-number">{done}</strong> of {work.length} items complete</p>
            <progress aria-label="Completed study items" max={work.length || 1} value={done} />
            <small>{remaining.length} remaining across {saved.length} {saved.length === 1 ? "plan" : "plans"}</small>
          </section>
          <section className="dashboard-panel recommendation">
            <h2>Recommended next</h2>
            {next.length ? <ol>{next.map(task => (
              <li key={task.plan + task.key}>
                <Link href={"/dashboard?plan=" + task.plan + "#course"}>{task.title}</Link>
                <p>{task.why || "Continue your saved study schedule."}</p>
              </li>
            ))}</ol> : <p className="quiet">Your next study steps appear when you add a plan.</p>}
          </section>
        </div>
      </div>
      {missed.length > 0 && (
        <section className="dashboard-panel" id="review">
          <h2>Review missed questions <span className="count">{missed.length}</span></h2>
          <ul className="review-links">{missed.map(({ course, key, question }) => (
            <li key={course.id + key}><Link href={"/dashboard?plan=" + course.id + "#" + key}>{question}</Link> <small>{course.title}</small></li>
          ))}</ul>
        </section>
      )}
      {saved.length > 0 && (
        <section className="dashboard-panel" id="course">
          <h2>Saved study plans</h2>
          <nav className="course-tabs" aria-label="Saved study plans">
            {saved.map(({ id, title }) => <Link key={id} aria-current={selected?.id === id ? "page" : undefined} href={"/dashboard?plan=" + id + "#course"}>{title}</Link>)}
          </nav>
          {selected && <Plan course={selected} currentDate={date} />}
          {plan && !selected && <p role="status">That study plan could not be found.</p>}
        </section>
      )}
      {subscription?.paid && (
        <section className="dashboard-panel" id="new-plan">
          <h2>Build a study plan</h2>
          <p className="quiet">Add a syllabus for deadlines and lecture notes for practice.</p>
          <PlanForm key={selected?.id ?? "new"} course={selected?.is_sample ? "" : selected?.title} />
        </section>
      )}
    </main>
  );
}
