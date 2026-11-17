import Link from "next/link";

export default function AuthShell({ title, intro, children }) {
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
        <h1>{title}</h1>
        {intro && <p className="auth-intro">{intro}</p>}
        {children}
      </div>
    </main>
  );
}
