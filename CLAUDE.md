# Soft Start

A personal daily-planning PWA for one user. It generates a timed daily plan from a weekly
rhythm, opens each day with a calm arrival animation, and never keeps score against the user.
Read `docs/soft-start-prd.md` before any feature work — it is the source of truth.

## Source of truth (in docs/)
- **Product spec:** `soft-start-prd.md` (v1.9) — features, edge cases 1–28, Appendices A (intention prompts) & B (greeting quotes)
- **User flows:** `soft-start-user-flows.md` (v1.5) — incl. the cross-flow rules at the end
- **Screens & IA:** `soft-start-screens-ia.md` (v1.4) — every screen/sheet/state; §5b is the Re-flow Engine's implementation contract
- **Build list:** `soft-start-ui-components.md` — 39 components; build in this order
- **Visual truth:** `mockup-*.html` — polished mockups with the real, working CSS. Match them exactly; lift token values and component styles directly from their source.
- **Wireframes & diagrams:** `soft-start-wireframes.html`, `*.mermaid` — interaction reference
- **Original design system:** `style-guide.html` (Soft Focus v1.0 — note the amendments below)

## Design system hard rules
- Soft Focus tokens, with two approved amendments: `--bg: #FCFAF9` and `--font-script: "Ephesis"`
- Ephesis script appears in exactly three places: the wordmark, the day-of-week heading, the greeting. Nowhere else.
- **Color semantics law:** categories use only the rose+cream family · sage appears only to mean "done" · deep blush (#F7E3E7 field, #8F4F63 text) appears only when the app gently asks a question · past/finished things go warm gray
- No red anywhere. No borders for depth — rose-tinted shadows and blush tints only.
- One orchestrated motion moment per screen; everything respects `prefers-reduced-motion`
- 44px minimum touch targets; timeline blocks never render below 44px (condensed one-line style instead)

## Product hard rules
- **Vocabulary blocklist (never render these words):** late, missed, overdue, behind, failed, broken, only, still, remaining
- Progress is additive only — never show counts of undone things, no backlog anywhere
- Anchored blocks never move in re-flow; protected blocks compress but never drop; only flexible blocks can overflow to the didn't-fit sheet
- One question per action; interruption notes never stack (boundary question takes precedence — PRD edge 28)
- The exclamation mark in "Wow! What a day." is the only one in the entire app
- Weekends: blank by default, templatable only by explicit user choice
- Day boundary: 4:00am. Template edits apply from tomorrow, never to today.

## Technical shape
- PWA, mobile-first (iPhone primary), fully responsive for desktop
- Local-first: browser storage (localStorage/IndexedDB), no backend, no accounts
- Manual JSON export/import for backup
- 5-minute snapping on all time edits

## Stack
- **Vite + React + TypeScript**, plain CSS (custom properties, no Tailwind/CSS-in-JS) so tokens map 1:1 to `docs/style-guide.html`
- No data-layer library yet — Dexie.js (thin IndexedDB wrapper) is planned once the Rhythm/template data model is built
- `npm run dev` — starts the dev server at `http://localhost:5173`; also serves on the home Wi-Fi LAN (`server.host: true` in `vite.config.ts`) for testing on the iPhone at `http://<this-machine's-LAN-IP>:5173`
- `npm run build` — type-checks (`tsc -b`) and builds to `dist/`
- `npm run lint` — oxlint
- `npm run preview` — serves the production build locally
- Design tokens live in `src/styles/tokens.css` (full Soft Focus `:root` block + the two amendments); base resets in `src/index.css`
- `docs/` is untouched by the build — all app code lives in `src/`

## Working style
- One focused objective per session; verify each screen against its mockup in the browser before moving on
- When the spec and an implementation instinct disagree, the spec wins; if the spec is ambiguous, ask the user rather than assume
