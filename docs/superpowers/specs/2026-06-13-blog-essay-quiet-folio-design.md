# Blog Essay Page Redesign — The Quiet Folio

**Date:** 2026-06-13
**Status:** Approved (brainstormed with visual companion; mockups in
`.superpowers/brainstorm/46894-1781275847/content/`)
**Scope:** `/blog/[slug]` essay pages only. The `/blog` index, routes, MDX
pipeline, and `lib/constellation.ts` are untouched.

## Why

The Star Atlas concept (2026-06-12 spec) stays, but the essay reading
experience underneath it has four readability problems:

1. **Lines too long.** 760px column at 1.02rem ≈ 95–100 characters per line;
   comfortable longform is 60–72.
2. **Body type too small.** 1.02rem reads as UI text, not an essay.
3. **Weak hierarchy.** H2 at 1.45rem barely outranks bold body text; the hero
   title (1.5–2.1rem) is small.
4. **Background too flashy.** Five layers compete with the text: full-strength
   twinkling Starfield, `AmbientLayers` at non-quiet level, two grain overlays
   (ambient + `atlas-grain`), glowing charted-sky stars — and then `prose-veil`
   tries to patch over all of it, reading as a visible panel.

Decided direction: **serif folio typography in a dark reading room.** The page
should feel like a finely set printed plate; the celestial identity lives in
the margins and the finale, never behind the text.

## 1. Hero — The Title Page

Pure typography, centered axis. No plate frame, no constellation art, no
"UNCHARTED · SCROLL TO BEGIN" line. (Plate art remains on index cards.)

Top to bottom:

- Meta line (`plate-meta` mono style, centered):
  `← ALL PLATES · PLATE 01 · JUN 12 2026 · 9 MIN · FUNDAMENTALS`
- Title: Fraunces, weight ~340, `clamp(2.2rem, 4.5vw, 2.9rem)`,
  line-height 1.06, letter-spacing −0.015em, centered, max-width ~560px.
- Lede (post description): Fraunces italic, weight ~340, ~1.125rem,
  color ink-3, centered, max-width ~470px.
- Star divider: `✦ ✦ ✦` — gold at ~0.7 opacity, letter-spaced wide, centered.
  This is the gateway between hero and prose (reused as a styled component or
  CSS class; it also appears nowhere else).

## 2. Body — Folio typography

`.prose-custom` is restyled (same class, new values):

- **Face:** Fraunces (`var(--font-display)`, already loaded) becomes the body
  face for essay prose. Weight ~370, `font-size` ~1.156rem (18.5px),
  `line-height` 1.74, color ink-2.
- **Measure:** 600px max-width column (~62ch), replacing 760px.
- **Drop cap:** first paragraph of the essay gets a Fraunces weight-300 gold
  drop cap (~3.3em float, two-line height). Implemented via a `:first-letter`
  rule scoped so it only hits the opening paragraph (e.g.
  `.prose-custom > p:first-of-type::first-letter` — verify against MDX output
  structure; if intervening elements break it, mark the first paragraph from
  the MDX component layer).
- **H2 — centered section marks:** the Greek letter moves from an inline
  prefix to a small centered mono line above the heading:
  `α · CORE` (gold, ~0.65rem, letter-spacing ~0.32em), then the heading in
  Fraunces weight 400, ~1.55rem, centered. Margin ~3em above / ~1.2em below.
  The `mdxComponents` h2 renderer changes shape accordingly (keeps `id` for
  the charted-sky observer; the mark text is the Greek letter + first
  significant word, same data as today's star labels).
- **H3:** left-aligned Fraunces italic, ~1.2rem, weight 400.
- **Blockquotes:** centered Fraunces italic ~1.1em, color ink-3, no left
  border, comfortable vertical margins.
- **Code blocks / tables:** unchanged structurally — JetBrains mono blocks and
  GFM tables keep their current (sans/mono) styling; this contrast is the
  classic serif-essay convention. Inline code keeps the gold-tinted chip.
- **Links:** keep gold underline treatment as-is.
- **Lists:** inherit the serif body; markers stay ink-4.

## 3. Background — Dark reading room

On essay pages only:

- **No `<Starfield />`** — remove it from `app/blog/[slug]/page.tsx`.
- **`<AmbientLayers quiet />`** — use the existing `quiet` prop (the page
  currently doesn't); vignette stays, nebulae recede to the quiet values.
- **One grain layer only** — remove the page-level `atlas-grain` div from the
  essay page (AmbientLayers' grain remains). Index keeps its `atlas-grain`.
- **Delete `prose-veil`** — markup and CSS. The room is dark enough without it.
- **Charted sky removed entirely** *(amended 2026-06-13, user decision after seeing
  the dark room live)*: no constellation stars or path in the essay background at
  any width. `components/blog/charted-sky.tsx` deleted. The atlas identity in the
  essay body is purely typographic: Greek section marks, the ✦ ✦ ✦ divider, and
  the finale line.

Reduced-motion handling already exists and carries over; the dark room itself
removes most motion from the page.

## 4. Finale — the one warm moment

Kept behavior, restyled to the 600px centered axis:

- The `ChartedFinale` line fading in (own IntersectionObserver) is the quiet
  closing moment; the constellation-completion warming went away with the
  charted sky (amended 2026-06-13).
- `ChartedFinale` line (`PLATE 01 CHARTED · 9 MIN`) centered.
- CTA card: centered text layout (headline, subline, download button stacked),
  same single-CTA policy, gold-tinted border/background as today.
- `NEXT PLATE →` link follows, on the same axis.

## Out of scope

- `/blog` index page (separate pass if wanted).
- `lib/blog.ts`, `lib/constellation.ts` data shapes.
- Any new dependencies or fonts (Fraunces is already loaded with full
  optical-size/weight axes).

## Verification

No test suite. Verify with `npx tsc --noEmit`, `npx eslint` on changed files,
`npm run build` (static prerender of `/blog/what-ai-actually-is`), and
screenshots at 1440px and 390px widths compared against the approved
composite mockup (`final-composite.html`).
