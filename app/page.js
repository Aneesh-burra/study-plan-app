import Link from "next/link";
import AuthNav from "../components/AuthNav";

const workflow = [
  ["Add your course", "Upload a syllabus or paste the text. Add lecture notes to make practice questions specific to your class."],
  ["Get a plan around your deadlines", "StudyLane pulls out dated work and schedules focused study blocks before it’s due."],
  ["Pick up where you left off", "Check off assignments and study blocks, then revisit quiz questions you missed. Your progress stays with your account."],
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="StudyLane home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>StudyLane</Link>
          <AuthNav />
        </div>
      </header>
      <main>
        <div className="wrap hero product-hero">
          <p className="eyebrow">Study planning for college students</p>
          <h1>Know what to study next.</h1>
          <p className="lede">Turn your syllabi and notes into a weekly plan. See what’s due, practice with your course material, and pick up where you left off.</p>
          <div className="cta-row">
            <Link className="btn" href="/signup">Get started</Link>
            <a className="nav-link" href="#how">How it works ↓</a>
            <span className="price-note"><strong>$7</strong> / month</span>
          </div>
        </div>
        <section className="wrap workflow" id="how">
          <h2>From syllabus to study session</h2>
          <ol className="steps">{workflow.map(([title, description]) => (
            <li key={title}><h3>{title}</h3><p>{description}</p></li>
          ))}</ol>
        </section>
        <section className="wrap" id="pricing">
          <div className="pricing">
            <div>
              <h2>One subscription for all your courses</h2>
              <p>Get AI study plans, course quizzes, flashcards, and progress tracking in one place.</p>
              <Link className="btn" href="/signup">Create an account</Link>
            </div>
            <div className="price">$7<small>/month</small></div>
          </div>
        </section>
      </main>
      <footer>StudyLane · Built by Aneesh Burra</footer>
    </>
  );
}
