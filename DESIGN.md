---
name: Soft Start
description: A calm daily-planning PWA that turns a weekly rhythm into a timed day and never keeps score.
colors:
  porcelain: "#FCFAF9"
  surface: "#FFFFFF"
  surface-blush: "#F9EDEE"
  surface-deep: "#F3E2E4"
  petal: "#EFC3CC"
  rose: "#C97489"
  deep-rose: "#B25F76"
  on-accent: "#FFFFFF"
  ink: "#453A3E"
  dust: "#8B7B80"
  line: "#EFE4E2"
  sage: "#6F9678"
  sage-soft: "#E4EFE6"
  apricot: "#C08A52"
  apricot-soft: "#F8ECDF"
  question-field: "#F7E3E7"
  question-text: "#8F4F63"
  category-easein: "#C9A2AB"
  category-easein-bg: "#FBF3F1"
  category-side: "#9E4F66"
  category-side-bg: "#F6E6EA"
  category-spanish: "#9A7350"
  category-spanish-bg: "#F6E8DC"
  category-workout: "#8A6F5E"
  category-workout-bg: "#EDDCD3"
  category-life: "#9B7A6E"
  category-life-bg: "#F3EAE6"
  done-ink: "#B3A8AB"
  done-bg: "#F4F0EF"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "2.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Nunito Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.04em"
  script:
    fontFamily: "Ephesis, cursive"
    fontWeight: 400
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.deep-rose}"
  button-secondary:
    backgroundColor: "{colors.surface-blush}"
    textColor: "{colors.deep-rose}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "13px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.dust}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
---

# Design System: Soft Start

## Overview

**Creative North Star: "The Gentle Morning in a Porcelain Room"**

Soft Start lives in a warm, unhurried material world: a porcelain-toned room where nothing casts a hard shadow, and one rose-lit morning moment a day is allowed to glow. The palette is a single rose-and-cream family stretched across almost the whole interface — porcelain and white for the room itself, blush tints for anything nested inside it, and a warm rose-brown ink instead of black. The only saturated departures are deliberate and narrow: sage means done and nothing else, apricot means the app has a gentle question and nothing else, and a soft rose gradient field is reserved for the single arrival moment each morning. Everything else stays quiet by design — this is a system for someone who is already disciplined and just needs the negotiation removed, so the interface never argues, alarms, or scores.

Depth comes entirely from tinted shadow blooms and blush-tint layering, never from borders or outlines — corners are generous everywhere and hairlines appear only inside tables and dividers. Motion is calm and singular: one orchestrated moment per screen (the arrival's rose-field fade and float-dock, the progress ring's fill, the once-a-day petal drift), plus quiet hover/press micro-interactions, with every transition collapsing to near-instant under `prefers-reduced-motion`.

Confirmed rejections: no red anywhere, no borders for depth, no badges or streak-shaming, no countdown or urgency language, no gamification currency, no comparison of today's plan against an "original." A day begun late is optimized, never mourned — the visual system's calmness is a direct expression of that product stance, not decoration on top of it.

**Key Characteristics:**
- Warm porcelain and white rooms; rose-brown ink instead of black
- Depth via rose-tinted shadow blooms + blush-tint nesting — never borders, never shadow-on-shadow
- Ephesis script reserved for exactly three moments: wordmark, day-of-week heading, morning greeting
- Sage = done, apricot = gentle question, deep blush = the question's field — each color has exactly one job
- One orchestrated motion moment per screen; everything eases out, nothing bounces or loops

## Colors

Rose-led warm neutrals: roughly 70% porcelain/surface, 20% blush tints, 10% rose accent by area. Sage and apricot appear only as small marks (tags, dots, note fields) — never as large fields.

### Primary
- **Rose** (`#C97489`): the one primary-action color — main buttons, the active tab, the progress-ring gradient's warm end. AA on white; reserved for the one main action per screen.
- **Deep Rose** (`#B25F76`): hover/active state for rose, text links, and the focus-ring color everywhere in the app.

### Secondary
- **Sage** (`#6F9678`): completion only — done tags, done-state check marks. Never used for anything else, including any other "positive" state.
- **Apricot** (`#C08A52`): the app's one "gentle attention" voice — the overlap nudge and boundary-confirmation notes. Never alarm, never paired with red-adjacent framing.

### Neutral
- **Porcelain** (`#FCFAF9`): the canvas — the amended, slightly lighter warm neutral this project uses in place of stock Soft Focus's `#FAF6F4`.
- **Surface** (`#FFFFFF`): cards and sheets sitting on the porcelain canvas.
- **Blush** (`#F9EDEE`): nested surfaces, hover fills, and the default state of category tags.
- **Deep Blush / Pressed** (`#F3E2E4`): pressed and selected fills (toggle track, selected timerow).
- **Ink** (`#453A3E`): primary text — a rose-brown, never pure black; 10.9:1 on porcelain.
- **Dust** (`#8B7B80`): secondary/muted text; 4.6:1 on white.
- **Line** (`#EFE4E2`): hairlines — the only place a 1px border-like stroke is allowed, and only inside tables/dividers.

