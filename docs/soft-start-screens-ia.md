# Soft Start — Screen Inventory & Information Architecture (Phase 3)

**Version:** 1.4 · **Date:** July 21, 2026 · **Based on:** PRD v1.9 · User Flows v1.5
**Companion file:** `soft-start-sitemap.mermaid` (visual map of everything below)

This document names every screen, sheet, and state in Soft Start v1, so nothing in the PRD is left homeless and nothing gets invented during the build. Each entry lists its purpose, entry points, contents, states, and the PRD/flow sections it implements.

Naming convention: **S#** = full screens · **R#** = ritual steps (an overlay sequence, not tabs) · **SH#** = sheets (bottom sheets on mobile, centered panels on desktop) · **N#** = inline notes/confirmations (not screens — they never navigate away).

---

## 1. Information Architecture at a Glance

```
Soft Start (PWA)
│
├── FIRST RUN (S0.1–S0.6) — one-time sequence, resumable
│
├── MORNING ARRIVAL (R1 greeting → R2 intention) — plays on a fresh day, lands on Today
│
├── TODAY  (S1) ············· home & default destination
│     ├── Block sheet (SH1)
│     ├── Add sheet (SH2)
│     ├── Shift-my-day sequence (SH3 → SH4 if needed)
│     └── inline notes N1 (overlap) · N2 (boundary)
│
├── WEEK  (S2)
│     ├── Day peek (SH5)
│     └── Add sheet (SH2, day-targeted)
│
└── RHYTHM  (S3) ············ settings & template home
      ├── Weekday template editor (S3.1)
      ├── Day shape settings (S3.2)
      └── Data & backup (S3.3)
```

**Navigation model:** three top-level destinations — **Today · Week · Rhythm** — in a bottom tab bar on mobile (thumb-reachable) and a slim top-left rail on desktop. *Current decision (Phase 4 review): **three tabs stand** — Today · Week · Rhythm. If revisited in the prototype, the fallback is two tabs with Rhythm inside a hamburger drawer (≡, holding the user's name and the settings entries) — not a bare header glyph.* Today is home; the app always reopens there (or into the ritual layer if a new day hasn't started). The arrival animation is not a tab — it plays once per fresh day and dissolves into Today. Sheets slide over their parent and never navigate; the parent stays visible behind a scrim of `--bg` at low opacity.

**Day lifecycle state machine (governs which layer you land in):**
`fresh day (post-4:00am) → arrival animation → active day (Today) → quiet close (4:00am or next arrival) → fresh day…`
Empty days (blank weekends, empty weekdays) land directly in Today's open state (Flow 5, edge 27).

---

## 2. First-Run Sequence (S0) — runs once, resumable

| ID | Screen | Contents & behavior | PRD / Flow |
|----|--------|--------------------|------------|
| S0.1 | **Welcome** | Illustration (Soft Focus radial style), one promise line, pill "Set up my week." No tour. | Flow 1.1 |
| S0.2 | **Day shape** | Four editable time fields: day start / ease-in begins (8:00am) · active blocks begin (9:00am) · lunch time & length (12:30–1:30pm) · day ends (5:00pm). Values set here persist unchanged until explicitly edited later (S3.2 globally, or per-day). Copy: changeable anytime. | §6.1, Flow 1.2 |
| S0.3 | **Anchors** | "Anything that happens at a fixed time?" Add anchored blocks (Tue/Thu 10:00am meetings). Ghost skip: "Nothing fixed." | §6.1, Flow 1.3 |
| S0.4 | **Build Monday** | The weekday template editor (same engine as S3.1) on the proportional timeline — teaches drag/resize/tap gestures. Ease-in span and lunch pre-placed. | Flow 1.4 |
| S0.5 | **Repeat step (per built day)** | "X's ready — repeat it on other days?" All seven days shown; the source and any already-scheduled day are recessed and unselectable; selection = darkened fill, no checkmarks; Sat/Sun selectable while empty. | Flow 1.5 |
| S0.5b | **Next blank weekday** (conditional loop) | The next *consecutive* uncovered weekday is offered: "Your Tuesdays are currently blank — build them now?" Build → that day's editor → its own repeat step (S0.5). Ghost "Leave blank for now" → open-day state (edge 27), loop advances. Ends when every weekday is planned or passed; weekends never prompt. | Flow 1.5b, edge 27 |
| S0.6 | **Weekends + backup + done** | One screen, three beats: "Weekends start blank — add things only when you want to" (button: "Perfect") · soft backup offer (Export now / ghost "Maybe later"; desktop adds the device-copy note) · "Your week is ready. See you in the morning 🌿" → Today or ritual. | Flow 1.6–1.8, edge 17 |

