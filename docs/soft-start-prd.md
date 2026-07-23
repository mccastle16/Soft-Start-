# Soft Start — Product Requirements Document

**Version:** 1.9 · **Date:** July 21, 2026 · **Status:** Updated during Phase 4 wireframe review, round 3
**Design system:** Soft Focus v1.0 (see `style-guide.html`)

---

## 1. Overview

Soft Start is a personal daily-planning web app built for one user: a remote AI consultant with a flexible schedule, side projects, a language-learning goal, and a fitness goal — and a hard time getting the day started. The app turns a weekly rhythm into a concrete, timed plan for each day, opens every morning with a calm ritual that makes starting easy, and treats everything that doesn't happen as *moved* or *resting*, never as failure.

It is a mobile-first progressive web app (PWA), designed primarily for iPhone but fully usable in any desktop browser. Version 1 requires no account, no backend, and no notifications: the entire value lives in two things — **a plan that already exists when you wake up**, and **a morning moment that starts it**.

---

## 2. Product Philosophy

> **The plan removes the negotiation. The app never keeps score against you.**

The user's own words define the product: *"I can be very disciplined as long as I have a plan."* and *"I put enough pressure on myself — an app constantly telling me what I didn't get done would be anti-productive."* Soft Start therefore inverts the standard habit-app model. Where most productivity apps assume the user lacks motivation and try to manufacture it through streaks, badges, and guilt, Soft Start assumes the user has plenty of discipline and motivation — what's missing is a **pre-made decision about what the day looks like**, and a **low-friction way to step into it**.

Four principles govern every product decision, extending the Soft Focus design principles into behavior:

**The day starts when you do — and the day you have is optimized, not mourned.** There is no such thing as a "ruined" day. Opening the app at 11:30am doesn't show three missed blocks — it offers to rebuild the remaining day from right now, making the best use of whatever time is left. A shorter Spanish session is still Spanish. A 20-minute workout is still a workout. The core failure loop this product exists to break is: *started late → day feels failed → why bother → day actually fails.* The app's answer: a day begun at noon is a day begun, and it gets a real plan, not a leftover one.

**Done over due.** All progress is additive. The interface shows what has been accomplished ("2 of 6 done"), never what is outstanding, overdue, or missed. Untouched blocks quietly fade at day's end; they do not accumulate into a backlog.

**Skipping is a feature, not a failure.** Every block can be moved to tomorrow or set to "rest today" with one tap and neutral language. The ghost-button pattern from Soft Focus ("Maybe later") is a product behavior here, not just a visual style.

**Calm is a functional requirement.** No red, no badges, no counts of undone things, no countdown pressure, no auto-dismissing content. If a feature can only work by creating urgency, it doesn't belong in this product. This is inherited directly from the Soft Focus system and treated as non-negotiable.

---

## 3. The User

A single, known user (the product is personalized, not general-market):

- Works remotely for an AI consulting company; fixed meetings **Tuesdays and Thursdays at 10:00am**, all other work self-directed from home.
- Runs personal side projects to build AI and dashboard-development skills.
- Wants to practice **Spanish daily** and **work out more consistently**.
- Has no imposed schedule, struggles most with **starting the morning**, and experiences a late start as a failed day.
- Prefers a gentle on-ramp: the day opens at **8:00am with ease-in activities** (wake up, brush teeth, coffee, breakfast) and **active blocks begin at 9:00am**.
- Keeps **weekends unplanned by default** — Saturday and Sunday start blank every week, with easy one-tap adding when she chooses to schedule something (extra work, a hangout, anything).
- Self-described: highly disciplined *given a plan*; highly self-critical *without one*. Guilt-based mechanics are actively counterproductive for her.

There is no secondary persona in v1. Design decisions are resolved by asking what serves this user, not a hypothetical market.

---

## 4. Problem Statement

Remote, self-directed work provides no external structure. Without a schedule, every morning begins with an open-ended negotiation ("what should I do first?"), which delays the start of the day; a delayed start triggers self-criticism; self-criticism drains the motivation the rest of the day needed. Existing habit and productivity apps make this worse by surfacing what's overdue, breaking streaks, and framing incomplete days as failures — precisely the pressure this user already over-supplies herself.

**Soft Start's job:** deliver a ready-made, realistic, timed plan every morning; make beginning the day a 60-second ritual instead of a negotiation; guarantee that nothing in the interface ever reads as an accusation; and, on late days, rebuild the best possible plan for the time that remains.

