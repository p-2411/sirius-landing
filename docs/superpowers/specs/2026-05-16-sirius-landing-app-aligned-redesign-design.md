# Sirius Landing — App-Aligned Redesign

**Date:** 2026-05-16
**Status:** Approved-to-build (user requested continuous execution; design captured here for reference and redirection)

## Goal

Redesign the marketing landing page so it reads as a true extension of the Sirius
desktop app. The two share fonts (Fraunces + Geist) and a warm-dark mood, but the
landing page has drifted into a visually different product. Re-align the landing
page's visual system and component vocabulary to the app's, **without changing the
content, narrative, or section order.**

The app is the source of truth. App design tokens:
`/Users/parhamsepasgozar/Documents/GitHub/sirius/app/app/globals.css`.

## The divergences (current landing → app target)

| Dimension | App (target) | Landing (current) | Action |
|---|---|---|---|
| Background | `#1B1712` flat lifted warm dark — "surfaces read as solid objects, not subtle washes" | `#110F0C` much deeper + 4-layer radial gradient + SVG noise + grid overlay + accent sweep | Lift bg to `#1B1712`; remove heavy noise/grid/sweep; keep at most one very faint warm radial |
| Surfaces | Solid `#2C261D` (surface-1) / `#342D23` (surface-2) / `#14110D` (deep) | Translucent cream washes `rgba(235,226,208,0.045/0.065)` | Replace washes with solid surface tones |
| Ink ramp | `#F6EFDF` / `.84` / `.62` / `.40` | `#EFE5D2` / `.72` / `.58` / `.38` | Adopt app ink ramp (brighter, better contrast) |
| Borders | `rgba(232,224,200,0.14)` / `0.24` | `rgba(221,229,220,0.10)` / `0.18` | Adopt app border tokens |
| **Accent hierarchy** | **Gold `#d9b978` = brand + primary action**; cyan `#9bd6e5`/`#6cd8ff` = "listening / live" state only | **Cyan = primary link/interactive**; gold demoted to "warm" accent | **Flip it.** Gold = primary CTA + brand. Cyan = live/active state only. *Single biggest coherence fix.* |
| Radii | `--radius`: 4 / 8 / 12 / 16 / full; card = 12, large panel = 16 | card = 18, panel = 22 | Tighten to app scale |
| Focus ring | Warm gold `rgba(217,185,120,0.55)`, 2px ring + 2px offset | Cyan `#9bd6e5` | Switch to app's gold focus ring |
| Elevation | Borders over shadows; deepest is modal `0 24px 64px rgba(0,0,0,0.45)` | Heavy `--shadow-panel: 0 24px 90px`, orb glows, primary glow | Reduce; surface-layering + borders |
| Section markers | Restrained eyebrow: 10.5px uppercase, tracking `0.16em`, ink-3 | Giant transparent italic Fraunces numerals (`clamp(5rem,10vw,8rem)`) — explicit "marketing flourish" the app rejected | Replace giant numerals with app eyebrow pattern; keep small index in eyebrow if useful |
| Title tokens | `--font-title` = Fraunces, `--title-weight: 400`, `--title-style: normal`, `--title-tracking: -0.005em` | Ad hoc `.font-display` + heavy use of display *italic* | Adopt app title tokens; titles upright Fraunces 400; reserve italic for the one editorial tagline only |
| Light theme | Full `[data-theme="light"]` token set exists | None | Out of scope (app default is dark). Use app's semantic token *names* so a light theme is trivial to add later |

## Approach (selected: A)

**A — Token re-skin + component-primitive port.** Chosen.
- Replace the landing's `:root` token block in `app/globals.css` with the app's
  semantic `@theme` token system (same variable names as the app), retune the
  background, calm the texture layers.
- Port the app's UI primitives (Button, Pill/status badge, Surface card, eyebrow/
  section-header pattern, line-drawn icon style, Orb glow constants) into the
  landing's `components/ui` / `components/sirius`, adapting from Next-app inline
  styles to the landing's Tailwind-v4 + `cn()` conventions.
- Retune existing section components to consume the new tokens and primitives.
  Content (`content/landing.ts`) and section order unchanged.

