import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { getUser } from "../lib/session";
import { logout } from "../app/actions";

export default async function AuthNav() {
  let user = null;
  try {
    user = await getUser();
  } catch (e) {
    unstable_rethrow(e); // let Next.js internal signals (e.g. "this page is dynamic") through
    console.error(e); // a database problem: show logged-out nav rather than breaking the page
  }

  if (user) {
    return (
      <div className="nav-actions">
        <Link className="nav-link" href="/dashboard">
          Dashboard
        </Link>
        <form action={logout}>
          <button className="nav-link link-btn" type="submit">
            Log out
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="nav-actions">
      <Link className="nav-link" href="/login">
        Log in
      </Link>
      <Link className="btn btn-small" href="/signup">
        Sign up
      </Link>
    </div>
  );
}
