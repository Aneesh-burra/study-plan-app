import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAccess } from "../../lib/billing";
import { store } from "../../lib/db";
import { getUser } from "../../lib/session";
import { logout } from "../actions";
import { openBilling } from "./actions";
import Plan from "./Plan";
import PlanForm from "./PlanForm";

export const metadata = { title: "Dashboard | StudyLane" };
export const maxDuration = 90;

export default async function DashboardPage({ searchParams }) {
  const user = await getUser();
  if (!user) redirect("/login");
  const { plan, billing } = await searchParams;
  const validId = typeof plan === "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(plan);
  const [paid, saved, selected] = await Promise.all([
    hasAccess(user).catch(() => null),
    user.is_demo ? [] : store.listPlans(user.id),
    validId && !user.is_demo ? store.getPlan(user.id, plan) : null,
  ]);

  return (
    <main className="study-dashboard">
      <header className="dashboard-header">
        <Link className="brand" href="/">StudyLane</Link>
        <form action={logout}><button className="btn">Log out</button></form>
      </header>
      <section className="auth-card">
        <h1>Your study plans</h1>
        <p className="auth-intro">Signed in as <strong>{user.email}</strong>.</p>
        {billing === "error" && <p role="alert">Billing is unavailable. Please try again later.</p>}
        {billing === "success" && !paid && <p role="status">Your payment is being confirmed. Refresh in a moment.</p>}
        {paid === null && <p role="alert">Subscription status is temporarily unavailable.</p>}
        {!user.is_demo && paid !== null && (
          <form action={openBilling}>
            <button className="btn">{paid ? "Manage subscription" : "Subscribe for $7/month"}</button>
          </form>
        )}
        {paid && <PlanForm />}
        {saved.length > 0 && (
          <>
            <h2>Saved plans</h2>
            <ul>{saved.map(({ id, title }) => <li key={id}><Link href={`/dashboard?plan=${id}`}>{title}</Link></li>)}</ul>
          </>
        )}
        {selected && <section><h2>{selected.title}</h2><Plan plan={selected.content} /></section>}
        {plan && !selected && <p>That study plan could not be found.</p>}
      </section>
    </main>
  );
}