Abandon-and-resume: progress persists; next open resumes at the last incomplete step without comment.

---

## 3. Morning Arrival (R1) — the signature moment

Opening a fresh day plays the R1 greeting animation, offers the full-screen R2 intention moment, and lands on Today. Empty days land on the open-day state instead.

| ID | Element | Contents & behavior | PRD / Flow |
|----|---------|--------------------|------------|
| R1 | **Greeting animation** | Time-aware "Good morning" + one Appendix-B quote ("Every day counts."). Doubles as the plan-loading moment; ~4–6s, tap anywhere to skip. Exit: greeting + quote float up, "Good morning" fades, the quote docks at the top of Today (above the intention) for the day. Gap variant: "Welcome back — today counts." | §6.2.1–3, Flow 2 |
| R2 | **Intention screen** | Full-screen, directly after R1, quote already docked at top: one Appendix-A question · one-line field · ghost "Maybe later." Submit → the answer floats up and docks beneath the quote → Today. "Maybe later" → Today with no intention line, no re-prompt. | §6.2.3, Flow 2.3 |
| — | **"Start from now" (on S1)** | Always available, any hour — never clock-inferred. → R3a day-length pop-up over the plan (keep → engine; "Pick a later time" → end-time picker → engine) → full-screen editable preview (SH3 pattern) → apply or back out. | §6.2.5, Flow 3 |

Retired: the draft-review screen and its "Continue," and the "Start my day" button. (The R2 identifier now names the intention screen.)

---

## 4. Core Screens

### S1 — Today (home)