Rejected: **B** (value-swap only — leaves structural divergences, still off-brand);
**C** (full section rebuild — discards working spec-aligned content/animations).

## Token system (target)

Replace landing `:root` colors with the app's semantic names so components can be
ported with minimal edits. Mapping of legacy landing vars → new app vars handled by
a compatibility alias layer during migration, then removed once sections are retuned.

```
--color-bg:            #1B1712
--color-surface-1:     #2C261D
--color-surface-2:     #342D23
--color-surface-deep:  #14110D
--color-ink-1:         #F6EFDF
--color-ink-2:         rgba(238,232,218,0.84)
--color-ink-3:         rgba(206,208,197,0.62)
--color-ink-4:         rgba(196,199,189,0.40)
--color-border:        rgba(232,224,200,0.14)
--color-border-strong: rgba(232,224,200,0.24)
--color-accent:        #d9b978   /* brand + primary action */
--color-accent-strong: #f0c879
--color-accent-muted:  #8c6f3c
--color-state-listening:        #9bd6e5   /* live / active only */
--color-state-listening-strong: #6cd8ff
--color-success: #a7dbb2
--color-warning: #f0c879
--color-danger:  #f0a3a3
--radius-xs/sm/md/lg/full: 4 / 8 / 12 / 16 / 9999
--title-weight: 400; --title-style: normal; --title-tracking: -0.005em
```

Spacing: adopt the app's 4/8 scale tokens (`--spacing-*`).

