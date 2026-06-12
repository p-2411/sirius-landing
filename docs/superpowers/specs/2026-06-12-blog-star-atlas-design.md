# Blog Redesign — The Sirius Star Atlas

**Date:** 2026-06-12
**Status:** Approved (brainstormed with visual companion; mockups in `.superpowers/brainstorm/52317-1781241790/content/`)

## Purpose & constraints

The blog is **SEO / top-of-funnel**: explainer essays that attract cold founder/investor
traffic from search and convert readers into downloads. Design constraints that follow:

- **Soft sell.** Posts read as genuinely useful essays. Exactly one CTA card at the end
  of each post plus the persistent header download button. No sticky/inline CTAs.
- **Volume: 10–40 posts** over ~6 months. No pagination, no tag-filter UI in v1 —
  but `tags` live in frontmatter from day one so taxonomy can be added without backfill.
- **Credibility first.** A cold reader should feel "these people think clearly" within
  seconds. The design leans on the site's existing premium identity (dark night sky,
  Fraunces serif, gold/cyan) rather than a conventional SaaS-blog shape.
- Routes stay `/blog` and `/blog/[slug]` — no URL churn.

## Concept

The blog becomes the **Sirius Star Atlas**. Every essay is a numbered **plate**
(astronomical-chart styling: hairline gold frame, engraved corner ticks, mono catalog
labels, film grain) whose constellation artwork is **generated from the essay's own
structure**. No two essays can look or animate alike, and the art is an honest
fingerprint of the content — a long explainer visibly differs from a three-section
opinion piece.

### The content → constellation mapping

| Content signal | Visual result |
|---|---|
| Each H2 section | Major gold star, labeled `α WORD` (Greek letter by order + first significant word of the heading, uppercased) |
| Each H3 | Minor star (smaller, dimmer) clustered near its parent H2's star |
| Reading order | The constellation path connecting major stars in document order |
| Section length (words) | Relative distance between consecutive stars |
| Fenced code blocks | Cyan satellite dot in slow orbit around the star of the section containing them |
| Reading time | Density of faint background stardust on the plate |
| Slug hash | Seeds all star placement (deterministic, stable across builds) |

Placement uses the seeded hash with collision avoidance so labels never overlap; the
path drifts generally left→right so the eye reads it like a line of text.

## Architecture

```
lib/blog.ts            extended: parse H2/H3 outline, per-section word counts &
                       code-block counts, computed reading time, optional tags[]
lib/constellation.ts   NEW, pure: (PostStructure, slug) → PlateModel
                       { stars[], minorStars[], path[], satellites[], dustDensity }
                       No DOM, no randomness besides the slug-seeded hash.
components/blog/
  plate.tsx            NEW: renders a PlateModel as SVG. Variants:
                       - "card"    index plates; line draws on hover
                       - "hero"    essay header; unlit (grey stars, no line)
                       - "ambient" full-scroll-height background layer
  charted-sky.tsx      NEW client component: ambient variant + IntersectionObserver
                       wiring (section ignition, line growth)
  plate-frame.tsx      NEW: the gold hairline frame + corner ticks + grain wrapper
app/blog/page.tsx      rebuilt listing
app/blog/[slug]/page.tsx rebuilt essay page
app/blog/blog.css      kept, refined (prose styles already match the theme)
```

`PlateModel` is computed at build time in server components; only `charted-sky.tsx`
(scroll ignition) and hover-draw need the client.

### lib/blog.ts additions (backward compatible)

- `PostMeta` gains: `tags?: string[]`, `readingMinutes: number`, `plateNumber: number`
  (1-based position in chronological order — oldest post is PLATE 01; numbers are
  stable as new posts are added on top).
- New `getPostStructure(content)`: markdown-level scan (headings, section word counts,
  fenced code blocks). Plain regex/line scan is sufficient — no extra dependency.

## Page designs

### `/blog` — the Atlas index (direction E1 from brainstorm)

- Eyebrow: `SIRIUS — STAR ATLAS` (cyan mono, tracked out). Fraunces headline with
  gold-italic accent (e.g. "Charts for the territory *ahead*"), one-line lead.
- **Newest post = featured plate**: large, constellation art on top, then
  `PLATE 07 · JUN 10 · 9 MIN` mono meta, Fraunces title with gold-italic accent
  phrase, standfirst description.
