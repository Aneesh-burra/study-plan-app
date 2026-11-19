import { addDays, today } from "./plan-progress";

export function samplePlan() {
  const date = day => addDays(today(), day);
  return {
    topics: ["Free-body diagrams", "Static equilibrium", "Moments"],
    deadlines: [
      { title: "Beam reaction problem set", date: date(2), kind: "Assignment", source: "Sample course schedule" },
      { title: "Statics quiz", date: date(4), kind: "Exam", source: "Sample course schedule" },
    ],
    tasks: [
      { title: "Draw the beam’s free-body diagram", date: date(0), minutes: 20, why: "Label the pin and roller reactions before starting the beam problem set." },
      { title: "Solve two support-reaction problems", date: date(1), minutes: 35, why: "Practice taking moments about the pin before the problem set is due." },
      { title: "Quiz yourself on equilibrium", date: date(3), minutes: 25, why: "Recall the three equilibrium equations before the statics quiz." },
    ],
    quiz: [
      { question: "Which equations describe planar static equilibrium?", answer: "The sums of horizontal forces, vertical forces, and moments each equal zero." },
      { question: "Why take moments about the pin?", answer: "The pin reactions pass through that point and contribute no moment about it." },
    ],
    flashcards: [
      { front: "Planar pin support", back: "A pin supplies two reaction components and allows rotation." },
      { front: "Moment arm", back: "The perpendicular distance from the reference point to the force’s line of action." },
    ],
    notesRequest: "",
  };
}
