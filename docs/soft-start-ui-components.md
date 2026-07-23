# Soft Start — UI Component Inventory (ongoing)

**Status:** living document, grows with each approved mockup · **Covers:** ALL screens — S1 Today · R1/R2 Arrival (Variant B) · SH1/SH2 · S2 Week · Interruptions (deep-blush question voice) · S0 First Run · S3 Rhythm · Evening + Celebration. **Inventory complete: 39 components + foundation.**
Each component lists its variants/props and every screen it appears on. When all mockups are approved, this is the complete build list.

## Foundation (not components, but shared by all of them)
| Item | Notes |
|---|---|
| Design tokens | The Soft Focus `:root` block with two amendments: `--bg` lightened to **#FCFAF9** (approved at the S1 mockup — update the style guide to match), and `--font-script: "Ephesis"` added for the wordmark only |
| Type stack | Outfit (display/UI) · Nunito Sans (body) · Ephesis (script accents: the wordmark + the day-of-week heading — nowhere else, so the coziness stays special) |
| Motion rules | One orchestrated moment per screen; `--t-fast/--t-med/--t-slow`; all collapse under `prefers-reduced-motion` |
| Color semantics | **Categories speak only rose + cream** (petal, rose, deep rose, cream, latte, blush). **Sage is reserved exclusively for "done."** **Deep blush (#F7E3E7 field, deep-rose dot, #8F4F63 text) is reserved exclusively for gentle questions/notes** — one shade deeper than any surface, the quietest possible question. Past-day marks go warm gray. Functional colors never compete with decorative ones. |

## Components (from S1 Today)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 1 | **AppWordmark** | size (arrival-large / today-small); color (deep rose on porcelain; white variant reserved for R1 if it gets a tinted background) | S1, R1 |
| 2 | **QuoteLine** | — (text from Appendix B rotation) | S1, R1, R2 |
| 3 | **IntentionLine** | present / absent (never a placeholder) | S1 |
| 4 | **ScreenHeader** | title in Ephesis script (day of week, ~40px, ink) + subtitle date in Outfit; slot for actions | S1, S2, S3, SH3 |
| 5 | **IconButton** | icon (plus, back, menu…); 42px circle, blush fill, 44px touch target | S1, S2, S3, sheets |
| 6 | **ProgressRing** | value/total; header-52px; petal→rose gradient; fill animation (the screen's one moment); aria-label | S1 header |
| 7 | **TimelineView** | scale (px per minute); day bounds; children: TimeGutter + blocks + NowMarker; scrollable | S1, R3b/SH3 preview, S0.4, S3.1 |
| 8 | **TimeGutter** | hour labels, Outfit 10.5, muted rose-gray | inside TimelineView |
| 9 | **BlockCard** | tier/state variants: `flexible` (white + shadow-rest) · `soft` (blush, ease-in/protected) · `anchored` (deep blush) · `current` (shadow-lift + 1px rise) · `done` (warm gray, drained color, no shadow) · `condensed` (44px one-line, edge 21); slots: title, times, CategoryTag, DragHandle | S1, previews, template editors, R2 draft-descendants |
| 10 | **CategoryTag** | category: ease-in (petal) / work (rose) / side-project (deep rose) / spanish (cream) / workout (latte) / life (pale blush) / other (warm neutral) — dot + label pill, all in the rose-and-cream family, equal visual weight; states: `done` (sage — the only sage in the app) · `anchored` · `protected` (quiet) | on BlockCard, SH1, SH2, S2 |
| 11 | **DragHandle** | bottom-center pill on flexible blocks; petal tint on the current block; hidden on anchored | on BlockCard |
| 12 | **NowMarker** | petal hairline + rose dot with soft halo; position = current time; never red, no label | S1 |
| 13 | **TabBar / TabItem** | items: Today (sun) · Week (calendar) · Rhythm (waves); active = deep rose in blush pill; rounded top corners, soft up-shadow | S1, S2, S3 |
| 14 | **Icon set** | Lucide-style, 1.75px stroke, round caps: sun, calendar, waves, plus (more added as screens are designed) | everywhere |

## Components added by the Arrival (R1 + R2)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 15 | **IllustrationField** | Soft Focus radial-gradient light fields; variants: `full-rose` (R1 — chosen; fades in on app open), `corner-glow` (porcelain screens), `footer-pool` (R2, empty states) | R1, R2, S1 open state, S0.1 |
| 16 | **ScriptAccent** | The Ephesis rule as a component: wordmark / day-of-week / greeting sizes; ink, deep-rose, and white-on-rose color modes | R1, R2, S1, S2, S3 |
| 17 | **PrimaryButton** | pill (begin moments: "Set my intention", "Add something") and rounded (in-sheet confirms); rose fill, 48px min height | R2, sheets, first run |
| 18 | **GhostButton** | the guilt-free exit ("Maybe later", "Leave it as is", "Leave blank for now"); text-only, blush hover | R2, sheets, pop-ups, first run |
| 19 | **TextField** | one-line input; rose focus halo (4px, 12% alpha); placeholder in faint rose-gray; variants: intention / title / time-part | R2, SH1, SH2, S0, S3.2 |
| 20 | **SkipHint** | tiny centered "tap anywhere to skip" caption; light and dark-field modes | R1 |
| 21 | **FloatAndDock (motion)** | the arrival's signature animation: element drifts to top, larger sibling fades out, remainder docks; used for the quote, then the intention; collapses under reduced-motion | R1→R2, R2→S1 |

## Components added by the Sheets (SH1 + SH2)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 22 | **SheetContainer** | bottom sheet (mobile) / centered panel (desktop); 28px top radii, rose up-shadow, drag handle; warm-ink scrim (rgba ink .28 + soft blur) with the day visible behind | SH1, SH2, SH4, SH5, R3a pop-up host |
| 23 | **ActionRow** | the philosophy as buttons: one rose primary (Done) · paired blush secondaries (Move to tomorrow / Rest today) · ghost tertiary (Edit block); also single-primary mode (Add to today) | SH1, SH2, SH4 |
| 24 | **TimeRow** | blush tappable pill row showing start–end with hint label ("tap to change" / "next open gap") + chevron; opens inline time entry, 5-min snap | SH1, SH2, S0.2, S3.2 |
| 25 | **CategoryPicker** | wrapping pill chips for all 7 categories; selected = rose fill + white text; single-select | SH2, SH1's Edit block, template editors |
| 26 | **Toggle** | rose when on, deep-blush when off; used for "Also add to my weekly rhythm" and the anchored/protected tier controls | SH2, SH1 edit, S3.1 |

## Components added by Week (S2)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 27 | **DayCard** | four temperatures: `past` (recedes to canvas, no shadow, **fully grayed marks**; only the sage done-tag and "showed up for" line keep color) · `today` (shadow-lift + blush Today tag + inline "+") · `future` (white card, rose-and-cream preview marks, inline "+") · `weekend-open` (blush gradient, "Wide open." + rose Add pill) | S2 (mobile stack + desktop columns) |
| 28 | **MiniBlockMarks** | tiny rounded bars, width ∝ duration; tints: rose-and-cream category pastels for future, **warm gray for done (today and past alike)**, ringed deep-blush for anchors | inside DayCard, SH5 |
| 29 | **AddPill** | small rose pill "+ Add something"; the weekend's begin-moment | DayCard weekend, S1 open state |

## Components added by the Gentle Interruptions (N1/N2 · R3a · SH4)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 30 | **InlineNote** | deep-blush question card sliding in place between blocks; copy variants: `overlap` (N1) · `boundary` (N2) · `backup` (N3, in Rhythm); one soft white-pill action + one quiet dismiss; never blocking | S1 timeline, R3b/SH3 preview, S3.3 |
| 31 | **ModalCard** | small centered card over the warm scrim (never full-screen): the R3a day-length question; two equal blush answers + one reassurance line; also hosts future confirmations | R3a (from "Start from now" / SH3) |
| 32 | **FitRow** | canvas-tinted row: block title + its own Move/Rest blush pair; chosen answer fills rose; composed into SH4 via SheetContainer | SH4 |
| 33 | **TimePicker** | hour/minute/AM-PM entry for the end-time picker screen and TimeRow's inline editing; 5-min snap | R3a-ii, SH1, SH2, S0.2, S3.2 |

## Components added by First Run (S0)

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 34 | **Stepper** | rose segment strip showing first-run progress; segments fill left to right | S0.1–S0.6 |
| 35 | **SettingsRow** | white card row, label left; variants: `value` (blush pill value → TimePicker), `nav` (hint text + chevron), `blank` (blush, recessed — weekend rows) | S0.2, S3, S3.2, S3.3 |
| 36 | **DayPicker** | seven day chips; states: unselected (white) · selected (rose fill — the only selection signal) · source (recessed deep blush, unselectable) · covered (already scheduled — same recessed treatment, unselectable) | S0.5/S0.5c loop, template duplicate action |

## Components added by the Closing States

| # | Component | Variants / props | Appears on |
|---|-----------|------------------|------------|
| 37 | **DoneListRow** | quiet white row: sage check disc + grayed title; the evening state's list | S1 evening state, SH5 past-day peek |
| 38 | **WarmClose** | the always-present closing line; variants: standard ("That's real. Tomorrow is ready when you are.") · zero-done ("Rest is part of the rhythm.") · complete-day celebration line ("Wow! What a day." — the app's only exclamation mark) | S1 evening state |
| 39 | **PetalConfetti (motion)** | ~8–12 rose petals (rose, petal, cream) falling once (~5–6s) from the top of the evening sheet; fires once per 100% day; reduced-motion → none (the celebration line alone) | S1 evening state, complete day |

---

## Final tally — the pre-implementation build sheet

**Foundation:** amended Soft Focus tokens (`--bg: #FCFAF9`, `--font-script: Ephesis`) · type stack with the three-use script rule · color semantics law (categories = rose+cream · sage = done only · deep blush = questions only · gray = past/finished) · motion rules.

**39 components across 8 approved screen groups.** Heaviest reuse: BlockCard (6 variants), DayCard (4 temperatures), SettingsRow (3 variants), ActionRow, SheetContainer, InlineNote (3 copy variants), and the two motion components (FloatAndDock, PetalConfetti). Every component traces to a mockup, every mockup traces to the IA, every IA element traces to the PRD.

## Open design decisions carried on this list
- ~~R1 variant~~ — **resolved: Variant B**, the rose field with white script; the field fades in on app open (~1.6s), greeting follows a beat later.
- Category color mapping above is proposal v1 (Side project = a deeper rose tint to stay distinct from Work) — confirm or reassign.

*Next screens to mockup → components they'll add: sheets SH1/SH2/SH4 (SheetContainer, ActionRow, CategoryPicker, Toggle), Week (DayCard, MiniBlockMarks), notes N1–N3 (InlineNote, ConfirmPopup), re-flow preview + pop-up (Modal, TimePicker), first-run (Stepper, TimeField, DayPicker), Rhythm (SettingsRow), complete-day (PetalConfetti)…*
