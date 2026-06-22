# Sirus — Design & Brand System

The reference implementation for this system is the landing page in `app/index.html`.
This document captures the brand, tokens, and patterns so they can be applied
consistently to the main application.

---

## 1. Brand

**Name:** Sirus (always "Sirus", not "Sirius").

**Positioning:** The business operating system. Sirus learns how a company
actually works, unifies its context into one knowledge base, and builds the
agents and automations that run the repetitive work — so every employee operates
with the full context they need.

**Product model:** a two-layer loop.
- **Information layer** — learns the business (meetings, inbox, tools) and answers questions.
- **Operation layer** — acts on that context (agents + automations).
- Each action feeds back into the information layer, sharpening the loop over time.

**Personality:** calm, precise, premium, quietly confident. The brand leans on
**movement and efficiency**, not power or flash (this is why the logo is a
*galloping* horse, not a rearing one). Restraint is the default.

**Voice & tone:**
- Plain, declarative, short. No hype, no buzzwords.
- State the benefit, then let it breathe.
- Signature two-part cadence: a firm statement, then a quieter continuation.
- Examples: *"The operating system for your business."*, *"Run your business. Faster. Cheaper"*, *"Builds a unified knowledge base of your company."*

---

## 2. Logo

The mark is a **galloping-horse silhouette** paired with the "Sirus" wordmark.
Assets live in `sirus-logo-export/` and `app/` (`sirus-mark.png`, `favicon.svg`).

**Lockups**
- **Horizontal** — mark + wordmark, side by side (used in the nav).
- **Stacked** — mark above wordmark (large/hero contexts).
- **Mark only** — favicon, avatars, anywhere ≤ ~24px.

**Wordmark type:** Inter, weight **500 only** (never bold), `font-feature-settings: 'ss01'`, `letter-spacing: -0.02em`.

**Color:** 100% achromatic.
- Black `#000000` on light surfaces.
- White `#ffffff` on dark surfaces (the shipped PNG is black; apply `filter: invert(1)` for white).
- Never add color, gradient, shadow, or glow to the logo.

