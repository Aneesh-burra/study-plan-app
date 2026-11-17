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

const audience = [
  {
    color: "--lane-a",
    title: "Four courses, four syllabi",
    text: "Each class has its own deadlines, readings and exam dates. StudyLane puts them into one plan so nothing gets buried.",
  },
  {
    color: "--lane-b",
    title: "Not sure where to start each week",
    text: "You get a clear list of what to study and when, instead of spending Sunday night deciding what to work on.",
  },
  {
    color: "--lane-c",
    title: "Studying from your own material",
    text: "Quizzes and flashcards come from your syllabi and notes, so practice matches what your professors actually teach.",
  },
];

const steps = [
  {
    title: "Add your syllabi and notes",
    text: "Paste syllabus text, deadlines, and lecture notes to build a plan for a course or a group of courses.",
  },
  {
    title: "Get your weekly schedule",
    text: "StudyLane lays out what to study each week across all your courses, working around your exams and deadlines.",
  },
  {
    title: "Study with quizzes and flashcards",
    text: "Practice with quizzes and flashcards generated from your own course material, so you study what you will actually be tested on.",
  },
];

const reasons = [
  [
    "One plan for every course.",
    " One subscription covers all your courses.",
  ],
  [
    "It replaces hours of planning.",
    " The schedule, quizzes and flashcards are built for you instead of by you.",
  ],
  [
    "It is built from your material.",
    " Practice questions and flashcards come from your own syllabi and notes.",
  ],
  [
    "It costs about one coffee a month.",
    " $7 is easy to justify if it keeps your semester organized.",
  ],
];

export default function Home() {
  return (
    <>
      <header>
        <div className="wrap">
          <a className="brand" href="#top" aria-label="StudyLane home">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            StudyLane
          </a>
          <div className="header-right">
            <span className="byline-small">
              Built by <strong>Aneesh Burra</strong>
            </span>
            <AuthNav />
          </div>
        </div>
      </header>

      <main id="top">
        <div className="wrap hero">
          <h1>Every course, one study plan.</h1>
          <p className="lede">
            StudyLane is for <strong>college students juggling several courses</strong>. Paste
            your syllabi and notes, and it builds a week-by-week study schedule, practice quizzes,
            and flashcards for every class. Instead of piecing together deadlines and exam dates
            yourself, you get one plan that fits all your courses at once, for $7 a month.
          </p>
          <div className="cta-row">
            <a className="btn" href="#how">
              See how it works
            </a>
            <span className="price-note">
              <strong>$7</strong> / month
            </span>
          </div>

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
        </div>

        <section id="who">
          <div className="wrap">
            <h2>Made for students with a full course load</h2>
            <p className="section-intro">
              If you are taking several classes at once, the hard part is rarely the material. It is
              keeping track of all of it.
            </p>
            <ul className="who">
              {audience.map((a) => (
                <li key={a.title} style={{ "--c": `var(${a.color})` }}>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2>How it works</h2>
            <p className="section-intro">
              Three steps, and setup takes about as long as finding your syllabi.
            </p>
            <ol className="steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="pricing">
              <div>
                <h2>Why it is worth $7 a month</h2>
                <p>One flat price covers all of your courses this semester.</p>
                <ul className="reasons">
                  {reasons.map(([lead, rest]) => (
                    <li key={lead}>
                      <strong>{lead}</strong>
                      {rest}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="price">
                $7<small>/month</small>
              </div>
            </div>
          </div>
        </section>

        <div className="built-by">
          <div className="wrap">
            <p className="label">Built by</p>
            <span className="name">Aneesh Burra</span>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">StudyLane is a placeholder name. Early concept page.</div>
      </footer>
    </>
  );
}
