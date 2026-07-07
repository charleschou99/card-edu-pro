// Beginner "learn this first" panel shown above each drill: one video + short reads.
const LEARN = {
  rankings: {
    video: { id: 'pSRGErzzIo4', title: 'How to Play Poker for Beginners — PokerStars Learn', mins: 7 },
    links: [
      ['Hand rankings chart (what beats what)', 'https://www.pokerstars.com/poker/games/rules/hand-rankings/'],
      ['PokerNews hand rankings + free PDF cheat sheet', 'https://www.pokernews.com/poker-hands/'],
    ],
    tip: 'Memorize the order first: high card < pair < two pair < trips < straight < flush < full house < quads < straight flush.',
  },
  rfi: {
    video: { id: 'OHRQVy16pA0', title: 'Why Position Is EVERYTHING In Poker — Jonathan Little', mins: 44 },
    links: [
      ['Poker positions explained (PokerStars Learn)', 'https://www.pokerstars.com/poker/learn/lesson/position/'],
      ['Free preflop charts (PokerCoaching)', 'https://pokercoaching.com/preflop-charts/'],
    ],
    tip: 'Core idea: the later you act, the more hands you can open. UTG is tightest, the button is widest.',
  },
  potodds: {
    video: { id: 'Y_dVZYyBxjg', title: 'How To Use Pot Odds In Poker — SplitSuit (5 min)', mins: 5 },
    links: [
      ['Pot odds lesson (PokerStars Learn)', 'https://www.pokerstars.com/poker/learn/lesson/pot-odds/'],
      ['Rule of 4 and 2 explained', 'https://www.splitsuit.com/easy-poker-pot-odds'],
    ],
    tip: 'Two formulas cover everything here: required % = call / (pot + bet + call), and equity ≈ outs × 4 on the flop, × 2 on the turn.',
  },
};

export default function LearnPanel({ module }) {
  const l = LEARN[module];
  if (!l) return null;
  return (
    <details className="learn">
      <summary>
        New to this? Watch first
        <span className="learn-hint">{l.video.mins} min video + quick reads</span>
      </summary>
      <div className="video-wrap">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${l.video.id}`}
          title={l.video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="small">
        {l.video.title} · <a href={`https://www.youtube.com/watch?v=${l.video.id}`} target="_blank" rel="noreferrer">open on YouTube</a>
      </div>
      <ul className="small">
        {l.links.map(([label, url]) => (
          <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>
        ))}
      </ul>
      <p className="small">{l.tip}</p>
    </details>
  );
}
