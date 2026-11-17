export default function Plan({ plan }) {
  return (
    <div className="plan-result">
      <h2>Weekly schedule</h2>
      {plan.weeks.map(({ title, sessions }, index) => (
        <section key={index}>
          <h3>{title}</h3>
          <ul>{sessions.map((session, index) => <li key={index}>{session}</li>)}</ul>
        </section>
      ))}
      <h2>Practice quiz</h2>
      {plan.quiz.map(({ question, answer }, index) => (
        <details key={index}><summary>{question}</summary><p>{answer}</p></details>
      ))}
      <h2>Flashcards</h2>
      {plan.flashcards.map(({ front, back }, index) => (
        <details key={index}><summary>{front}</summary><p>{back}</p></details>
      ))}
    </div>
  );
}
