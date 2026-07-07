// Core poker logic: deck, 7-card evaluator, preflop ranges, drill generators, stats.

export const RANKS = '23456789TJQKA';
export const SUITS = ['s', 'h', 'd', 'c'];
export const SUIT_GLYPH = { s: '\u2660', h: '\u2665', d: '\u2666', c: '\u2663' };

const rv = (card) => RANKS.indexOf(card[0]);

export function newDeck() {
  const d = [];
  for (const r of RANKS) for (const s of SUITS) d.push(r + s);
  return d;
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---- Hand evaluation ----
// Score: [category, ...tiebreakers], compare lexicographically.
// Categories: 8 straight flush, 7 quads, 6 full house, 5 flush,
// 4 straight, 3 trips, 2 two pair, 1 pair, 0 high card.
export function eval5(cards) {
  const vals = cards.map(rv).sort((a, b) => b - a);
  const flush = cards.every((c) => c[1] === cards[0][1]);
  const uniq = [...new Set(vals)];
  let straightHigh = -1;
  if (uniq.length === 5) {
    if (uniq[0] - uniq[4] === 4) straightHigh = uniq[0];
    else if (uniq[0] === 12 && uniq[1] === 3) straightHigh = 3; // wheel A-5
  }
  const counts = {};
  for (const v of vals) counts[v] = (counts[v] || 0) + 1;
  const groups = Object.entries(counts)
    .map(([v, n]) => [n, +v])
    .sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  const tb = groups.map((g) => g[1]);
  if (flush && straightHigh >= 0) return [8, straightHigh];
  if (groups[0][0] === 4) return [7, ...tb];
  if (groups[0][0] === 3 && groups[1][0] === 2) return [6, ...tb];
  if (flush) return [5, ...vals];
  if (straightHigh >= 0) return [4, straightHigh];
  if (groups[0][0] === 3) return [3, ...tb];
  if (groups[0][0] === 2 && groups[1][0] === 2) return [2, ...tb];
  if (groups[0][0] === 2) return [1, ...tb];
  return [0, ...vals];
}

// ponytail: brute-force best-of-21 five-card combos; fine at drill volume.
export function evalBest(cards7) {
  let best = null;
  for (let a = 0; a < 7; a++) {
    for (let b = a + 1; b < 7; b++) {
      const five = cards7.filter((_, i) => i !== a && i !== b);
      const s = eval5(five);
      if (!best || cmpScore(s, best) > 0) best = s;
    }
  }
  return best;
}

export function cmpScore(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? -1) - (b[i] ?? -1);
    if (d) return Math.sign(d);
  }
  return 0;
}

const rn = (v) => ({ T: '10', J: 'Jack', Q: 'Queen', K: 'King', A: 'Ace' }[RANKS[v]] || RANKS[v]);

export function scoreName(s) {
  switch (s[0]) {
    case 8: return `Straight flush, ${rn(s[1])} high`;
    case 7: return `Four of a kind, ${rn(s[1])}s`;
    case 6: return `Full house, ${rn(s[1])}s full of ${rn(s[2])}s`;
    case 5: return `Flush, ${rn(s[1])} high`;
    case 4: return `Straight, ${rn(s[1])} high`;
    case 3: return `Three of a kind, ${rn(s[1])}s`;
    case 2: return `Two pair, ${rn(s[1])}s and ${rn(s[2])}s`;
    case 1: return `Pair of ${rn(s[1])}s`;
    default: return `High card, ${rn(s[1])}`;
  }
}

// ---- Hand notation and ranges ----
export function handNotation(c1, c2) {
  const [a, b] = [c1, c2].sort((x, y) => rv(y) - rv(x));
  if (a[0] === b[0]) return a[0] + b[0];
  return a[0] + b[0] + (a[1] === b[1] ? 's' : 'o');
}

// Expands "66+ ATs+ KQo T9s" into a Set of notations.
// "XX+" = that pair and higher. "XYs+" = XYs with kicker up to just below X.
export function expandRange(str) {
  const out = new Set();
  for (const tok of str.split(/[,\s]+/).filter(Boolean)) {
    const plus = tok.endsWith('+');
    const t = plus ? tok.slice(0, -1) : tok;
    if (t.length === 2) {
      const start = RANKS.indexOf(t[0]);
      for (let v = start; v <= (plus ? 12 : start); v++) out.add(RANKS[v] + RANKS[v]);
    } else {
      const hi = RANKS.indexOf(t[0]);
      const lo = RANKS.indexOf(t[1]);
      for (let v = lo; v <= (plus ? hi - 1 : lo); v++) out.add(t[0] + RANKS[v] + t[2]);
    }
  }
  return out;
}