---

## 5. Goals & Success Criteria

Because this is a personal product, success is felt, not dashboarded — but it should still be checkable:

1. **Earlier starts.** Within two weeks of daily use, the morning ritual is typically completed earlier than the user's current start time.
2. **Sustained use without dread.** The user still opens the app after week two, and opening it never produces the "ugh" feeling that guilt-driven apps produce.
3. **The late-start loop is broken.** On days that begin late, the user re-flows and continues rather than writing the day off — measured honestly by her own reflection, not by an in-app metric.
4. **All four life areas get regular time.** Work, side projects, Spanish, and workouts each appear in the lived week, not just the template.

Explicitly *not* success criteria: completion percentage, streak length, total hours logged. The app will never compute a "productivity score."

---

## 6. MVP Scope (Above the Cut Line)

### 6.1 Weekly Rhythm (template setup)

A one-time (and always editable) setup where the user defines her default week. Each weekday has its own template; weekdays can be duplicated to avoid repetitive entry.

- A template is a set of **blocks**, each with: a title, a category (Ease-in · Work · Side project · Spanish · Workout · Life · Other), a start time, and an end time (exact times).
- **Day shape defaults:** the template editor starts each weekday at **8:00am with an ease-in span** (wake, coffee, breakfast — gentle blocks that count toward progress like anything else; making coffee counts) and places the first active block at **9:00am**. The weekday **default end of day is 5:00pm**.
- **The day shape is fully user-owned.** All four values — day start (ease-in begins), ease-in length (when active blocks begin), lunch time and length, and day end — are asked once during first-run setup, then **persist exactly as set until she explicitly changes them**, either globally (Rhythm → Day Shape) or per-day (template editor / today's tweaks). The app never adjusts, suggests, or "learns" new day-shape values on its own; the numbers in this document (8:00am / 9:00am / 12:30-1:30pm / 5:00pm) are her current answers, not fixed product constants.
- **Lunch is a default block in every weekday template:** 12:30-1:30pm (60 minutes), category Life, **protected tier**, with a 30-minute minimum — so every version of the day includes eating. Fully editable or removable like any block; the default just guarantees it's never forgotten by design.
- Blocks belong to one of **three tiers**, the core data-model decision of the app:
  - **Anchored** — fixed wall-clock time; never moves or compresses during re-flow (Tue/Thu 10:00am meetings).
  - **Protected** — can slide and compress to its minimum duration, but is **never dropped**: it never appears on the "didn't fit" sheet. Lunch is protected by default; any block can be marked protected (a health routine, an appointment worth keeping at any length).
  - **Flexible** — can slide, compress to its minimum, and when even that doesn't fit, is offered as move-to-tomorrow / rest-today. The default tier for most blocks.
- Each flexible block has an optional **minimum duration** (default 15 minutes) — the floor below which re-flow won't shrink it (it's offered as move/rest instead).
- **Weekends are blank by default — templatable only by explicit choice.** Saturday and Sunday carry no template unless she explicitly creates one (by copying a weekday to them during setup, or by building them in Rhythm); absent that choice they regenerate empty every week. The app itself never fills a weekend. Their empty state is inviting, with a prominent one-tap **"Add something"** button for spontaneous plans — extra work time, a hangout with friends, anything. An empty weekend day is a fully valid, fully intended day.
- Categories carry the Soft Focus visual language (blush tiles, rose/sage/apricot tags) but no category is styled as more "important" than another — Spanish at 8am and client work at 9am get equal visual dignity.
- Editing the template affects **future days**; today's already-generated plan is untouched unless the user re-opens today's tweaks.

### 6.2 Morning Soft Start Arrival (the signature feature)

The app's namesake and the one orchestrated moment per day. There is no sequence of screens to click through: opening the app on a fresh day plays a brief greeting animation and lands directly on Today, plan ready.

