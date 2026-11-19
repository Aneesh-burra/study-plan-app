import Image from "next/image";
import Link from "next/link";
import AuthNav from "../components/AuthNav";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// type: "" = study block, "quiz" = quiz day, "empty" = rest day
const lanes = [
  {
    name: "Organic Chem",
    color: "--lane-a",
    slots: [
      ["Read ch. 7"],
      ["Rest", "empty"],
      ["Flashcards: reactions"],
      ["Practice set"],
      ["Quiz", "quiz"],
    ],
  },
  {
    name: "Statistics",
    color: "--lane-b",
    slots: [
      ["Lecture notes"],
      ["Problem set 4"],
      ["Rest", "empty"],
      ["Quiz", "quiz"],
      ["Review misses"],
    ],
  },
  {
    name: "Macroeconomics",
    color: "--lane-c",
    slots: [
      ["Rest", "empty"],
      ["Read ch. 11"],
      ["Flashcards: terms"],
      ["Midterm outline"],
      ["Quiz", "quiz"],
    ],
  },
  {
    name: "Intro to Programming",
    color: "--lane-d",
    slots: [
      ["Lab 5"],
      ["Quiz", "quiz"],
      ["Debug practice"],
      ["Rest", "empty"],
      ["Lab 6 start"],
    ],
  },
];

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
        <figure className="wrap dashboard-shot">
          <Image src="/dashboard.png" width={1164} height={710} sizes="(max-width: 1120px) calc(100vw - 40px), 1080px"
            alt="The StudyLane dashboard showing dated statics tasks, one completed item, and two recommended next steps." />
          <figcaption>The StudyLane dashboard with a sample statics course.</figcaption>
        </figure>
        <section className="wrap weekly-preview" aria-labelledby="weekly-preview-title">
          <h2 id="weekly-preview-title">One week, four courses</h2>
          <div
            className="board"
            role="img"
            aria-label="Example week of a study schedule with one lane per course, showing readings, flashcards, and quizzes."
          >
            <div className="board-head" aria-hidden="true">
              <span>This week</span>
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            {lanes.map((lane) => (
              <div
                className="lane"
                key={lane.name}
                style={{ "--c": `var(${lane.color})` }}
                aria-hidden="true"
              >
                <div className="lane-name">{lane.name}</div>
                {lane.slots.map(([label, type], i) => (
                  <div className={`slot${type ? ` ${type}` : ""}`} key={i}>
                    {label}
                  </div>
                ))}
              </div>
            ))}
            <p className="board-caption">
              Illustration of the kind of schedule StudyLane generates. Course names are examples.
            </p>
          </div>
        </section>
        <section className="wrap student-example" aria-labelledby="student-example-title">
          <div className="student-card">
            <figure>
              <Image src="/study-group.webp" width={960} height={640} sizes="(max-width: 720px) calc(100vw - 40px), 540px"
                alt="Illustration of three college students studying together in a campus library." />
              <figcaption>Illustrative image</figcaption>
            </figure>
            <div>
              <p className="eyebrow">Example study week</p>
              <h2 id="student-example-title">A plan for a busy week</h2>
              <p>A student has a beam problem set due Saturday and a statics quiz Monday. They start with a free-body diagram, check it off, and come back to two support-reaction problems. StudyLane keeps their place and puts quiz review next on the plan.</p>
              <Link className="nav-link" href="/login">Try the sample course in the demo →</Link>
            </div>
          </div>
        </section>
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