**Favicon / app icon:** rounded-square tile — **white tile + black horse**
(`app/favicon.svg`). Tile corner radius ≈ 21% of the icon size. iOS
`apple-touch-icon` needs a PNG export of this tile (SVG isn't supported there).

**Rules**
- **Clear space:** padding around the mark ≈ the horse's muzzle height on all sides.
- **Container radius:** 33.76px system radius; 50% for circular avatars.
- **Minimum size:** the mark reads down to ~16px; below the lockup's legible size, use the mark alone.
- The mark is raster today; trace to a single flat SVG path for infinite scalability when needed.

---

## 3. Color

Achromatic by default. Dark is the primary surface; a single light surface is
used to invert the final call-to-action.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#000000` | Page background (primary surface) |
| `--fg` | `#ffffff` | Primary text, logo on dark |
| `--muted` | `#999999` | Secondary body text |
| `--faint` | `#777777` | Labels, eyebrows, tertiary text |
| `--faintest` | `#555555` | Deep-muted / inactive headings |
| `--line` | `#1f1f1f` | Hairline borders, dividers |
| `--line-strong` | `#333333` | Stronger dividers |
| `--track` | `#262626` | Scroll-rail track |
| `--bracket` | `#444444` | Decorative `[ ]` brackets |
| `--surface-light` | `#f2f2f2` | Inverted card (CTA block) |
| `--on-light` | `#000000` | Text on the light surface |
| `--on-light-muted` | `#666666` | Muted text on the light surface |
| `--danger` | `#ff8086` | Inline error text |

**Selection:** background `#ffffff`, text `#000000`.

**Contrast note:** `#777` and below are for small uppercase labels and decorative
text only — never for primary reading copy.

---

## 4. Typography

**Family:** Inter (Google Fonts), loaded at weights **400** and **500**.
Global: `font-feature-settings: 'ss01'`, `font-optical-sizing: auto`,
`-webkit-font-smoothing: antialiased`.

All sizes use `clamp(min, vw, max)` for fluid scaling.

| Style | Spec |
|---|---|
| **Display / H1** | Inter 400 · `clamp(40px, 6.4vw, 73px)` · line-height 1.0 · letter-spacing -0.018em |
| **Section H2** | Inter 400 · `clamp(28px, 3.6vw, 52px)` · line-height 1.08 · letter-spacing -0.015em |
| **CTA H2 (one line)** | Inter 400 · `clamp(24px, 3.6vw, 48px)` · line-height 1.0 · letter-spacing -0.018em |
| **Card H3** | Inter 400 · 18px · line-height 1.25 · letter-spacing -0.01em |
| **Body** | Inter 400 · 14px · line-height 1.85 · letter-spacing 0.019em |
| **Body small** | Inter 400 · 13px · line-height 1.75 · letter-spacing 0.015em |
| **Input** | Inter 400 · 16px · letter-spacing 0.01em |
| **Eyebrow / label** | Inter 500 · 10–11px · UPPERCASE · letter-spacing 0.19–0.22em · color `--faint` |
| **Wordmark** | Inter 500 · `ss01` · letter-spacing -0.02em |

**Signature two-tone heading:** a primary line in `--fg`, followed by an
*italic, muted* continuation (`font-style: italic; color: #777` or `#999`).
Example: **The operating system** / *for your business.*

Headings use weight **400** (light, large, tight tracking). Labels and the
wordmark use weight **500**. Bold is not used.

---

## 5. Layout & spacing

- **Container:** `max-width: 1440px`, centered, horizontal padding `clamp(28px, 5vw, 64px)`.
- **Section vertical rhythm:** bottom padding `clamp(80px, 14vh, 160px)`; hero `clamp(48px, 8vh, 96px)` top / `clamp(48px, 7vh, 88px)` bottom.
- **Label + content grid:** `grid-template-columns: minmax(0, 300px) 1fr; gap: 40px 80px` (left label column, right content). Collapses to one column below 760px.
- **Hero grid:** `minmax(0, 1fr) minmax(0, clamp(340px, 38vw, 560px))`, gap `clamp(32px, 5vw, 72px)`, `align-items: center`. Below 900px it collapses to one column and the hero visual is hidden.
- **Card grid:** `repeat(auto-fit, minmax(180px, 1fr))` with 1px gaps over a `--line` background (hairline grid effect).
- **Radius:** 32px for cards / large surfaces; 33.76px system radius for logo containers; 2–3px for focus rings and the scroll rail.
- **Dividers:** 1px solid `--line`; sections often open with a top border rather than heavy spacing.

---

## 6. Motion

Motion is subtle and purposeful. Everything must degrade under
`prefers-reduced-motion` (animations disabled, content shown statically).

- **Entrance — `rise`:** `from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none }`, `0.7s`, staggered delays (`.05s`, `.1s`, `.16s`, `.22s`) so elements cascade in.
- **Buttons:** `transition: transform .25s ease`; hover lifts `translateY(-2px)`.
- **Underline sweep:** links (`.sbtn`) reveal an underline via `transform: scaleX(0 → 1)` from the left, `.32s ease`.
- **Section emphasis:** muted headings brighten to `--fg` on activation via `transition: color .45s`.
- **Custom cursor:** a viewfinder-reticle cursor using `mix-blend-mode: difference`; breathes on a `4.5s` loop; hidden on touch / coarse pointers.
- Reserve big motion for the hero orb; everywhere else, prefer small, quiet transitions.

---

## 7. Signature patterns

- **Eyebrow label** — small uppercase tracked label above a heading (e.g. "Get started", "How it works").
- **Two-tone heading** — statement in white + italic-muted continuation.
- **Ghost text buttons** — no fill; text + arrow `→` with an underline that sweeps in on hover.
- **Inverted CTA card** — the final call-to-action sits on a light `#f2f2f2` rounded card (32px radius) inside the otherwise black page, with black text and the black logo mark inline.
- **Hairline everything** — 1px `--line` borders and grid gaps instead of boxes/shadows.
- **Mini scroll rail** — a thin fixed progress rail on the right edge (desktop only).

---

## 8. The hero orb (signature visual)

The hero centerpiece is a custom canvas visual (`app/orb.js`): a slowly rotating,
interconnected sphere of nodes. It expresses the core idea — Sirus *unifies and
sees everything*.

- ~90 surface nodes (Fibonacci-distributed + jitter so it reads organic, not rigid) plus ~15 evenly-spaced interior nodes.
- Hairline edges connect nearest neighbours; **depth-shaded** so near-side nodes are bright white and the far hemisphere dims away. **No fill, no glow.**
- Auto-rotates slowly (~45s/revolution) and **leans toward the cursor** when hovered (magnetism), easing back when the pointer leaves.
- Seeded RNG so the layout is identical on every load.
- `prefers-reduced-motion` → a single static frame; pauses when scrolled off-screen; hidden under 900px.

Principles if recreating elsewhere: achromatic, hairline, depth over decoration,
motion through pose and rotation rather than effects.

---

## 9. Accessibility

- **Focus-visible:** `outline: 2px solid currentColor; outline-offset: 3px; border-radius: 2px`. `currentColor` adapts on light vs dark sections.
- **Reduced motion:** honored globally; `rise` elements forced visible.
- **Decorative visuals:** `aria-hidden="true"`; icon-only links carry an `aria-label`.
- Keep primary copy at `--fg` / `--muted`; reserve fainter greys for non-essential labels.

---

## 10. Analytics (privacy posture)

The site is **cookieless** — no consent banner required. Two tools run together:
**Vercel Web Analytics** (counts, device, country, referrer) and **PostHog** in
cookieless mode (`persistence: 'memory'`, session recording disabled) for
pageviews, time-on-page, and scroll-depth events. Carry the same cookieless
posture into the app unless a product reason requires persistent identity.

---

## 11. Porting checklist

1. Load **Inter** (weights 400 & 500) and enable `ss01` globally.
2. Define the color tokens in §3 as CSS variables; default surface is black.
3. Drop in the logo assets (`sirus-mark.png`, `favicon.svg`); use white-on-dark / black-on-light, never colored.
4. Apply the type scale in §4, including weight-400 headings and the two-tone heading pattern.
5. Use the 1440px container, fluid `clamp()` spacing, 32px card radius, and 1px `--line` hairlines.
6. Add the entrance `rise` animation and ghost-button underline sweep; gate all motion behind `prefers-reduced-motion`.
7. Keep one light inverted surface for primary CTAs.
8. Maintain the calm, declarative voice from §1.