1. **The greeting animation** — the screen itself fades in softly on app open (a petal→deep-rose field, per the approved visual pass), then a time-aware "Good morning" in white script with one rotating one-line encouragement beneath it (Appendix B, e.g., "Every day counts."). It doubles as the loading moment while today's plan generates. Duration: long enough to read, never long enough to annoy — target **~4–6 seconds** (tunable in the prototype), and a tap anywhere skips ahead. If days were skipped, the greeting reads "Welcome back — today counts," with zero reference to the gap.
2. **The float-and-fade transition** — the greeting and quote drift upward together; "Good morning" fades out; the quote docks at the top of the screen, where it stays all day.
3. **The intention screen** — full-screen, directly after the greeting, with the day's quote already docked at the top: one rotating Appendix A question ("What would make today feel good?"), a one-line field, and a ghost "Maybe later." Submitting plays the arrival's signature move a second time — the answer floats up and docks beneath the quote. "Maybe later" sets no intention: the next screen is simply Today without an intention line, and nothing ever re-prompts. *Status: experimental — kept for v1 to evaluate; may be removed. Future direction: responses could feed the v2 AI-drafted-day feature.*
4. **Landing on Today** — the plan is simply there, fully editable as always (§6.3). No draft-review step and no "Continue" button: a screen that only confirms what's already decided is friction, so it doesn't exist.
5. **"Start from now" — always offered, never presumed.** The app never infers lateness from the clock: opening at 12:40pm doesn't mean the day started at 12:40 (she may have been working all morning). A quiet "Start from now" action is available on Today at any hour — the same Re-flow Engine as "Shift the rest of my day." Choosing it runs the re-flow:
   - **Step A — the day-length pop-up:** a small pop-up over the plan (not a separate screen) asks once, gently: "Want to end the day a little later, or keep your usual evening?" Keep → straight to Step B. "Pick a later time" → a simple end-time picker, then Step B. The same pop-up pattern appears whenever any re-flow would push past the day's bounds. Either answer is presented as equally good.
   - **Step B — optimization:** given the chosen end time, the app rebuilds the remaining day to make the best use of the time available. Anchored blocks hold their exact times. Protected blocks slide and compress to their floors but always remain. Flexible blocks slide forward and **compress proportionally** — everything shrinks a little rather than a few things vanishing — down to each block's minimum duration. Only flexible blocks that can't fit even at minimum are surfaced under "Didn't fit today — move or rest?" Shortened blocks display their new times plainly, with no "reduced" labeling or apology.
   - The result opens as a **full-screen, fully editable preview** (the SH3 pattern) before it becomes the day — always a *real plan for the day she actually has*, not a truncated copy of the morning-person plan she didn't.

### 6.3 Today View (primary page)

Where the user lives all day, and the app's home screen. A vertical, **time-proportional timeline** of today's blocks in Soft Focus cards:

- **Block height maps to duration.** The timeline uses a consistent vertical time scale, so a 20-minute block is visibly smaller than a one-hour block — the shape of the day is readable at a glance. (Very short blocks never shrink below the 44px touch-target minimum; see edge case 21.)
- **The day is directly editable, all day long — with three distinct interaction rules:**
  - **Reordering is silent.** Dragging a block to a new position makes the other flexible blocks flow around it automatically, preserving every block's duration. Because nothing changes length, the day's start and end stay exactly where they were — so no prompt, no note, no confirmation. Reordering is the most common edit and it must feel like nothing.
  - **Length changes get the gentle nudge.** Dragging a block's bottom edge to lengthen or shorten it (height and times update live), or typing new times that change a duration, can create an overlap — that's when the soft apricot note appears ("These two overlap — want me to nudge one?") with a one-tap fix.
  - **Crossing the day's boundaries gets one honest question.** Moving or extending a block to before the day's start (8:00am) or past its end (5:00pm, or whatever today's end is) triggers a calm confirmation: "Are you sure? This will extend your day to 6:30pm." Confirming updates today's boundaries; declining leaves the block where it was. Asked once per action, in apricot tone — a question, never a warning.
  - **Tap a block's times** to type or pick exact start/end times manually, for precision that dragging can't give.
  - Edits snap to 5-minute increments and apply to today only; the weekly template is untouched.
- The **Soft Start wordmark** at the top of the view — a script/display treatment whose exact design is decided in the visual pass (currently marked TBD).
- A **persistent "+" in the Today header** — the day is always editable, so adding is always one tap away. A new block is a **one-off for today only** by default; the add sheet includes a quiet secondary option, "Also add to my weekly rhythm," for the explicit cases where she wants it to become permanent. Nothing is ever templated implicitly.
- The day's **greeting quote docked quietly at the top**, with the intention line beneath it — both delivered by the arrival's float-and-dock animation. If "Maybe later" was chosen, the intention line is simply absent; nothing re-prompts.
- A **gentle progress ring** ("3/6") using the petal→rose gradient — additive framing only.
- A subtle "now" indicator showing where the day currently is — a soft marker, not a red line, and never paired with lateness language.
- The current/next block visually emphasized by elevation (shadow-lift), not by alarm color.

### 6.4 Week View (secondary page)

A second top-level view showing the full week at a glance:

- Seven day columns (or stacked day cards on mobile), today softly highlighted.
- Past days show only what was done (sage marks); nothing about what wasn't — the past renders additively too.
- Future weekdays preview their template-generated plans; tapping a day peeks at its blocks.
- A **"+" available on every day of the week** — tapping any current or future day opens the same add sheet as Today: one-off by default, "Also add to my weekly rhythm" as the explicit path to permanence. An appointment on Thursday or extra work on Friday is added in seconds without touching the template.
- Saturday and Sunday show their inviting empty state with the **"Add something"** button directly in the week view, so weekend spontaneity is one tap from anywhere.
- The Week view is for orientation and light additions; deep template editing still lives in Weekly Rhythm settings.

Navigation is deliberately tiny: **Today (home) · Week · Rhythm (settings)**.

### 6.5 Gentle Completion

Tapping a block marks it done: sage tag, ring fills with the 420ms rose animation, and the completed block **visually recedes — it desaturates and grays out in place** while the ring carries the celebration. Done is done — there is no partial credit to compute and no quality judgment; a compressed block completed counts identically to a full-length one. Blocks can be un-done (mis-taps happen). Completing blocks out of order is fully supported and visually unremarkable.

### 6.6 Guilt-Free Rescheduling & Day Close

- Any block, at any time, offers three quiet actions: **Done · Move to tomorrow · Rest today.** "Move to tomorrow" inserts a one-off copy into tomorrow's plan; "Rest today" simply releases it.
- Mid-day, a **"shift the rest of my day"** action is always available (for when a block runs long), reusing the same optimization engine as the morning re-flow — including the option to extend the day's end.
- At day's end, untouched blocks are treated as "rested" automatically — silently. There is no end-of-day summary of what didn't happen. If the user opens the app late at night, the Today view shows what was done and **always closes on a warm line** — "You showed up for 4 things today — that's real," or, on a day where nothing got marked, something equally kind with zero accounting: "Rest is part of the rhythm. Tomorrow is ready when you are." The evening state never ends on silence or a number alone.
- No backlog exists anywhere in the product. Tomorrow is always generated from the template plus explicitly moved blocks — never from yesterday's remainder.

### 6.7 Platform & Technical Shape (v1)

- **PWA**, installable to the iPhone home screen, fully responsive for desktop use.
- **Local-first**: all data in browser storage on the device, no account, no server. (Consequence: phone and laptop hold separate copies in v1; the phone is the primary source of truth. Sync is below the line.)
- **Day boundary at 4:00am**: the current "day" persists until a new day's ritual is started or 4:00am, whichever comes first — late nights never hit a jarring midnight rollover.
- A **manual export/backup** (download a JSON file) is included in v1 as cheap insurance against browser-data loss.
- Built entirely on Soft Focus tokens; the style guide's `:root` block is the starting stylesheet.

---

## 7. Below the Cut Line (Future Features)

Ordered roughly by expected value to this user:

**v1.1 — Gentle presence**
- A single optional morning push notification ("Your day is ready whenever you are") — one per day, no follow-ups, no block-by-block reminders.
- PWA polish: offline reliability, home-screen icon set, splash screen.

**v1.2 — Deeper days**
- **Session mode**: opening a block full-screen with an elapsed (never countdown) timer and the Soft Focus illustration style — for Spanish practice, workouts, and deep work.
- **Evening preview**: an optional wind-down moment that shows tomorrow's draft, making the next morning's start even softer.

**v1.3 — Gentle history**
- Weekly reflection view: additive trends only ("You showed up 4 mornings," "Spanish appeared 5 days this week"). Resting streaks that pause rather than break.
- Intention journal: a scrollable history of past daily intentions.

**v2 — Connected & assisted**
- **Apple Calendar sync** (meetings flow in as anchored blocks automatically).
- **AI-drafted days**: the app proposes today's plan from the template, recent patterns, intention-prompt history, and a one-line brain-dump — fitting, given the user's profession.
- **Cross-device sync** via a lightweight backend, replacing local-only storage.
- Spanish and workout **modules**: light integrations or logging tailored to those two goals (e.g., what was practiced, which workout).

---

## 8. Non-Goals & Anti-Features

These are permanent product boundaries, not deferred features:

- No red anywhere; no exclamation-mark urgency; no countdown timers.
- No overdue states, missed counts, broken streaks, or backlog views.
- No guilt-toned notifications, ever — including "You haven't opened the app in a while."
- No productivity scores, grades, or completion-percentage judgments.
- No commentary on compressed or shortened days — the app never compares today's plan to the "original."
- No auto-filling of weekends — blank weekends are a feature, not a gap.
- No social features, sharing, or comparison of any kind.
- No gamification currency (points, gems, levels).
- No multi-user support; this is a product for one person.

---

## 9. User Stories (MVP)

**Setup & template**
1. As the user, I can define a weekly rhythm of timed blocks per weekday — easing in from 8:00am and going active at 9:00am — so my plan exists before any given morning does.
2. As the user, I can mark a block as anchored (my Tue/Thu 10am meetings), so re-flow never moves what can't move.
3. As the user, I can duplicate one weekday's template to others, so setup takes minutes, not an evening.
4. As the user, I can edit my template anytime and have changes apply from tomorrow, so mid-week improvements never disrupt today.
5. As the user, my Saturdays and Sundays start blank every week, with a one-tap way to add anything I choose, so weekends are mine by default.

**Morning ritual**
6. As the user, I open the app in the morning and see today's plan already made, so my day starts with recognition instead of negotiation.
7. As the user, I can tweak today's plan in a few taps (reorder, retime, rest a block, add a one-off), so the plan fits the real day without rebuilding it.
8. As the user opening the app late, I can tap "Start from now," choose whether to extend my evening, and get a re-optimized day that makes the best of the time I have, so a late start is a start — not a failure and not a leftover.
9. As the user, I'm asked one gentle intention question I can answer or skip, so the day has a tone, not a quota.

**Living the day**
10. As the user, I see my day as a calm, time-proportional timeline — block sizes match their durations — with the current block gently emphasized, so I can read the shape of my day at a glance.
10a. As the user, I can reshape my day directly by dragging blocks to new times, dragging their edges to resize them, or tapping to type exact times, so adjusting the plan feels like moving things on a desk, not filling out a form.
11. As the user, I can flip to a Week view to see my whole week at a glance — including adding something to a blank weekend day — so I have orientation without losing Today as home.
12. As the user, I can mark blocks done in any order and watch progress grow additively, so the app reflects effort rather than auditing it.
13. As the user, I can move any block to tomorrow or rest it today in one tap with neutral language, so changing the plan never feels like breaking it.
14. As the user whose block ran long, I can shift the rest of my day (and optionally extend its end), so one overrun never cascades into chaos.
14a. As the user, I always have a "+" at the top of Today and on every day in the Week view, and what I add stays a one-off unless I explicitly choose "Also add to my weekly rhythm," so spontaneous additions never quietly become obligations.
14b. As the user, every weekday plan includes a lunch break by default (12:30-1:30pm), and no re-flowed day ever drops it, so even my busiest optimized day feeds me.

**Day close & continuity**
15. As the user checking in at night, I see only what I accomplished, so the day ends on what happened.
16. As the user working past midnight, my day stays my day until 4:00am, so late nights don't get cut in half.
17. As the user returning after skipping days, I'm welcomed without any reference to the gap, so coming back is always easy.
18. As the user, I can export my data as a file, so a cleared browser cache can't erase my rhythm.

---

## 10. Edge Cases & Resolutions

| # | Edge case | Resolution |
|---|-----------|------------|
| 1 | **App opened at 12:40pm** | No lateness is inferred — the ritual is identical at any hour, and "Start from now" is available as always (it's always available). No missed-block language exists in the UI. |
| 2 | **Late start with limited time** | Extend-day question first; then proportional compression of flexible blocks (respecting per-block minimums) so every priority keeps a foothold where possible. Shortened blocks are shown plainly, never labeled as reduced. |
| 3 | **Re-flow collides with an anchor** (flexible blocks can't fit before the 10am meeting even at minimum duration) | Blocks that fit slide/compress in; those that can't are listed under "Didn't fit today — move or rest?" with the two quiet actions. Nothing is silently deleted. |
| 4 | **Re-flow runs past the chosen end time** | Same pattern: overflow blocks offered as move/rest. The app asks about extending once — it never nags to extend further. |
| 5 | **User declines to extend on a very late start** (e.g., 1:30pm start, usual 5:00pm end) | Fully respected: the app builds the best 3.5-hour day it can. A three-block afternoon is a complete plan, not a consolation. |
| 6 | **Tweaks create overlapping blocks** | Soft apricot note ("These two overlap — want me to nudge one?") with a one-tap fix. Never blocking, never red. |
| 7 | **A block runs long** | Nothing happens automatically — no alerts. The "now" marker drifts; the "shift the rest of my day" action (with optional extend) is available whenever she wants it. |
| 8 | **The day is never opened at all** | Tomorrow generates fresh from the template. Yesterday's untouched blocks are auto-rested silently; no carry-over backlog. |
| 9 | **Multi-day gap** | Warm welcome-back greeting; ritual proceeds as any other morning. Any future streak feature shows "resting," never "broken." |
| 10 | **Blank weekend day** | The inviting empty state *is* the design: "Your Saturday is wide open" + "Add something." No suggestion that emptiness needs fixing. Adding one item doesn't generate any template or expectation for future weekends. |
| 11 | **Weekend with added plans, partially done** | Identical rules to weekdays: additive progress, silent resting, no carryover. |
| 12 | **Opening the app for the first time on a given day in the evening** | The arrival adapts: the greeting animation matches the hour ("Good evening"), Today lands as usual, and "Start from now" extend/optimize works identically. A day started at 8pm still counts. |
| 13 | **Working past midnight** | The day persists until a new ritual is started or 4:00am, whichever comes first — no jarring rollover at 12:00am. |
| 14 | **Marking done out of order / undoing a done** | Fully supported, visually unremarkable, one tap each way. |
| 15 | **Moving the same block to tomorrow repeatedly** | Allowed indefinitely with identical neutral language. The app never comments on how many times something has moved. |
| 16 | **Editing the template mid-day** | Applies from tomorrow; today's plan is stable unless she explicitly reopens today's tweaks. |
| 17 | **Different device (laptop) opened** | v1 is local-first: the laptop shows its own copy. The UI states this plainly on desktop ("This device keeps its own copy — your phone is home base") until sync ships in v2. |
| 18 | **Browser data cleared / phone replaced** | Export/import JSON backup (§6.7). The app gently suggests an export after major template edits. |
| 19 | **Travel / timezone change** | All times are local device time; blocks are wall-clock times, not UTC. Anchored meeting times are her responsibility to adjust when traveling (v1); calendar sync solves this properly in v2. |
| 20 | **100% completed day** | The celebration lives **inside the evening state, not on a separate screen**, with no ring animation: the usual done list and warm close, then "Wow! What a day." beneath — the only exclamation mark in the entire app, spent on joy — while rose petals drift once from the top of the same sheet. Fires once per day; `prefers-reduced-motion` shows the line alone. A deliberate, user-chosen exception to Soft Focus's no-confetti and no-exclamation rules. |
| 21 | **Very short block on the proportional timeline** (e.g., 10 minutes) | Block height never drops below the 44px touch-target minimum (Soft Focus accessibility rule). Below that threshold the block renders at minimum height in a condensed one-line style; the time scale stays honest everywhere else. |
| 22 | **Dragging to reorder** | Pure reorder (durations unchanged): other flexible blocks flow around the dropped block automatically. Day start/end are mathematically unchanged, so no prompt of any kind appears. Anchored blocks hold their times; flexible blocks flow around them. |
| 23 | **A length change creates an overlap** | Soft apricot note ("These two overlap — want me to nudge one?") with a one-tap fix. Applies to edge-drags and typed time changes alike. Never blocking, never red. |
| 24 | **Moving/extending a block before 8:00am or past today's end** | One calm confirmation: "Are you sure? This will extend your day to ___." Confirm → today's boundary updates and the block lands. Decline → nothing changes. One question per action; no repeat nagging. |
| 25 | **Severely compressed day** (e.g., 1:00pm start, 5:00pm end kept) | Optimization fits what it can at minimum durations; everything that can't fit appears on the "Didn't fit today" sheet, where **she chooses** per block: Move to tomorrow or Rest today. The app never auto-decides which priorities lose. Lunch compresses (to 30 min) but never appears on this sheet. |
| 26 | **One-off added via "+" that she wants to keep** | The add sheet's "Also add to my weekly rhythm" option (or editing the block later and choosing the same) writes it into the template for that weekday going forward. Without that explicit choice, additions never recur. |
| 27 | **Empty weekday** (no template blocks, or every block rested during the ritual) | Identical treatment to a blank weekend: the inviting open state ("Your Tuesday is wide open") with "Add something." Anchors, if any, still render. Never an error, never a prompt to fill it. |
| 28 | **A single edit triggers both an overlap and a boundary crossing** | Only one note ever shows at a time. The boundary question (N2) takes precedence — whether the block may land there must be answered first. If confirmed and an overlap remains, the overlap nudge (N1) follows as its own separate moment. Notes never stack. |

---

## 11. Open Questions

None outstanding.

*Resolved in v1.1: day boundaries (8am ease-in / 9am active), blank weekends with one-tap add, intention prompts (kept as experimental, generated per Appendix A), 4am day boundary, extend-day question in re-flow, optimization of late starts, Today as primary page with a Week view.*

*Resolved in v1.2: weekday default end of day is **5:00pm**, editable globally and per-day. This is also the baseline the "extend my day?" question starts from during late-start re-flow.*

---

## Appendix A — Intention Prompt Set (v1)

Twelve rotating prompts, each grounded in a documented effect from motivation and wellbeing psychology. One appears per morning; all are answerable in a single line and skippable without comment. None reference output, quotas, or lateness.

| # | Prompt | Psychological grounding |
|---|--------|------------------------|
| 1 | "What would make today feel good?" | Affective forecasting / approach-goal framing — orienting toward positive states rather than avoidance. |
| 2 | "What's one thing that, if done, would make today feel complete?" | Goal-setting research on a single clear priority; reduces decision fatigue and diffusion of effort. |
| 3 | "Finish this: today will be a good day if I ______." | Implementation-intention style ("if–then") planning, shown to substantially raise follow-through (Gollwitzer). |
| 4 | "What are you looking forward to today?" | Anticipatory savoring — anticipating a positive event reliably lifts present mood. |
| 5 | "How do you want to feel by tonight?" | Emotion-goal setting; framing the day by desired end-state rather than task volume. |
| 6 | "What's something you're grateful for this morning?" | Gratitude practice (Emmons & McCullough) — brief morning gratitude improves mood and persistence. |
| 7 | "What's one small thing you can do for future-you today?" | Future-self continuity — feeling connected to one's future self increases beneficial present action. |
| 8 | "Which part of today are you most curious about?" | Intrinsic motivation / Self-Determination Theory — curiosity-framing engages autonomous motivation. |
| 9 | "What does showing up look like for you today?" | Process-over-outcome focus — process goals sustain motivation better than outcome goals. |
| 10 | "If today gets hard, how will you be kind to yourself?" | Self-compassion (Neff) — pre-committing to self-kindness buffers the self-criticism spiral this user knows well. |
| 11 | "What strength of yours gets to shine today?" | Strengths use (positive psychology) — deploying signature strengths predicts engagement and energy. |
| 12 | "What's one distraction you're happy to let rest today?" | Temptation pre-commitment, framed additively ("let rest") rather than restrictively ("avoid"). |

Rotation rule: prompts cycle so the same one never appears twice in a week; the answer field is one line; skip is a ghost button ("Maybe later") with no follow-up.

---

## Appendix B — Greeting Quote Set (v1)

Eight one-line encouragements rotated beneath the morning greeting; each obeys the vocabulary rules (no output, quotas, or lateness) and reads in under two seconds. The day's quote floats up with the greeting and stays docked at the top of Today until the day closes.

1. "Every day counts."
2. "The day starts when you do."
3. "Small steps, real momentum."
4. "Begin gently."
5. "Today is enough."
6. "Showing up is the whole trick."
7. "One thing at a time."
8. "Soft starts still count."

Rotation: never the same quote two days in a row.

---

*Next phases: Phase 2 will map the user flows (first-run setup, the daily morning ritual with the late-start extend/optimize path, the in-day loop, weekend flow, and day close). Phase 3 will translate this PRD into a complete screen inventory and information architecture.*