**Purpose:** where the day is lived; every flow ends here.
**Entry:** ritual completion; app open on an already-started day; tab bar.
**Layout, top to bottom:** the Soft Start wordmark (treatment TBD in visual pass) → header (date · persistent **"+"** · progress ring "3/6") → greeting quote → intention line (both docked by the arrival's float animation; the intention line is absent if "Maybe later" was chosen) → the **proportional timeline**: ease-in span, blocks as Soft Focus cards sized by duration, soft "now" marker, current/next block elevated by shadow-lift → nothing after the last block (no footer summary).
**Interactions:** tap block → SH1 · drag to reorder (silent) · edge-drag to resize (N1 if overlap) · cross a boundary (N2) · "+" → SH2 · overflow "Shift the rest of my day" → SH3. Completed blocks desaturate/gray in place — the ring, not the blocks, carries the celebration.
**States:**
- *Default* — the plan, additive ring.
- *Open day (weekend or empty weekday)* — "Your Saturday is wide open" / "Your Tuesday is wide open" + "Add something" (SH2). Applies whenever a day has no blocks: blank weekend, empty weekday template, or everything rested. Anchors, if any, still render. No ritual demanded, never an error. (Flow 5.1, edge 27)
- *Evening/after* — shows only what was done and always closes on a warm line ("You showed up for 4 things today — that's real"; a zero-done day gets one too: "Rest is part of the rhythm. Tomorrow is ready when you are."). Untouched blocks have silently rested. (Flow 6a)
- *Complete day* — the evening state itself, celebrating: "Wow! What a day." beneath the warm close, with rose petals (rose/petal/cream) drifting once from the top of the same sheet; reduced-motion shows the line alone. (edge 20)
- *Condensed blocks* — very short durations render at the 44px minimum height, one-line style. (edge 21)
- *Desktop* — same layout, centered column; first visit shows device-copy note once. (edge 17)

### S2 — Week

**Purpose:** orientation and light additions; never a report card.
**Entry:** tab bar.
**Contents:** stacked day cards (mobile) / seven columns (desktop); today softly highlighted. Past days: sage marks for what happened, silence about the rest. Future weekdays: template preview. Sat/Sun: inviting empty state with "Add something." Every current/future day carries a **"+"** → SH2 targeted to that day. Tap any day → SH5 peek.
**Not here:** template editing (lives in Rhythm), completion actions on future days, any counts of undone things. (§6.4, Flow 5.2)

### S3 — Rhythm (settings & template home)

**Purpose:** the place plans are shaped; visited weekly at most.
**Contents:** weekday list (Mon–Fri, each opening S3.1; Sat/Sun rows read "blank by default" and open the same editor empty — templating a weekend is an explicit act, never a default) plus entries for S3.2 and S3.3. Template edits apply from tomorrow; today never shifts underfoot (edge 16).

| ID | Sub-screen | Contents | PRD |
|----|-----------|----------|-----|
| S3.1 | **Weekday template editor** | Proportional timeline for that weekday: add/edit/delete blocks; per-block title, category, times, **tier (anchored / protected / flexible)**, minimum duration (default 15 min); duplicate-day action. Same gesture language as Today. | §6.1 |
| S3.2 | **Day shape** | Global defaults: day start (ease-in begins), ease-in length (active start), lunch time/length, end of day — the same four values from first-run S0.2, always editable here. Changes apply from tomorrow; per-day overrides live in each S3.1. The app never modifies these on its own. | §6.1 |
| S3.3 | **Data & backup** | Export JSON · Import JSON · device-copy explanation · gentle export suggestion appears here after major template edits (edge 18). | §6.7 |

---

## 5. Sheets (SH) — slide over, never navigate

| ID | Sheet | Opens from | Contents & behavior | PRD / Flow |
|----|-------|-----------|--------------------|------------|
| SH1 | **Block sheet** | Tap a block (S1) | Title + category tag + times (tap times → inline time entry, typed or picker, 5-min snap). Three quiet actions: **Done · Move to tomorrow · Rest today**. The times row is an inline retime shortcut; "Edit block" opens the full editor (title · category · tier · minimum duration). Done toggles (un-done supported); "Also add to my weekly rhythm" appears for one-off blocks (edge 26). | §6.5–6.6, Flow 4a–b |
| SH2 | **Add sheet** | "+" on Today, Week days, weekend empty states | Title · category (Ease-in/Work/Side project/Spanish/Workout/Life/Other) · start/end (defaults to the next open gap). Default scope: **one-off for the target day**. Quiet secondary toggle: **"Also add to my weekly rhythm."** Boundary rule (N2) applies if placed outside day bounds. | §6.3–6.4, Flow 4e, edge 26 |
| SH3 | **Shift my day** | Overflow action on S1 | Mid-day re-flow via the shared **Re-flow Engine**: end-time pop-up only if the rebuild would cross the day's end → a **full-screen, fully editable preview mirroring Today** (drag / resize / tap any block before confirming) → apply, or "Leave it as is." Rendered as a screen, not a bottom sheet; keeps its SH3 identifier. | §6.6, Flow 4d, edge 7 |
| SH4 | **Didn't-fit sheet** | Re-flow Engine, when overflow exists | Lists only *flexible* blocks that can't fit at minimum duration; each row: **Move to tomorrow / Rest today** — user decides per block; nothing auto-resolved, nothing silently deleted. Anchored and protected blocks (lunch by default) never appear here. | edges 3–5, 25 |
| SH5 | **Day peek** | Tap a day in Week | Read-only block list for that day; past = done items only; future = preview + "+"; no edit affordances beyond add. | §6.4 |

---

## 5b. The Re-flow Engine — one shared system

The morning late-start optimization (R3b) and the mid-day "Shift my day" (SH3) are **the same engine invoked from two doors**, and must be implemented as a single module so they can never diverge. Its contract:

- **Input:** current time · chosen end time (via the once-only day-length pop-up / picker) · today's remaining blocks with their tiers and minimum durations.
- **Rules:** anchored blocks hold exact times → protected blocks slide + compress to their floors but always remain → flexible blocks slide + compress proportionally to their floors → whatever still can't fit goes to SH4 for the user's per-block decision. 5-minute snapping throughout.
- **Output:** a rebuilt timeline shown plainly — no "reduced" labels, no comparison to the original plan, no lateness vocabulary.

---

## 6. Inline Notes & Confirmations (N) — moments, not screens

| ID | Moment | Trigger | Behavior | PRD |
|----|--------|---------|----------|-----|
| N1 | **Overlap nudge** | A *length* change (edge-drag or typed) creates an overlap | Apricot note: "These two overlap — want me to nudge one?" One-tap fix · dismissible · never blocking, never red. Pure reorders never trigger it. | edges 6, 22–23 |
| N2 | **Boundary question** | Moving/extending a block before day start or past day end | "Are you sure? This will extend your day to ___." Confirm → boundary updates; decline → revert. Once per action. Apricot, phrased as a question. | edge 24 |
| N3 | **Backup whisper** | After major template edits | Soft, dismissible: "A lot of good changes — want a backup file?" Links to S3.3. | edge 18 |

---

## 7. Component Inventory (maps to Soft Focus v1.0)

| Component | Built from (style guide) | Used in |
|-----------|-------------------------|---------|
| Timeline block card | Card + nested blush, radius `--r-lg`, height ∝ duration, 44px floor | S1, S2 preview, R2, S3.1 |
| Anchor treatment | Card + quiet pill tag ("anchored"), no drag handle on times | S1, R2, S3.1 |
| Now marker | Hairline in `--accent-soft` + soft dot — never red, no lateness copy | S1 |
| Progress ring | Signature ring, petal→rose gradient, `--t-slow` fill, aria-labeled | S1 header, R5→S1 |
| Category tags | Pill tags (rose/sage/apricot/quiet) with dot + label | everywhere |
| Action row | btn-primary / btn-secondary / btn-ghost — one primary per view; ghost = the guilt-free exit | all sheets, ritual |
| Pill CTA | btn-pill, reserved for begin moments ("Start my day," "Add something") | R5, weekend states |
| Sheet container | Card at `--r-lg`, `--shadow-lift`, scrim of `--bg` at low opacity | SH1–SH5 |
| Inline note | Nested blush card in `--note-soft` with apricot dot | N1–N3 |
| Time entry | Input style, 5-min snap, typed or picker | SH1, SH2, S0.2, S3.2 |
| Empty state | Illustration gradient + inviting line + pill add | S1 weekend, S3 Sat/Sun rows |
| Intention line | Quiet text in `--text-muted` atop Today | S1 |

**Motion budget per screen (one orchestrated moment each):** Today = the ring fill on completion · Ritual = the step transition · Week = none beyond hover lifts · Rhythm = none. Everything else is `--t-fast/--t-med` micro-transitions; all collapse under `prefers-reduced-motion`.

---

## 8. Coverage Check — every PRD feature has a home

| PRD feature | Lives at |
|---|---|
| Weekly rhythm & templates (§6.1) | S3, S3.1, S3.2; taught in S0.4 |
| Anchored vs flexible, minimum durations | S3.1 per-block settings; honored by R3b/SH3 engine |
| Lunch default & protection | S0.2/S3.2 defaults; R3b/SH3 rules; excluded from SH4 |
| Morning arrival + intention (§6.2, App. A–B) | R1 animation + R2 intention screen; "Start from now" on S1 |
| Re-flow ("Start from now" / shift) | R3a pop-up + picker, Re-flow Engine, SH3 preview, SH4 |
| Today view & timeline editing (§6.3) | S1 + N1/N2 + SH1/SH2 |
| Persistent "+", one-off vs permanent | S1/S2 headers → SH2; SH1 secondary; edge 26 |
| Week view (§6.4) | S2 + SH5 |
| Gentle completion (§6.5) | SH1 done toggle + ring |
| Move/rest, shift-my-day, silent close (§6.6) | SH1, SH3, S1 evening state |
| 4:00am boundary, weekends, welcome back | Day lifecycle machine; S1 open state; R1 gap variant |
| Export/backup (§6.7) | S3.3 + N3 |

**Totals:** 4 core screens (plus 3 Rhythm sub-screens and a 6-step first run) · 5 sheets · 3 inline notes · a 2-moment arrival (R1 greeting animation + R2 intention screen). Small on purpose: the product's calm depends on there being very little of it.

---

*This closes the three-phase process: PRD (v1.5) → User Flows (v1.1) → this IA. The natural next step, whenever you want it: wireframes or a working prototype of S1 + the ritual, built directly on the Soft Focus `:root` tokens.*
