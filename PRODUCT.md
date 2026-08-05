# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single, known user — the app is personalized, not general-market; there is no secondary persona.

- Works remotely for an AI consulting company; fixed meetings Tuesdays and Thursdays at 10:00am, all other work self-directed from home.
- Runs personal side projects to build AI and dashboard-development skills; practices Spanish daily; wants to work out more consistently.
- No imposed schedule; struggles most with starting the morning, and experiences a late start as a failed day.
- Prefers a gentle on-ramp: day opens at 8:00am with ease-in activities (wake up, brush teeth, coffee, breakfast), active blocks begin at 9:00am, weekday default end of day is 5:00pm.
- Keeps weekends unplanned by default — Saturday and Sunday start blank every week, with one-tap adding when she chooses to schedule something.
- Self-described: highly disciplined given a plan; highly self-critical without one. Guilt-based mechanics are actively counterproductive for her.
- Confirmed current as of 2026-08-04 (no change since PRD v1.9, 2026-07-21).

## Product Purpose

Soft Start is a personal daily-planning PWA for one user. It generates a timed daily plan from a weekly rhythm, opens each day with a calm arrival ritual that makes starting easy, and treats everything that doesn't happen as moved or resting, never as failure.

Core philosophy: *"The plan removes the negotiation. The app never keeps score against you."* The user has plenty of discipline and motivation already — what's missing is a pre-made decision about what the day looks like, and a low-friction way to step into it. This inverts the standard habit-app model of streaks, badges, and guilt.

Success is felt, not dashboarded, but is checkable: earlier morning starts within two weeks; sustained use without dread; the late-start loop (started late → day feels failed → why bother → day actually fails) visibly breaking; all four life areas (work, side projects, Spanish, workouts) getting regular time in the lived week. Explicitly not success criteria: completion percentage, streak length, total hours logged — the app never computes a productivity score.

## Positioning

Where productivity apps assume the user lacks motivation and manufacture it through streaks, badges, guilt, and overdue/missed states, Soft Start assumes discipline is already present and removes the two real obstacles: the absence of a pre-made plan, and the friction of starting. A day begun at noon still gets a real, re-optimized plan for the time remaining — not a truncated copy of the morning-person plan that didn't happen, and not a "ruined day." No neighboring habit/productivity app can copy this without abandoning its own engagement mechanics (streaks, backlogs, completion percentages), which is why it's a structural difference, not a skinning choice.

## Operating Context

- The user's actual weekly rhythm (the template the whole system is built around): weekdays start 8:00am (ease-in: wake, coffee, breakfast — counts toward progress), active blocks from 9:00am, lunch 12:30–1:30pm (protected, 60 min default, 30 min floor), day ends 5:00pm by default. Tuesday and Thursday carry an anchored 10:00am work meeting. Weekends carry no template by default.
- Day boundary is 4:00am — the "day" persists until a new day's ritual starts or 4:00am, whichever comes first.
- All data is local-first (browser storage), no account, no backend; the phone is the primary source of truth in v1, laptop holds a separate copy.
- Full detail lives in `docs/soft-start-prd.md` (v1.9, source of truth), `docs/soft-start-user-flows.md`, `docs/soft-start-screens-ia.md`, and `docs/soft-start-ui-components.md` — read before feature work per CLAUDE.md.

## Capabilities and Constraints

**Core data model — three block tiers** (the central mechanic re-flow is built on):
- **Anchored** — fixed wall-clock time, never moves or compresses (e.g. Tue/Thu 10am meeting).
- **Protected** — slides and compresses to a minimum duration but is never dropped (lunch by default).
- **Flexible** — slides, compresses to a per-block minimum (default 15 min), and overflows to a "didn't fit" sheet (move-to-tomorrow / rest-today) if it still doesn't fit. Default tier for most blocks.

**MVP scope (v1, above the line):** weekly rhythm template editor; morning arrival ritual (greeting animation → optional intention prompt → Today, ~4-6s, tap-to-skip); "Start from now" re-flow at any hour with an extend-day prompt; Today view as a time-proportional, directly editable timeline (drag to reorder silently, drag edges to resize with overlap nudge, tap to type exact times, 5-minute snapping); Week view for orientation and one-tap additions; gentle completion (done/undone, no partial credit, out-of-order supported); guilt-free rescheduling (Done / Move to tomorrow / Rest today on any block); silent auto-rest of untouched blocks at day's end with a warm closing line; manual JSON export/import backup.