Background: `var(--color-bg)` flat, plus optionally **one** faint warm radial at
low opacity (≤0.03) as the only atmosphere. Remove `body::before` noise/grid and
`body::after` accent sweep, or reduce to barely-perceptible (final call during
build, erring toward the app's restraint).

## Component primitives to port from the app

- **Button** — variants `primary` (gold bg, `--color-bg` text), `secondary`
  (`border-strong` outline), `ghost`; sizes ~h-8/h-9, radii 6/8; gold focus ring.
  Map landing's `ButtonLink` primary/secondary/quiet onto these.
- **Status pill** — `running` (cyan, pulsing dot via `sirius-pulse`), `done`
  (green), `failed` (red), `gated` (amber), `idle`. Reuse in the in-practice
  vignettes (the landing already renders workflow/operation chains).
- **Surface card** — `rounded-[var(--radius-md)]`, `border`, surface-1/2 levels,
  hover → surface-2, `transition-colors duration-150`.
- **Eyebrow / section header** — eyebrow 10.5px uppercase tracking `0.16em`
  ink-3; title Fraunces 400, tracking `-0.005em`; description ink-2, max-width
  ~720px. Replaces `section-label` + giant `section-index` numerals.
- **Icon style** — line-drawn, ~1.4px stroke, `currentColor`. Align landing's
  inline icons to this weight/feel.
- **Orb glow constants** — warm `rgba(217,185,120,0.18→0.04)`, cool
  `rgba(108,216,255,0.22→0.05)`; align the landing orb's glow to these exact
  values (the orb canvas logic itself is kept).
- **Motion** — keep durations in the app's range (≈120–300ms; modal/enter 120ms),
  `prefers-reduced-motion` respected (both already do).

## App screenshot placeholders

The current landing page has **no real product imagery** — it leans entirely on
the orb and hand-built mock cards. The redesign adds dedicated, app-styled
placeholder slots so the user can drop in real screenshots later without any
layout shift.

- **`ScreenshotFrame` component** (`components/ui/screenshot-frame.tsx`): an
  app-chrome bezel using the app tokens — `bg-[var(--color-surface-1)]`,
  `border border-[var(--color-border-strong)]`, `rounded-[var(--radius-lg)]`,
  app modal-depth shadow `0 24px 64px rgba(0,0,0,0.45)`. It **reserves a fixed
  aspect ratio** (default desktop `16:10`) so there is zero CLS whether or not
  an image is present.
- **Placeholder state** (no image yet): a centered, muted caption (e.g.
  "Workflow workspace — live DAG + chat") plus a small static orb mark and a
  faint `--color-surface-2` fill, so the section is presentable pre-asset.
- **Image state**: Next `<Image>` from `public/screenshots/`, explicit
  width/height, `priority` for the hero shot, `loading="lazy"` for below-fold.
  A `src` prop swaps placeholder → image with no structural change.
- **Asset convention** — named slots so the user knows exactly what to capture:
  - `public/screenshots/voice-orb.png` — home `/` (orb voice screen)
  - `public/screenshots/work-chat.png` — `/work` (chat + composer)
  - `public/screenshots/workflow-detail.png` — `/workflows/[name]` (two-pane
    DAG + workflow chat) — the flagship shot
  - `public/screenshots/workflows-index.png` — `/workflows` (table + pills)
- **Placement**:
  - Hero: one primary `ScreenshotFrame` (flagship `workflow-detail`) beside or
    below the orb — the hero keeps the orb as the focal element; the screenshot
    is supporting product proof.
  - In-practice: each vignette gains an optional screenshot slot behind/beside
    its existing mock card (mock remains as the no-asset fallback).
  - Four-ways or three-ideas: one supporting product shot
    (`workflows-index` or `work-chat`).
  - Final-CTA: optional; default to orb only (keep the close restrained).
- All frames carry descriptive `alt` text; placeholder caption is
  `aria-hidden` decorative with an accessible label on the frame.

## Preserve (do not change)

- All copy and the section narrative in `content/landing.ts` (verbatim).
- Section order: header → hero → in-practice → workflows → four-ways →
  three-ideas → local-data → faq → final-cta → whats-next → footer.
- The audio-reactive Orb behavior, `WaitlistForm` + `/api/waitlist` + Airtable
  backend, the Motion animation system, accessibility (ARIA, reduced-motion,
  honeypot), and the Next 16 / React 19 / Tailwind 4 stack.

## Non-goals

- No content/copy rewrite, no new sections, no removed sections.
- No real screenshots captured/committed — only the framed placeholder slots.
- No light theme (structure tokens to allow it later; do not build it).
- No analytics, A/B infra, rate limiting, CMS, or new pages.
- No backend changes.

## Affected files (anticipated)

- `app/globals.css` — token block rewrite, background/texture calming, title tokens.
- `app/layout.tsx` — only if font wiring needs token alignment (likely no change).
- `components/ui/*` — Button, new Pill/StatusBadge, Surface, SectionHeader/eyebrow
  (replacing/retiring `section-label`, `section-index` usage), focus-ring util,
  **new `screenshot-frame.tsx`**.
- `components/sections/*` — retune each section to new tokens/primitives; swap
  giant numerals → eyebrow; flip cyan→gold for primary actions/brand accents;
  cyan retained only for "live/listening/running" semantics; add
  `ScreenshotFrame` slots per the placement plan.
- `public/screenshots/` — new directory; placeholder slots documented, real
  assets dropped in later by the user.
- `components/sirius/orb.tsx` — glow color constants only.
- `components/layout/site-header.tsx`, `site-footer.tsx` — token/primitive retune.

## QA / acceptance (ui-ux-pro-max checklist)

- Text contrast ≥ 4.5:1 (body) / ≥ 3:1 (large) on the new surfaces — verify
  ink-1/2/3 on `#1B1712` and on `#2C261D`.
- Primary CTA is unmistakably gold and singular per viewport; cyan never used
  for primary actions (only live/active state).
- Touch targets ≥ 44px; focus-visible gold ring present and visible on all
  interactive elements; keyboard order matches visual order.
- `prefers-reduced-motion`: orb + reveals + pulses degrade correctly.
- No layout shift from token/radius changes; responsive at 375 / 768 / 1024 /
  1440; no horizontal scroll.
- `ScreenshotFrame` reserves its aspect ratio in both placeholder and image
  states (zero CLS); placeholder is presentable with no asset present.
- Side-by-side visual check against the running app (`/`, `/work`,
  `/workflows`) — landing should feel like the same product.
- `next build` (webpack) passes; lint clean.

## Rollout

Work on a dedicated branch in the landing repo (`redesign/app-aligned`) off the
current `Landing-Page-Assessment` branch; do not commit directly to it. PR/merge
decision deferred to the user after review.
