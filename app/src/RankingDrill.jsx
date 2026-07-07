import { useState } from 'react';
import { dealShowdown, scoreName, record } from './poker.js';
import Cards from './Cards.jsx';

export default function RankingDrill() {
  const [spot, setSpot] = useState(dealShowdown);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);

  const correct = spot.win === 0 ? 'split' : spot.win > 0 ? 'a' : 'b';

  const answer = (choice) => {
    if (picked) return;
    const ok = choice === correct;
    record('rankings', ok);
    setStreak(ok ? streak + 1 : 0);
    setPicked(choice);
  };

  const next = () => {
    setSpot(dealShowdown());
    setPicked(null);
  };

  return (
    <div className="card">
      <span className="streak">streak: {streak}</span>
      <p className="prompt">Which hand wins at showdown?</p>
      <div className="label">Board</div>
      <Cards cards={spot.board} />
      <div className="label">Hand A</div>
      <Cards cards={spot.a} />
      <div className="label">Hand B</div>
      <Cards cards={spot.b} />
      <div className="choices">
        <button disabled={!!picked} onClick={() => answer('a')}>Hand A</button>
        <button disabled={!!picked} onClick={() => answer('b')}>Hand B</button>
        <button disabled={!!picked} onClick={() => answer('split')}>Split pot</button>
      </div>
      {picked && (
        <>
          <div className={`feedback ${picked === correct ? 'good' : 'bad'}`}>
            {picked === correct ? 'Correct.' : `Not quite — the answer is ${correct === 'split' ? 'split pot' : `Hand ${correct.toUpperCase()}`}.`}
            <br />
            Hand A: {scoreName(spot.sa)}. Hand B: {scoreName(spot.sb)}.
          </div>
          <button className="next" onClick={next}>Next hand</button>
        </>
      )}
    </div>
  );
}
