# Soft Start — User Flows (Phase 2)

**Version:** 1.5 · **Date:** July 21, 2026 · **Based on:** PRD v1.9
**Companion file:** `morning-ritual-flow.mermaid` (diagram of Flows 2–3)

Notation used throughout: numbered steps are screens or moments; **◇** marks a decision point (user choice or system branch); *→* shows where a step leads; quoted text is actual UI copy (calm voice is part of the spec). "Anchored" and "flexible" carry their PRD §6.1 meanings.

---

## Flow 1 — First Run & Weekly Rhythm Setup

**Entry:** first-ever visit (browser or freshly installed PWA). Runs once; afterward the app always opens into Flow 2/4/6 depending on time and day state.

1. **Welcome** — one screen, Soft Focus illustration, one line of promise: "Your day, already planned. Gently." Pill button: "Set up my week." No feature tour, no carousel.
2. **Day shape** — confirm the defaults: ease-in begins **8:00am**, active day begins **9:00am**, **lunch 12:30-1:30pm**, day ends **5:00pm**. All editable time fields. Copy notes: "You can change these anytime — for the week, or for a single day."
3. **Anchors first** — "Anything that happens at a fixed time?" She adds Tue/Thu 10:00am meetings, marked with the anchor treatment. ◇ *Skip available* (ghost: "Nothing fixed").
4. **Build Monday** — the template editor for one weekday: add blocks (title, category, times) on the proportional timeline with the same drag/resize/tap-to-type interactions as the Today view, so setup teaches the app's core gesture language.
5. **The build-and-echo loop** — every built day earns a repeat step: "Monday's ready — repeat it on other days?" All seven days shown; the **source and any day that already has a plan are recessed and unselectable**; selection is a simple darkened fill (no checkmarks). Sat/Sun are selectable while empty — templating a weekend is an explicit choice.
   **5b — next blank weekday (conditional):** setup then moves to the **next consecutive uncovered weekday** (Monday copied to Wed + Fri → Tuesday is asked first): "Your Tuesdays are currently blank — build them now?" ◇ *Build* → that day's editor (the S0.4 engine) → its own repeat step (5), where only still-empty days can be chosen. ◇ *Ghost "Leave blank for now"* → that day opens "wide open" (edge 27), buildable later in Rhythm, and the loop moves to the next uncovered weekday. The loop ends when every weekday has a plan or an explicit pass; weekends never prompt.