### Named Rules
**The No-Red Rule.** Red never appears anywhere in the product. Apricot carries all "gentle attention" duty; sage carries all "completion" duty. Neither ever borrows the other's job.

**The Deep-Blush Question Rule.** The `#F7E3E7` field / `#8F4F63` text pairing (distinct from ordinary Blush) renders only when the app is gently asking the user something — the overlap nudge, the boundary-crossing confirmation. It never appears as decoration or as a third "info" color.

**The Equal-Dignity Rule.** All seven block categories (Ease-in, Work, Side project, Spanish, Workout, Life, Other) render in matched-saturation members of the same rose+cream family. No category reads as more important than another — Spanish at 8am and client work at 9am get identical visual weight.

## Typography

**Display Font:** Outfit (with system-ui, sans-serif fallback)
**Body Font:** Nunito Sans (with system-ui, sans-serif fallback)
**Script Font:** Ephesis (cursive fallback) — restricted use only, see Named Rule below

**Character:** Outfit's soft geometric curves carry titles, labels, tags, and buttons with quiet confidence; Nunito Sans keeps paragraph text round, warm, and effortless to read at length. Ephesis is held back entirely for the app's three moments of warmth, so its appearance always feels earned rather than decorative.

### Hierarchy
- **Display** (600, 2.375rem/38px, 1.2): page titles.
- **Headline** (600, 1.75rem/28px, 1.2): section titles ("Your week so far").
- **Title** (600, 1.375rem/22px, 1.2): card titles.
- **Body** (400, 1.0625rem/17px, 1.65): paragraph copy; line length capped near 62ch.
- **Label** (600, 0.8125rem/13px, letter-spacing 0.04em): captions, tags, eyebrows — usually set in Outfit even at caption size, not Nunito Sans.
- **Script** (400, size varies 30–64px by context: 30–48px for the wordmark, 40px for the day-of-week heading, 64px for the morning greeting): the one warm, handwritten voice in the system.

### Named Rules
**The Three-Places Rule.** Ephesis script renders in exactly three places — the wordmark, the day-of-week heading, and the morning greeting. Never a fourth; every other script-like impulse (quotes, intentions, labels) stays in Outfit or Nunito Sans.

## Layout

Mobile-first single column, capped at a 480px container centered on the page (an iPhone-width reading column even on desktop) — this is a deliberate constraint, not a missing max-width. Screens pad 22–26px on the sides; sections and cards breathe with 24–64px of vertical space, following the 4px base spacing scale (`4·8·12·16·24·32·48·64`). Add space before adding a divider or border; density reads as pressure in this system.

The signature spatial device is Today's **time-proportional vertical timeline**: block height maps directly to duration on a consistent time scale, with a fixed 44px-wide time gutter on the left. Very short blocks never drop below the 44px touch-target floor; instead they switch to a condensed one-line style that keeps title and time together.

Sheets (add/edit/rhythm) slide up from the bottom on mobile, filling the width up to the 480px cap with 28px top corners; at ≥640px they become a centered dialog with the standard 24px card radius instead. The bottom tab bar is fixed to the viewport (not the content), with rounded top corners, so it never drifts when a day's content is short (an empty weekend, a fully-rested day).

## Elevation & Depth

Hybrid model: a soft ambient **rest** shadow at all times, and a **lift** shadow that appears only as a response to state (hover, drag, the current/next block). Both are rose-tinted rather than gray, so depth reads warm instead of clinical. Nested surfaces (a block inside a card, a category chip) gain depth from blush-tint layering instead of a second shadow — shadows never stack.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(69,58,62,.04), 0 4px 16px rgba(178,95,118,.07)`): the default state of every card, block, and button.
- **Lift** (`0 2px 4px rgba(69,58,62,.05), 0 10px 28px rgba(178,95,118,.12)`): hover, drag, and the current/next timeline block — elevation is the emphasis language, not color.
- **Inner** (`inset 0 1px 3px rgba(69,58,62,.06)`): reserved for pressed/inset contexts.

### Named Rules
**The Tint-Not-Stack Rule.** Nested cards and chips gain depth from a blush background fill, never from a second layer of shadow.

## Shapes

Radii scale with element size rather than using one value everywhere: 10px for inputs and small chips, 16px for buttons and timeline blocks, 24px for cards and sheets-as-dialog, and a full pill for tags, progress tracks, and the add-something CTA. No borders are used for depth anywhere; the only strokes in the system are 1.5px hairlines (`--line`) inside tables and between list rows, and the 1.5–2px focus ring that appears on every interactive element on focus.

## Components

### Buttons
- **Shape:** 16px radius (`--r-md`) for in-context actions (sheet "Save"/"Done", header icon buttons); full pill for high-emphasis or celebratory actions (arrival CTAs, the weekend "Add something" pill, "Start session").
- **Primary:** rose fill (`#C97489`), white text, rest shadow; hover deepens to `#B25F76` with lift shadow. Never more than one primary button visible per screen.
- **Secondary:** blush fill (`#F9EDEE`), deep-rose text; hover deepens to the pressed tint (`#F3E2E4`). Sits beside primary, never competes with it.
- **Ghost:** transparent, dust-colored text; hover picks up a blush fill. Reserved for dismissals and "later" paths — skipping is always a quiet, guilt-free option, never a red or discouraged-looking one.
- **Feel:** quiet and unhurried — buttons announce themselves through elevation and color, not motion; press state is a restrained `scale(0.98)`, nothing bounces.

