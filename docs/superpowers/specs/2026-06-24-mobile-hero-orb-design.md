# Mobile Hero with Orb — Design

**Date:** 2026-06-24
**Status:** Approved, pending implementation

## Problem

Most viewers are on mobile, but the hero orb (the brand's signature visual) does not
render there. It is not broken — `orb.js` works at any canvas size. It is suppressed
purely by CSS: at `≤900px` the hero collapses to one column and `.hero-visual` is set to
`display:none` (`app/index.html` media query, currently ~lines 68-71). The orb's
animation loop also self-pauses when `canvas.offsetParent === null`, so a hidden container
means no rendering at all.

## Goal

On mobile, show the orb on top and the headline/text block directly beneath it, using a
natural-flow layout (section is as tall as its content — no forced full-viewport hero).

## Layout (≤900px)

- Stop hiding `.hero-visual`; render it on mobile.
- Single-column hero where the **orb appears first** and the **text block second**, so the
  title sits directly under the orb.
- Orb gets a deliberate mobile height of ~`45svh`, clamped so it stays reasonable across
  small and large phones (e.g. `clamp(280px, 45svh, 440px)`; final values tunable during
  implementation via screenshot loop).
- Text block keeps its existing internal order: headline → sub-paragraph → "Get in touch".
- Section height = content height (natural flow; no `100svh`).

## DOM-order approach

The DOM is currently text-then-visual (`.hero-text` then `.hero-visual`). To avoid
changing the desktop markup, reorder visually within the `≤900px` media query only — make
the hero grid single-column and use `order` (grid/flex) so `.hero-visual` renders above
`.hero-text` on mobile. Desktop markup and layout are untouched.

## Performance & polish

- Trim orb node count / connection density on mobile (width check in `orb.js`) so it stays
  smooth and battery-friendly on phones. Visually near-identical.
- Keep the existing `devicePixelRatio ≤ 2` cap and the off-screen pause behavior.
- Keep `prefers-reduced-motion` handling exactly as-is.

## Out of scope (unchanged)

- Desktop hero layout and behavior.
- The side rail, copy, colors, and all other sections.

## Verification

Per the screenshot-verify loop: build + screenshot mobile viewport after each change,
compare against this spec, iterate until orb renders on top with the title beneath it and
the hero flows naturally. Note the headless-Chrome ~500px min-width clamp — use the iframe
workaround for true mobile-width shots. Confirm desktop is visually unchanged.
