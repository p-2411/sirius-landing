# Landing demo: placement, chat-triggered card, run pacing

**Date:** 2026-05-19
**Status:** Approved (pivoted from manual-run to chat-triggered expanding card)

## Problem

The landing `StartupAnalystDemo` was (1) appended as a fake 5th In Practice
vignette, (2) a janky full-viewport screen with scroll-jacking, (3) triggered by
a manual "Run Startup Analyst" button — which contradicts "the agent does
everything for you" — and (4) paced uniformly with no weight on heavy steps.

## Scope

Landing `StartupAnalystDemo` + its placement, plus backward-compatible
interactive props on `ChatPane`. The `/demo` route and `StartupAnalystAppDemo`
are untouched.

## Design

### 1. Placement — DONE

Extracted into `components/sections/live-demo.tsx` (`LiveDemoSection`), an
un-numbered "See it run" section (eyebrow, heading, intro) between In Practice
and Workflows. `app/page.tsx` rewired; `in-practice.tsx` reduced to its 4
vignettes; `StartupAnalystDemo` `index`/`total` props + counter removed.
Verified: `tsc --noEmit` and `eslint` clean.

### 2b. Final pivot — the card *is* the real /demo app

The bespoke chat/running/output card UI plus its `.sad-demo-bar` read as a
website overlay, not the product. Replaced with: the real `/demo` app
(`StartupAnalystAppDemo`) rendered **inside** the card.

- `StartupAnalystAppDemo` gained `contained?: boolean` and
  `onPhaseChange?(phase)`. `/demo` route unchanged (defaults to full-screen).
- Landing `StartupAnalystDemo` is now just the `.sad-card` window frame
  (border/shadow, reveal, no bar, no pill) wrapping
  `<StartupAnalystAppDemo files contained onPhaseChange={setPhase} />`.
- `contained` mode: `height:100%` + denser padding so the real app fits the
  card; the workflow view's `ChatPane` becomes the interactive pre-filled +
  pulsing-send entry; "Back to landing" hidden; Esc → back to chat; AGENT_TASK
  ~2× dwell applies (full /demo stays uniform).
- Expand-on-send retained: `onPhaseChange` drives `.sad-card[data-mode]`
  (chat 600px → running/output 820px) via the height transition.
- Running and results are now literally the /demo UI — consistent, edge-to-edge,
  app-native. Removed the dead command-panel/phase-rail/WorkflowShot-screenshot
  path and the `Link`/`ScaledShot`/`WorkflowShot`/`ScreenshotFrame` imports.

### 2. Chat-triggered expanding card (superseded by 2b)

- `ChatPane` gains optional, backward-compatible props: `prefill?: string`,
  `pulseSend?: boolean`, `onSend?: () => void`. Absent → renders exactly as the
  current static port (all existing static usages unaffected).
- Demo state machine: `chat` (default) → `running` → `output`, with a "run
  again" path back to `chat`.
- **`chat` (rest):** a compact card (~480px tall, in-flow in the section) framing
  an interactive `ChatPane`. Composer shows the locked, non-editable prefill
  `"Sirius, run the startup analyst workflow."` in real input-text color; the
  Send button **pulses** (reuse existing `sad-command-pulse` keyframe).
- **On Send:** append the user bubble + Sirius reply
  *"On it — running the dealflow pipeline…"*, then the card **smoothly expands
  in place** (height/scale grow + content cross-fade), the existing
  `WorkflowShot` DAG run animation plays, then it auto-opens the existing output
  workspace. Page stays anchored (no scroll). Reuses existing
  `running`/`activeIndex`/`completed`/output machinery; only the trigger and
  container transition change.
- **After completion:** "Run again" collapses back to the `chat` rest card with
  the existing "Last run: Pipeline Done…" note. The `/demo` link stays as a
  secondary affordance.
- Remove the `sad-command-panel` "Run Startup Analyst" button and
  `sad-phase-rail` (chat is the trigger). Remove the marketing left column (the
  section provides framing now).

### 3. De-jank sizing

- Drop `md:flex md:min-h-[calc(100svh-4rem)] md:items-center` and the `border-t`
  on `sad-root`.
- Remove the `scrollIntoView`-on-mode-change effect.
- Bounded, non-viewport heights: rest card ~480px; expanded shell
  `min-height: 600px; max-height: 760px`; `.sad-output` `height: 700px`;
  `.sad-expanded-frame` `min-height: 560px`. Expand/collapse animated via
  height/opacity transitions, `prefers-reduced-motion` respected.

### 4. Pause on AGENT_TASK

Per-step delay in the run loop depends on step type: base `360ms`, `~760ms`
(~2×) when `PIPELINE_STEPS[activeIndex].type === "AGENT_TASK"` (extract,
write_csv, write_profiles, generate_report). `StartupAnalystAppDemo` loop stays
uniform.

## Out of scope

`/demo` route, `StartupAnalystAppDemo`, demo internal run/output visuals & copy,
section renumbering.