// Beginner baseline RFI ranges, 6-max (matches reference/0001 cheatsheet spirit).
export const RANGE_SRC = {
  UTG: '66+ ATs+ KJs+ QJs JTs AQo+',
  HJ: '55+ A9s+ KTs+ QTs+ JTs T9s AJo+ KQo',
  CO: '22+ A2s+ K9s+ Q9s+ J9s+ T8s+ 98s 87s ATo+ KJo+ QJo',
  BTN: '22+ A2s+ K5s+ Q6s+ J7s+ T7s+ 97s+ 86s+ 75s+ 65s 54s A5o+ K9o+ Q9o+ J9o+ T9o',
  SB: '22+ A2s+ K6s+ Q8s+ J8s+ T8s+ 97s+ 87s 76s 65s A7o+ KTo+ QTo+ JTo',
};
export const POSITIONS = Object.keys(RANGE_SRC);
export const RFI = Object.fromEntries(
  POSITIONS.map((p) => [p, expandRange(RANGE_SRC[p])])
);

function notationToCards(n) {
  const suits = shuffle([...SUITS]);
  if (n.length === 2) return [n[0] + suits[0], n[1] + suits[1]];
  if (n[2] === 's') return [n[0] + suits[0], n[1] + suits[0]];
  return [n[0] + suits[0], n[1] + suits[1]];
}

// ---- Drill generators ----
export function dealShowdown() {
  const d = shuffle(newDeck());
  const board = d.slice(0, 5);
  const a = d.slice(5, 7);
  const b = d.slice(7, 9);
  const sa = evalBest([...board, ...a]);
  const sb = evalBest([...board, ...b]);
  return { board, a, b, sa, sb, win: cmpScore(sa, sb) };
}

export function dealRfiSpot() {
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  // ponytail: 50% sampled from the open range so drills aren't 70% trivial folds.
  const cards = Math.random() < 0.5
    ? notationToCards([...RFI[pos]][Math.floor(Math.random() * RFI[pos].size)])
    : shuffle(newDeck()).slice(0, 2);
  return { pos, cards, notation: handNotation(cards[0], cards[1]) };
}

export function potOddsQuestion() {
  const pot = [40, 60, 80, 100, 120][Math.floor(Math.random() * 5)];
  const [n, d] = [[1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [1, 1]][Math.floor(Math.random() * 6)];
  const bet = Math.round((pot * n) / d);
  const required = +((bet / (pot + 2 * bet)) * 100).toFixed(1);
  const outs = [4, 8, 9, 12, 15][Math.floor(Math.random() * 5)];
  const street = Math.random() < 0.5 ? 'flop' : 'turn';
  const equity = outs * (street === 'flop' ? 4 : 2);
  const type = ['equity', 'outs', 'decision'][Math.floor(Math.random() * 3)];
  if (type === 'equity') {
    return {
      type,
      prompt: `Pot is ${pot}. Villain bets ${bet}. What minimum equity (%) do you need to call?`,
      answer: required,
      explain: `required = call / (pot + bet + call) = ${bet} / ${pot + 2 * bet} = ${required}%`,
    };
  }
  if (type === 'outs') {
    return {
      type,
      prompt: `You have ${outs} outs on the ${street}. Approximate equity (%) by the rule of 4 and 2?`,
      answer: equity,
      explain: `${outs} outs \u00d7 ${street === 'flop' ? 4 : 2} = ~${equity}% (rule of 4 on the flop, 2 on the turn)`,
    };
  }
  const call = equity >= required;
  return {
    type,
    prompt: `Pot ${pot}, villain bets ${bet}. You hold a draw with ${outs} outs on the ${street}. Call or fold?`,
    answer: call ? 'call' : 'fold',
    explain: `need ${required}% (${bet}/${pot + 2 * bet}), you have ~${equity}% (${outs} outs) \u2192 ${call ? 'CALL' : 'FOLD'}`,
  };
}

// ---- Stats (localStorage) ----
export const MODULES = {
  rankings: 'Hand rankings',
  rfi: 'Open or fold',
  potodds: 'Pot odds',
};
const KEY = 'card-edu-stats';

export function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function record(module, ok) {
  const s = loadStats();
  const m = s[module] || { attempts: 0, correct: 0, recent: [] };
  m.attempts += 1;
  if (ok) m.correct += 1;
  m.recent.push(ok ? 1 : 0);
  if (m.recent.length > 20) m.recent.shift();
  s[module] = m;
  localStorage.setItem(KEY, JSON.stringify(s));
}
