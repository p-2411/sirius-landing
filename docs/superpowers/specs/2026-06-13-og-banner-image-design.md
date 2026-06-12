# OG / Social Banner Image — Hero Snapshot

**Date:** 2026-06-13
**Status:** Approved (brainstormed in terminal; composition picked: orb + headline)
**Scope:** Site-wide social metadata images. No per-page banners in v1.

## Why

The site emits `openGraph` and `twitter` (`summary_large_image`) metadata with
no image at all — link previews render text-only. The banner should show the
real product page: the starry sky, the dark orb, and the hero headline.

## Decision

**Static snapshot via Next.js file convention** (chosen over a dynamic
`opengraph-image.tsx` — satori cannot render the orb's canvas shader, only a
gradient approximation — and over a hybrid snapshot+overlay pipeline, which is
YAGNI until per-post banner titles are wanted).

## Design

1. **Asset:** one 1200×630 PNG — starry sky, dark orb, "It knows you. *It does
   the work.*" headline — captured from the live homepage with headless Chrome
   at 1200×687 and the top 57px (site nav header) cropped off by a second
   Chrome pass (`sips --cropOffset` shifts from center and can't reach a
   top-anchored crop here).
   Committed as `app/opengraph-image.png` and duplicated as
   `app/twitter-image.png` (the Twitter tag needs its own convention file).
2. **Alt text:** `app/opengraph-image.alt.txt` and `app/twitter-image.alt.txt`
   containing: `The Sirius orb on a night sky — It knows you. It does the work.`
3. **Wiring:** none — the file convention emits `og:image` / `twitter:image`
   (absolute URLs via the existing `metadataBase: https://sirius.so`). The
   existing text-only `openGraph`/`twitter` objects in `app/layout.tsx` merge
   with the generated image tags. All routes, including `/blog/[slug]`
   (which sets only text fields in its own `openGraph`), inherit the banner.
4. **Regeneration script:** `scripts/generate-og.sh` — captures
   `http://localhost:3000/` (requires the dev server) and writes both PNGs.
   Run manually whenever the hero changes; documented in a header comment.

## Out of scope

- Per-post blog banners (constellation plates) — future pass.
- Any runtime/dynamic image generation; new dependencies.

## Verification

`npm run build`; inspect the built HTML `<head>` of `/` and one blog post for
`og:image` and `twitter:image` tags pointing at the generated files; visually
inspect the PNG (orb centered, headline legible, no nav header visible).
