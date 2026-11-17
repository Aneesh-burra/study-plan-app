import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "../../lib/session";
import { logout } from "../actions";

export const metadata = { title: "Dashboard | StudyLane" };

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <main className="auth-page">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        StudyLane
      </Link>
      <div className="auth-card">
        <h1>You are signed in</h1>
        <p className="auth-intro">
          Signed in as <strong>{user.email}</strong>.
        </p>
        <p className="auth-intro">
          Uploading syllabi and generating schedules is not built yet. This page is where it will
          live.
        </p>
        <form action={logout}>
          <button className="btn" type="submit">
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
