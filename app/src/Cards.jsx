import { SUIT_GLYPH } from './poker.js';

export default function Cards({ cards }) {
  return (
    <span className="cards">
      {cards.map((c) => (
        <span key={c} className={`pcard ${'hd'.includes(c[1]) ? 'red' : ''}`}>
          {c[0] === 'T' ? '10' : c[0]}
          {SUIT_GLYPH[c[1]]}
        </span>
      ))}
    </span>
  );
}
