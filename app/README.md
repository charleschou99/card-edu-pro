# Card Edu Pro — Poker Trainer

Interactive drill app for the foundation phase: hand-ranking reflexes, 6-max open/fold discipline, and pot-odds math. Each drill has a beginner "watch first" panel with an embedded video and short reads. Progress is stored locally (`localStorage`), no backend.

## Run (dev, in browser)

```
npm install
npm run dev
```

## Run as a desktop app

```
npm run app     # build + launch the Electron window
npm run dist    # build the portable Windows exe -> dist/Card Edu Pro 0.1.0.exe
```

The portable exe is self-contained — copy it anywhere and double-click. Video embeds and study links need internet; the drills themselves work offline.

## Verify logic

```
npm run check
```

## Modules

- **Hand rankings** — which hand wins at showdown (7-card evaluation).
- **Open or fold** — random position + hole cards, scored against the beginner baseline RFI ranges (same spirit as `../reference/0001-6max-preflop-baseline-cheatsheet.html`).
- **Pot odds** — required-equity math, rule of 4 and 2, and call/fold decisions. ±1% tolerance on numeric answers.
- **Dashboard** — accuracy per drill and a focus recommendation for today's study block.

Phase 2 (deferred): Python/AI backend for real hand-history analysis, play-vs-bot table.