6. **Weekends stay open** — a single informational moment, not a task: "Saturday and Sunday start blank every week. Add things only when you want to." One button: "Perfect."
7. **Backup nudge (soft)** — "Your rhythm lives on this device. Want a backup file?" ◇ Export now / ghost "Maybe later."
8. **Done** — "Your week is ready. See you in the morning 🌿" → lands on **Today view** (or straight into the Morning Ritual if it's a fresh day with no ritual done).

**Exit states:** setup complete → normal daily loop. Abandoned mid-setup → progress saved; next open resumes at the last step, no restart, no comment.

**Edge:** desktop first-run shows the device-copy note (PRD edge 17) in step 7's screen.

---

## Flow 2 — Morning Arrival

**Entry:** first open of a fresh day (day = arrival-to-arrival, bounded at 4:00am). The ritual is an animation, not a sequence of screens.

1. **Greeting animation** — time-aware "Good morning" with one Appendix-B encouragement beneath ("Every day counts."). Doubles as the loading moment while the plan generates; ~4–6 seconds, tap anywhere to skip. Gap variant: "Welcome back — today counts," with zero reference to the gap.
2. **Float and fade** — greeting + quote drift upward together; "Good morning" fades; the quote docks at the top of the screen for the rest of the day.
3. **The intention screen** — full-screen, directly after the greeting, quote already docked up top: one Appendix-A question · one-line field · ghost "Maybe later." ◇ *Submitted* → the answer plays the same float animation and docks beneath the quote. ◇ *"Maybe later"* → no intention today; the next screen is Today exactly as normal, minus the intention line, with no re-prompt.
4. **Landing** — Today (Flow 4), plan ready and fully editable. No draft screen, no "Continue": nothing to approve, only a day to step into.
◇ *Empty draft* (empty weekday template or blank weekend): the animation lands on the open-day state — "Your Tuesday is wide open" + "Add something." Never an error.
◇ *"Start from now"* is available on Today at any hour → Flow 3.

**Exit:** living the day (Flow 4).

## Flow 3 — Morning Ritual ("Start from now" re-flow)

**Entry:** she taps **"Start from now"** on Today — available every day, at any hour; the app never presumes a 12:40 open means a 12:40 start.

3. Without a re-flow, blocks whose time has already passed are never alarmed — they simply sit on the timeline, markable done / moved / rested.
4. **The day-length pop-up (asked once, gently):** a small pop-up over the plan — not a separate screen: "Want to end the day a little later, or keep your usual 5:00pm?"
   ◇ *Keep 5:00pm* → straight to step 5. *Pick a later time* → a simple end-time picker screen, then step 5. Both styled as equally good — no default highlighting of "extend." The same pop-up pattern fires whenever a re-flow would cross the day's bounds.
5. **Optimization** — system step, instant: anchors hold their exact times; flexible blocks slide forward and compress proportionally down to each block's minimum duration; the rebuilt day fills now → chosen end.
   ◇ *Everything fit* → step 6.
   ◇ *Some blocks can't fit even at minimum* → **"Didn't fit today"** sheet: each listed *flexible* block offers **Move to tomorrow** / **Rest today** — *she* decides, per block, which priorities wait; the app never auto-picks losers. **Protected blocks never appear here** (lunch is protected by default): they compress to their floor but stay in every version of the day. No third state, no lingering. → step 6.
6. **Review the rebuilt day** — a full-screen, fully editable preview (the SH3 pattern): shortened blocks show their new times with zero "reduced" labeling, and every block can still be dragged, resized, or tapped right there.
7. **Apply** → Today updates in place; "Leave it as is" backs out untouched. A day re-flowed at 1:30pm gets the same warm treatment as one begun at 8:00.

**Design guarantee carried through every step:** the words "late," "missed," "behind," and any before/after comparison to the original plan never appear.

---

## Flow 4 — The In-Day Loop (Today view)

**Entry:** ritual complete; this is home until the day ends. Not linear — a hub of small loops she dips into all day.

**4a. Completing a block**
Tap block → **Done**: sage tag, ring advances with the 420ms petal→rose fill. Order-independent; a compressed block counts identically to a full one. ◇ *Mis-tap?* Tap again → un-done, visually unremarkable. ◇ *That was the last block (100% day):* the evening state gains its celebration — "Wow! What a day." below the warm close, with rose petals drifting once from the top of the same sheet (once per day; reduced-motion shows the line alone).

**4b. Releasing a block**
Tap block → **Move to tomorrow** (one-off copy inserted into tomorrow's plan) or **Rest today** (released; the block fades — it does not gray out into an accusation). Same two actions available every time for the same block, forever, with identical language (PRD edge 15).

**4c. Reshaping the day** — the three timeline rules, live all day:
- Drag to reorder → silent, durations preserved, flexible blocks flow around anchors, day boundaries untouched, zero prompts.
- Resize / typed duration change → apricot overlap nudge when needed: "These two overlap — want me to nudge one?" one-tap fix.
- Cross 8:00am or today's end → one question: "Are you sure? This will extend your day to ___." Confirm updates today's boundary; decline reverts.

**4d. A block runs long**
Nothing automatic — no alerts, the soft "now" marker simply drifts. ◇ When *she* chooses: **"Shift the rest of my day"** → runs the Flow 3 engine mid-day (end-time pop-up if needed → slide/compress → didn't-fit sheet if needed). The result opens as a **full-screen, fully editable preview mirroring Today** — drag, resize, or tap any block before confirming; "Leave it as is" backs out with nothing changed. → back to Today.

**4e. Adding — always available**
A **persistent "+" sits in the Today header** at all times (the day is always editable). Add sheet: title, category, times → block placed on the timeline; boundary rule applies if it lands outside today's bounds. ◇ Default: **one-off, today only.** A quiet secondary option — **"Also add to my weekly rhythm"** — is the sole path to making it permanent (it can also be chosen later by editing the block). Nothing recurs without that explicit choice.

**Ambient state throughout:** intention line at top (if written); progress ring counting up only; current/next block elevated by shadow, not color-alarmed.

---

## Flow 5 — Weekend Flow

**Entry:** any Saturday or Sunday. By default the template contributes nothing and the day generates blank every week; if she has explicitly templated a weekend (setup copy or Rhythm), it generates from that template like a weekday.

1. **The open day** — Today view's inviting empty state: "Your Saturday is wide open." Prominent **"Add something"** button. An untouched weekend day is a complete, successful use of the app.
2. ◇ **Add something** (from Today's persistent "+", or from the Week view — where every current/future day carries its own "+", so a Thursday appointment or extra Friday work is one tap away too):
   - Quick-add sheet: title, category (work, workout, Spanish, life/other — a hangout with friends is a Life block with full visual dignity), time, duration → block appears on the timeline.
   - Adding an item creates no template, no expectation, no echo into future weekends — unless she explicitly taps "Also add to my weekly rhythm."
3. **Living an added weekend day** — identical to Flow 4 in every respect: same completion, same move/rest, same timeline rules, same silent day close. ◇ *Arrival on weekends:* the greeting animation plays as usual; an empty weekend lands straight in the open-day state (intention prompt still offered softly, skippable).

**Exit:** day closes by Flow 6 rules. Sunday night → Monday regenerates from the weekday template as usual.

---

## Flow 6 — Day Close, Late Nights & Returning

**6a. The quiet close (no ceremony)**
There is no end-of-day summary screen and no closing ritual in v1. Whenever she last looks at Today in the evening, it shows the additive truth and always closes on a warm line — "You showed up for 4 things today — that's real," or, on a day with nothing marked, "Rest is part of the rhythm. Tomorrow is ready when you are." Never silence, never a number alone. Untouched blocks are auto-rested **silently** when the day ends. No backlog is created anywhere.

**6b. The 4:00am boundary**
The current day persists until a new ritual is started **or** 4:00am, whichever comes first. Working at 12:30am → still today; blocks completable, timeline editable, no rollover jolt. ◇ At/after 4:00am, the next open is a new day → Flow 2/3 (or Flow 5's open state on weekends).

**6c. Opening a new day very late** (first open at 8:00pm)
Still Flows 2–3 — the greeting animation matches the hour ("Good evening"), Today lands as usual, and "Start from now" runs the same pop-up + optimization. A two-block evening is a complete plan. The day counts.

**6d. Returning after a gap** (one day or three weeks)
Next open → the arrival animation greets "Welcome back — today counts." No reference to the gap, no summary of skipped days, no "catch up." The Week view's past days show sage marks for what happened and silence about the rest. ◇ From here: indistinguishable from any other morning.

**6e. The day that was never opened**
Nothing happens, and that's the spec: its blocks auto-rest silently, tomorrow generates fresh from the template plus any explicitly moved blocks, and no trace of the unopened day asks to be acknowledged.

---

## Cross-Flow Rules (apply everywhere)

1. **Vocabulary allowlist:** done · resting · moved · open · ready. **Blocklist:** late, missed, overdue, behind, failed, broken, only, still, remaining.
2. **One question per action, ever.** The extend question, the boundary question, and the overlap nudge each fire once per triggering action and never nag.
3. **Every prompt has a guilt-free ghost exit** ("Maybe later," "Keep it as is," "Not today").
4. **Anchors never move** without her explicitly editing them — not by drag-flow, not by optimization.
5. **Nothing auto-dismisses** and nothing counts down (Soft Focus accessibility + calm rules).
6. **Every flow ends at Today** — the app has one home, and all roads lead back to it.
