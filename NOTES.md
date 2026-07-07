# Teaching Notes

- User prefers coach-led decisions instead of open-ended product/design choices.
- User is a complete beginner in poker and wants clear, structured progression.
- Interactive practice is preferred.
- Cheatsheets are required for fast reference during training.
- Long-term target is competition level; short-term target is fundamentals plus consistency.
- User can handle math-heavy explanations when needed.
- Platform selection is deferred; training/app design must stay room-agnostic for now.
- Days 1-14 should be play-money only before introducing real-money reps.
- Foundation phase table policy: one table only.
- Trainer app lives in `app/` (Vite + React, no backend): hand-ranking, open/fold, and pot-odds drills with a progress dashboard. Run with `npm run dev`. Phase 2 (deferred): Python/AI backend for hand-history analysis, bot table.
- User wants a desktop app, not web: Electron wrapper added, `npm run dist` builds portable exe at `app/dist/Card Edu Pro 0.1.0.exe`.
- Visual preference: modern/futuristic dark theme (neon cyan/violet, glass cards).
- As a complete beginner, user wants video tutorials surfaced in-app before quizzes — each drill now has a collapsible "New to this? Watch first" panel with an embedded YouTube video and reading links.
