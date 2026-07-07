// Runnable check: node src/selfcheck.js (or npm run check)
import assert from 'node:assert';
import {
  eval5, evalBest, cmpScore, handNotation, expandRange, RFI, scoreName,
} from './poker.js';

// Category ordering.
const flush = eval5(['Ah', 'Th', '7h', '4h', '2h']);
const straight = eval5(['9s', '8d', '7h', '6c', '5s']);
assert(cmpScore(flush, straight) > 0, 'flush beats straight');

const fullHouse = eval5(['Ks', 'Kd', 'Kh', '2c', '2s']);
assert(cmpScore(fullHouse, flush) > 0, 'full house beats flush');

const quads = eval5(['7s', '7d', '7h', '7c', 'As']);
assert(cmpScore(quads, fullHouse) > 0, 'quads beat full house');

// Wheel straight (A-2-3-4-5) recognized, 5 high.
const wheel = eval5(['As', '2d', '3h', '4c', '5s']);
assert.equal(wheel[0], 4, 'wheel is a straight');
assert(cmpScore(straight, wheel) > 0, '9-high straight beats wheel');

// Kicker comparison.
const pairAK = eval5(['As', 'Ad', 'Kh', '7c', '2s']);
const pairAQ = eval5(['Ah', 'Ac', 'Qh', '7d', '2d']);
assert(cmpScore(pairAK, pairAQ) > 0, 'kicker breaks pair tie');

// 7-card: board straight flush found among 21 combos.
const best = evalBest(['9h', '8h', '7h', '6h', '5h', 'Ad', 'Ac']);
assert.equal(best[0], 8, 'finds straight flush in 7 cards');
assert.equal(scoreName(best), 'Straight flush, 9 high');

// Split pots: identical board plays for both.
const s1 = evalBest(['Ah', 'Kh', 'Qh', 'Jh', 'Th', '2c', '3d']);
const s2 = evalBest(['Ah', 'Kh', 'Qh', 'Jh', 'Th', '7s', '8s']);
assert.equal(cmpScore(s1, s2), 0, 'board plays = split');

// Notation.
assert.equal(handNotation('Ah', 'Kh'), 'AKs');
assert.equal(handNotation('Kd', 'Ad'), 'AKs');
assert.equal(handNotation('Ah', 'Kd'), 'AKo');
assert.equal(handNotation('9c', '9d'), '99');

// Range expansion.
const pp = expandRange('66+');
assert(pp.has('66') && pp.has('AA') && !pp.has('55'), 'pair plus');
const ax = expandRange('ATs+');
assert(ax.has('ATs') && ax.has('AQs') && !ax.has('A9s') && !ax.has('AAs'), 'suited plus');
assert.equal(expandRange('KQo').size, 1, 'single combo token');

// Baseline ranges sane.
assert(RFI.UTG.has('AA') && !RFI.UTG.has('72o'), 'UTG range sane');
assert(RFI.BTN.size > RFI.UTG.size, 'BTN wider than UTG');

console.log('selfcheck OK');