### Timeline Blocks (signature)
- **Tiers read visually, not just behaviorally:** flexible/protected blocks sit on white with a rest shadow; anchored blocks sit on the deeper pressed tint with no shadow (visually "locked in place"); the current/next block lifts and shifts up 1px.
- **Done state visually recedes:** background desaturates to `#F4F0EF`, text dims to `#B3A8AB` — the ring carries the celebration, not the block itself.
- **Condensed floor:** below the 44px touch-target minimum, a block collapses to a one-line title+time layout instead of shrinking further; the time scale everywhere else stays honest.
- **Drag handle:** a small pill-shaped grip at the block's bottom edge; brightens to petal tint when the block is current.

### Category Tags
- **Style:** small pill, category-specific tint pair drawn from the shared rose+cream family (e.g. Spanish `#9A7350` on `#F6E8DC`; Side project `#9E4F66` on `#F6E6EA`; Workout `#8A6F5E` on `#EDDCD3`), plus a small dot in `currentColor`.
- **State:** a done tag switches to sage (`#4C7156` on `#E4EFE6`); an anchored tag uses translucent white over the block's deep fill instead of its own bg.

### Question Notes (signature)
- **Style:** deep-blush field (`#F7E3E7`) with `#8F4F63` text, slides in from a −6px offset. This is the app's only "attention" voice — it renders for exactly two situations (the overlap nudge, the boundary-crossing confirmation) and never stacks with itself; the boundary question always takes precedence when both would fire.
- **Actions:** a filled pill button (translucent white) for the one-tap fix, plus a quieter ghost dismiss.

### Inputs / Fields
- **Style:** 1.5px `--line` stroke at rest, 16px radius, surface background.
- **Focus:** border shifts to rose plus a 4px soft rose halo (`rgba(201,116,137,.12)`) — no hard outline snap.
- **Hover:** border shifts to petal as a quiet pre-focus hint.

### Navigation (Tab Bar)
- Fixed to the viewport bottom, rounded top corners (28px), rose-tinted ambient shadow instead of a top border. Inactive tabs render in a light dust-rose (`#B8A9AD`); the active tab's icon sits inside a small blush pill and its label turns deep-rose.

### Progress Ring (signature)
- 92px ring, petal-to-rose gradient fill over a blush track, center label in Display type. Fills once with a 420ms ease-out on load/completion — additive framing only, never a countdown, never shown as a fraction of "remaining."

## Do's and Don'ts

### Do:
- **Do** derive every color, size, radius, and duration from the tokens above.
- **Do** add whitespace before reaching for a divider, and a divider before ever reaching for a border.
- **Do** give every empty state (blank weekend, fully-rested day) an inviting, additive message plus a one-tap way to add something.
- **Do** keep one primary button and one signature motion moment per screen.
- **Do** write button labels as concrete verbs and outcomes in sentence case ("Save changes", not "Submit").

### Don't:
- **Don't** use red, exclamation marks, or countdowns anywhere — the single approved exception is "Wow! What a day." on a 100%-complete evening, which fires at most once per day.
- **Don't** show negative counts ("3 missed", "2 overdue") — always reframe as progress made, never as a deficit. The vocabulary blocklist (late, missed, overdue, behind, failed, broken, only, still, remaining) is a hard design constraint, not just copy guidance.
- **Don't** stack shadows on nested surfaces — nest with a blush tint instead.
- **Don't** let apricot or deep-blush drift into decorative use; both are reserved entirely for the app's gentle-question moments.
- **Don't** render Ephesis script anywhere outside the wordmark, the day-of-week heading, and the morning greeting.
- **Don't** animate more than one orchestrated moment per screen, and always provide a `prefers-reduced-motion` fallback.