**Explicitly below the line (not v1):** push notifications, session-mode timers, evening preview, weekly reflection/history views, intention journal, Apple Calendar sync, AI-drafted days, cross-device sync backend, Spanish/workout logging modules.

**Permanent non-goals (product boundaries, not deferred features):** no red anywhere, no exclamation-mark urgency (one exception, see Brand Commitments), no countdown timers; no overdue/missed/backlog states; no guilt-toned notifications; no productivity scores or completion-percentage judgments; no commentary comparing a re-flowed day to the "original"; no auto-filling weekends; no social/sharing/comparison features; no gamification currency; no multi-user support.

**Vocabulary blocklist (never rendered):** late, missed, overdue, behind, failed, broken, only, still, remaining.

**Undecided / open:** none outstanding per PRD §11 as of v1.9. v1.2+ features (session mode, evening preview, calendar sync, AI-drafted days) are deliberately deferred, not undecided.

## Brand Commitments

- Product name: **Soft Start**. Design system: **Soft Focus v1.0** (`docs/style-guide.html`), with two approved amendments recorded in CLAUDE.md: `--bg: #FCFAF9` and `--font-script: "Ephesis"`.
- Ephesis script typeface appears in exactly three places: the wordmark, the day-of-week heading, the greeting — nowhere else.
- Color semantics are law: categories use only the rose+cream family; sage means "done" and only that; deep blush (#F7E3E7 field / #8F4F63 text) appears only when the app gently asks a question; past/finished things go warm gray.
- The exclamation mark in "Wow! What a day." (100%-complete-day celebration, PRD edge case 20) is the only one in the entire app — a deliberate, singular exception to the no-urgency rule.
- Voice is neutral and additive everywhere: progress is shown as counts of what happened, never counts of what didn't.

## Evidence on Hand

- `docs/soft-start-prd.md` (v1.9) — full product spec, user stories, and 28 resolved edge cases; source of truth per CLAUDE.md.
- `docs/soft-start-user-flows.md` (v1.5), `docs/soft-start-screens-ia.md` (v1.4), `docs/soft-start-ui-components.md` — flows, screen/state inventory, and the 39-component build list.
- `docs/mockup-*.html` — polished, working-CSS mockups for arrival, closing, first-run, interruptions, Today, sheets, and Week; treated as visual ground truth to match exactly.
- `docs/soft-start-wireframes.html`, `*.mermaid` — interaction/flow diagrams.
- `docs/style-guide.html` — Soft Focus v1.0 design system, the starting stylesheet.
- Real personal schedule data embedded directly in the PRD (§3, §6.1) — not sample/placeholder content.
- No user testimonials, external benchmarks, or third-party evidence exist or are needed; this is a single-user personal tool.

## Product Principles

1. **The day starts when you do.** A day begun late is optimized for the time remaining, never mourned or shown as partial/failed.
2. **Done over due.** Progress is additive only — what happened, never what didn't, is outstanding, or is overdue. No backlog exists anywhere.
3. **Skipping is a feature.** Every block can move to tomorrow or rest today in one tap with neutral language; this is core product behavior, not just tone.
4. **Calm is a functional requirement.** If a feature can only work by creating urgency (red, badges, counts of undone things, countdowns, auto-dismissing content), it doesn't belong in this product — non-negotiable.
5. **User-owned defaults, not learned ones.** Day-shape values (start, ease-in length, lunch, end) are set once by the user and persist exactly until she changes them; the app never adjusts or "learns" new defaults on its own.

## Accessibility & Inclusion

No accessibility needs beyond the standard product hard rules already encoded in the design system: 44px minimum touch targets (timeline blocks never render below this — condensed one-line style instead), full `prefers-reduced-motion` support on every animation, and no reliance on red/color alone to convey state. Confirmed 2026-08-04 — no additional personal requirement.