- Remaining posts: smaller plates, two-column grid (single column on mobile),
  title + meta only.
- Hover (pointer devices): constellation line draws itself in (~1s ease), frame
  border warms from `rgba(217,185,120,0.28)` → `0.65`.
- Film grain: one SVG-noise overlay on the page, not per plate.
- Graceful low-content state: with 1 post, only the featured plate renders.
- Site chrome: existing `SiteHeader`, starfield/ambient layers, standard footer.

### `/blog/[slug]` — the essay page (P1 hero + G1 ambient charting + P3 finale-as-background)

Top to bottom:

1. **Breadcrumb row** (mono, dim): `← ALL PLATES · PLATE 07 · JUN 10 2026 · 9 MIN`
   (+ first tag uppercased when present).
2. **Unlit hero plate**: the post's constellation rendered grey/faint
   (stars `rgba(232,228,220,0.3)`, path barely visible, labels dim), title +
   standfirst inside the frame, small `UNCHARTED` tag. This is the same PlateModel
   the index card uses — same shape, different state.
3. **Prose column**: centered, max-width ~680px, set directly on the page background
   (no Surface card). Existing `.prose-custom` styles kept; H2s gain a small gold
   mono Greek-letter prefix (`α `, `β `…) matching their stars, rendered via MDX
   component mapping (no authoring change).
4. **Ambient charting (the background effect)**: the constellation is laid into the
   starfield behind/around the prose, distributed across the full scroll height so
   each section's star sits roughly beside its section, offset into the margins
   (outside the text column where viewport allows; behind it at low opacity on
   narrow screens). An IntersectionObserver on H2 headings ignites each star
   (grey → gold glow, ~600ms) and extends the gold path line as the reader passes.
   Peripheral and silent — no counters, no UI.
5. **Finale**: when the last section is passed, the completed constellation glows
   slightly brighter and a single whispered mono line appears above the CTA:
   `★ CONSTELLATION CHARTED · 9 MIN WELL SPENT`. No card, no frame — it sits
   directly on the sky.
6. **CTA card** (the one soft-sell): Fraunces line "Reading about AI is the slow way.
   *Having one is faster.*", one sentence of product copy, gold `DOWNLOAD FOR MAC`
   button opening the existing download modal (`components/ui/download-modal.tsx`
   provider already wraps the app). Frame: gold hairline, faint gold gradient fill.
7. **NEXT PLATE →** row: next-newest post title (wraps to oldest), thin top rule.
8. Standard site footer.

### Motion & accessibility

- All animation is CSS (transitions/keyframes) driven by class/CSS-variable changes
  from the IntersectionObserver; no scroll-linked JS animation loops.
- `prefers-reduced-motion`: constellations render fully drawn and lit everywhere;
  no draw/ignite animation, no twinkle, no satellite orbits.
- Star labels are `aria-hidden` decoration; headings keep their text intact for
  screen readers and SEO. The ambient layer is `pointer-events: none`.
- Hover-draw is a pointer-only enhancement; touch devices see plates pre-drawn.

## Integration

- **Header**: "Blog" moves into `HeaderNav` items (`content/landing.ts` nav array)
  instead of the hardcoded link beside it in `site-header.tsx`. Label stays "Blog".
  Note: `HeaderNav` currently renders scroll-links to section ids only — the nav
  item model gains an optional `href` so route links and scroll links coexist
  (route links render a plain `next/link`).
- **Metadata**: listing keeps its own title/description; posts keep per-post
  OpenGraph (`type: article`). Plate-rendered OG images are future work, not v1.
- **Frontmatter contract** (unchanged + additive): `title`, `description`, `date`,
  `slug`, `author`, optional `tags: []`. Reading time and plate number are always
  computed, never authored.

## Out of scope (v1)

- Tag filtering UI, search, pagination, RSS.
- Plate-rendered OG images.
- The P2 "sky-map margin" TOC (revisit if essays regularly exceed ~12 min).

## Verification

No test runner in this repo. Per project convention:

1. `npx tsc --noEmit`
2. `npx eslint <changed files>`
3. `npm run build` — `/`, `/demo`, `/blog`, and `/blog/[slug]` (SSG) must prerender.
4. Dev-server visual pass of both pages, including reduced-motion mode and a
   narrow viewport; confirm constellation determinism across two builds.
