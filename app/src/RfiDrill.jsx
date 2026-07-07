import { useState } from 'react';
import { dealRfiSpot, RFI, RANGE_SRC, record } from './poker.js';
import Cards from './Cards.jsx';

export default function RfiDrill() {
  const [spot, setSpot] = useState(dealRfiSpot);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);

  const shouldOpen = RFI[spot.pos].has(spot.notation);
  const correct = shouldOpen ? 'open' : 'fold';

  const answer = (choice) => {
    if (picked) return;
    const ok = choice === correct;
    record('rfi', ok);
    setStreak(ok ? streak + 1 : 0);
    setPicked(choice);
  };

  const next = () => {
    setSpot(dealRfiSpot());
    setPicked(null);
  };

  return (
    <div className="card">
      <span className="streak">streak: {streak}</span>
      <p className="prompt">
        Folded to you at <strong>{spot.pos}</strong>. You hold <Cards cards={spot.cards} /> ({spot.notation}). Open or fold?
      </p>
      <div className="choices">
        <button disabled={!!picked} onClick={() => answer('open')}>Open (raise)</button>
        <button disabled={!!picked} onClick={() => answer('fold')}>Fold</button>
      </div>
      {picked && (
        <>
          <div className={`feedback ${picked === correct ? 'good' : 'bad'}`}>
            {picked === correct ? 'Correct.' : 'Not quite.'} Baseline: <strong>{correct.toUpperCase()}</strong> — {spot.notation} is {shouldOpen ? 'inside' : 'outside'} the {spot.pos} opening range.
            <br />
            <span className="small">{spot.pos} baseline: {RANGE_SRC[spot.pos]}</span>
          </div>
          <button className="next" onClick={next}>Next spot</button>
        </>
      )}
    </div>
  );
}
