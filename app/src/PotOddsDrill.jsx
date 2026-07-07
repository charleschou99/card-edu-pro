import { useState } from 'react';
import { potOddsQuestion, record } from './poker.js';

export default function PotOddsDrill() {
  const [q, setQ] = useState(potOddsQuestion);
  const [given, setGiven] = useState('');
  const [result, setResult] = useState(null); // { ok }
  const [streak, setStreak] = useState(0);

  const finish = (ok) => {
    record('potodds', ok);
    setStreak(ok ? streak + 1 : 0);
    setResult({ ok });
  };

  const submitNumeric = (e) => {
    e.preventDefault();
    if (result || given === '') return;
    finish(Math.abs(parseFloat(given) - q.answer) <= 1); // ±1% tolerance
  };

  const answerDecision = (choice) => {
    if (result) return;
    finish(choice === q.answer);
  };

  const next = () => {
    setQ(potOddsQuestion());
    setGiven('');
    setResult(null);
  };

  return (
    <div className="card">
      <span className="streak">streak: {streak}</span>
      <p className="prompt">{q.prompt}</p>
      {q.type === 'decision' ? (
        <div className="choices">
          <button disabled={!!result} onClick={() => answerDecision('call')}>Call</button>
          <button disabled={!!result} onClick={() => answerDecision('fold')}>Fold</button>
        </div>
      ) : (
        <form className="choices" onSubmit={submitNumeric}>
          <input
            type="number"
            step="0.1"
            value={given}
            disabled={!!result}
            onChange={(e) => setGiven(e.target.value)}
            placeholder="%"
            autoFocus
          />
          <button type="submit" disabled={!!result}>Check</button>
        </form>
      )}
      {result && (
        <>
          <div className={`feedback ${result.ok ? 'good' : 'bad'}`}>
            {result.ok ? 'Correct.' : `Not quite — answer: ${q.answer}${q.type === 'decision' ? '' : '%'}.`}
            <br />
            {q.explain}
          </div>
          <button className="next" onClick={next}>Next question</button>
        </>
      )}
    </div>
  );
}
