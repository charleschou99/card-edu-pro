import { useState } from 'react';
import RankingDrill from './RankingDrill.jsx';
import RfiDrill from './RfiDrill.jsx';
import PotOddsDrill from './PotOddsDrill.jsx';
import LearnPanel from './LearnPanel.jsx';
import { loadStats, MODULES } from './poker.js';

function Dashboard() {
  const stats = loadStats();
  const rows = Object.entries(MODULES).map(([key, label]) => {
    const m = stats[key];
    const pct = (c, n) => (n ? `${Math.round((100 * c) / n)}%` : '—');
    const recentAcc = m?.recent?.length
      ? Math.round((100 * m.recent.reduce((a, b) => a + b, 0)) / m.recent.length)
      : null;
    return { key, label, attempts: m?.attempts ?? 0, acc: pct(m?.correct ?? 0, m?.attempts ?? 0), recentAcc };
  });
  const eligible = rows.filter((r) => r.attempts >= 10);
  const weakest = eligible.length === rows.length
    ? eligible.reduce((a, b) => (a.recentAcc <= b.recentAcc ? a : b))
    : null;

  return (
    <>
      <div className="card">
        <table>
          <thead>
            <tr><th>Drill</th><th>Attempts</th><th>Accuracy</th><th>Last 20</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td>{r.label}</td>
                <td>{r.attempts}</td>
                <td>{r.acc}</td>
                <td>{r.recentAcc == null ? '—' : `${r.recentAcc}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="callout">
        {weakest
          ? <>Focus for today's study block: <strong>{weakest.label}</strong> (last-20 accuracy {weakest.recentAcc}%).</>
          : <>Do at least 10 reps in each drill to unlock a focus recommendation.</>}
      </div>
      <div className="card small">
        Study sources: <a href="https://pokercoaching.com/preflop-charts/">preflop charts</a> · <a href="https://www.pokerstars.com/poker/learn/lesson/pot-odds/">pot odds</a> · your local cheatsheet at <code>reference/0001-6max-preflop-baseline-cheatsheet.html</code>
      </div>
    </>
  );
}

const TABS = {
  Dashboard: { comp: Dashboard },
  'Hand rankings': { comp: RankingDrill, module: 'rankings' },
  'Open or fold': { comp: RfiDrill, module: 'rfi' },
  'Pot odds': { comp: PotOddsDrill, module: 'potodds' },
};

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const { comp: Active, module } = TABS[tab];
  return (
    <>
      <h1>Card Edu Pro — Poker Trainer</h1>
      <p className="meta">Foundation phase: position discipline, preflop selection, pot-odds math.</p>
      <nav>
        {Object.keys(TABS).map((name) => (
          <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>
            {name}
          </button>
        ))}
      </nav>
      {module && <LearnPanel module={module} />}
      <Active />
    </>
  );
}
