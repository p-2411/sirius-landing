---
name: Sirus
description: Your AI cofounder — a dark, warm-gold marketing surface that is calmly, confidently futuristic.
colors:
  near-black: "#1B1712"
  surface-warm: "#2C261D"
  surface-warm-raised: "#342D23"
  surface-deep: "#14110D"
  ink-primary: "#F6EFDF"
  ink-secondary: "#EEE8DAD6"
  ink-tertiary: "#CED0C5BD"
  ink-quaternary: "#C4C7BDA3"
  border: "#E8E0C824"
  border-strong: "#E8E0C83D"
  lamplight-gold: "#F0B35A"
  lamplight-gold-strong: "#FFD083"
  lamplight-gold-deep: "#9F6B2F"
  signal-cyan: "#6CD8FF"
  signal-cyan-soft: "#9BD6E5"
  success: "#A7DBB2"
  warning: "#F0C879"
  danger: "#F0A3A3"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.7rem, 5.8vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.03em"
    fontVariation: "opsz 144"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.02rem, 1.3vw, 1.18rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.005em"
  mono:
    fontFamily: "ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.02em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.lamplight-gold}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.full}"
    padding: "0 1.75rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.lamplight-gold-strong}"
    textColor: "{colors.near-black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.full}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-ghost-hover:
    backgroundColor: "rgba(240,179,90,0.06)"
    textColor: "{colors.ink-primary}"
  tier-featured:
    backgroundColor: "rgba(240,179,90,0.06)"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "34px 26px 30px"
---

# Design System: Sirus

## 1. Overview

**Creative North Star: "The Calm Frontier"**

Sirus is frontier AI shown unhurried. The whole surface sits on a warm near-black
(`#1B1712`) lit by a single warm gold and a single live cyan — the palette of a
powerful instrument idling in a dark room, not a launch countdown. Ambition is
real here (this is an autonomous AI cofounder), but it is carried by **craft and
restraint, not volume**: one living orb, one deliberate reveal, generous quiet
around editorial type. The feeling to produce is calm conviction — *something
powerful is already working for you* — never breathless hype.

The display voice is editorial and human (Fraunces, often italic for the
emotional beat); the body is clean and contemporary (Geist). The page reads as a
confident long-scroll argument told as a numbered narrative arc, with the product's
real surfaces (a relationship map, a jobs roster, a privacy diagram) shown as
glanceable proof — never as machinery to admire.

This system explicitly rejects the two traps its category falls into: the **busy
automation tool** (pipeline DAGs, node graphs, run logs as hero) and the **crypto /
AI hype** look (neon, synthwave gradients, edgy-dark theatrics). Futurism is
expressed through restraint and warmth, not noise.

**Key Characteristics:**
- Warm near-black canvas; one gold + one cyan do all the talking.
- Editorial serif display (Fraunces) against clean sans body (Geist).
- Flat and tonal — depth from surface tints and hairlines, not shadows.
- Motion is signature but gentle; reveals never hide content.
- Outcome over machinery; the deliverable is always the hero.

## 2. Colors

A warm, low-key palette: a near-black warm canvas, a family of warm off-white inks,
and exactly two chromatic voices — a warm gold and a live cyan — used sparingly so
each stays meaningful.

### Primary
- **Lamplight Gold** (`#F0B35A`): the single brand accent. Primary CTA fill, the
  numbered section ordinals, featured-tier framing, hover warmth, hairline glows.
  It reads as warm lamplight on near-black — premium and calm, never neon.
- **Lamplight Gold Strong** (`#FFD083`): hover/active brightening of the gold (e.g.
  primary button hover).
- **Lamplight Gold Deep** (`#9F6B2F`): muted/recessed gold for low-emphasis marks.

### Secondary
- **Signal Cyan** (`#6CD8FF`): the *living* color. Reserved for the voice orb, the
  "you" core of the relationship map, and active/"running" states. It signals
  intelligence in motion. Soft variant **Signal Cyan Soft** (`#9BD6E5`) for the
  calmer "listening" state.

### Neutral
- **Near-Black Warm** (`#1B1712`): the body canvas. Warm, not cool — the room the
  product lives in.
- **Surface Warm** (`#2C261D`) / **Surface Warm Raised** (`#342D23`): tonal layers
  for cards, pills, and raised surfaces. Depth comes from these tints, not shadow.
- **Surface Deep** (`#14110D`): recessed wells (behind the orb, inset panels).
- **Ink Primary** (`#F6EFDF`): headings and primary text — a warm off-white.
- **Ink Secondary** (`#EEE8DAD6`, 84% α): body copy and leads.
- **Ink Tertiary** (`#CED0C5BD`, 74% α): secondary/supporting text, descriptions,
  nav, footer links.
- **Ink Quaternary** (`#C4C7BDA3`, 64% α): tertiary captions, timestamps,
  strikethrough prices, meta labels.
- **Border** (`#E8E0C824`, 14% α) / **Border Strong** (`#E8E0C83D`, 24% α):
  hairline separators and outlines; warm, barely-there.

### Named Rules
**The Two-Voice Rule.** Gold and cyan are the *only* chromatic colors. Everything
else is the warm neutral ramp. If a third hue appears (outside semantic
success/warning/danger states), it is wrong.

**The Cyan-Is-Alive Rule.** Cyan is reserved for things that are *living or
working* — the orb, the "you" core, "running" states. Never use cyan as decoration;
its scarcity is what makes the orb read as alive.

**The One-Voice Rule.** The gold accent stays sparse — a CTA, an ordinal, one
framed tier. When everything is gold, nothing is. Restraint is the brand.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback) — variable optical size;
italic carries the emotional beat (e.g. the hero's gold accent line).
**Body Font:** Geist (with Inter, system-ui fallback).
**Label / Mono:** Geist for labels; system `ui-monospace` for the rare technical
meta (graph annotations).

**Character:** An editorial serif with warmth and personality (Fraunces) paired on a
clear contrast axis with a clean, contemporary sans (Geist). Serif = voice and
emotion; sans = clarity and information. Never two sans, never two serifs.

### Hierarchy
- **Display** (Fraunces 400, `clamp(1.7rem, 5.8vw, 4.5rem)`, lh 1.06, ls −0.03em):
  the hero headline. Two lines, the second often italic gold.
- **Headline** (Fraunces 400, `clamp(2rem, 4vw, 3.3rem)`, lh 1.05, ls −0.028em):
  section titles ("It's already handling these.").
- **Title** (Fraunces 400, ~15px, lh 1.25, ls −0.01em): card and roster titles.
- **Body** (Geist 400, `clamp(1.02rem, 1.3vw, 1.18rem)`, lh 1.6): leads and copy.
  Cap measure at ~44–46ch on leads.
- **Label** (Geist 500, 13px, normal tracking, **sentence case**): the section-label
  cadence — a gold Fraunces ordinal + hairline + lowercase worded label.
- **Mono** (ui-monospace, ~11px, ls 0.02em): only for in-product technical meta
  (relationship-map annotations). Never as a "developer" costume.

### Named Rules
**The Sentence-Case Label Rule.** Section labels are lowercase and untracked
("how it learns you"), paired with a gold ordinal. Tracked, uppercase kickers
("HOW IT LEARNS YOU") are forbidden — they are the AI-grammar tell this system
deliberately retired.

**The Italic-Is-Emotion Rule.** Fraunces italic is reserved for the emotional beat
(the hero's "Your cofounder already knows.", the routing "right brain"), rendered in
gold. Don't italicize for decoration.

## 4. Elevation

Flat by default. Depth is conveyed through **tonal layering** (near-black → surface
→ raised surface) and warm hairline borders — not drop shadows. The system has
essentially no resting shadows.

### Shadow Vocabulary (state-only)
- **Gold hover glow** (`box-shadow: 0 10px 30px -14px rgba(240,179,90,0.45)`):
  appears on ghost-button hover; a warm bloom, never a hard drop shadow.
- **Featured lift** (`box-shadow: 0 40px 90px -55px rgba(240,179,90,0.85)`; with
  `translateY(-12px)`): the single framed pricing tier, to set it above its
  neighbors.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Any shadow is a *response
to state or hierarchy* (hover, the one featured card) and is always a soft gold/black
bloom — never a generic gray drop shadow on a rounded rectangle.

## 5. Components

Refined and restrained: hairline borders, flat gold fills, quiet surfaces.
Confidence through restraint, not ornament.

### Buttons
- **Shape:** fully pill (`9999px`), 2.75rem tall.
- **Primary:** flat **Lamplight Gold** fill, near-black text, no glow at rest.
  Hover brightens to Gold Strong (`#FFD083`); active dims to `#E6A647`.
- **Ghost:** transparent with a strong hairline border; on hover the border warms to
  gold (55% α), a faint gold tint fills (6% α), and a soft gold bloom appears.
- **Quiet:** inline text link (Ink Secondary) that underlines in gold on hover.
- **Field:** the square-off modifier (`8px` radius, 3rem tall) for input-adjacent use.
- **Focus:** 2px gold outline at 60% α, 2px offset. Active press scales to 0.985
  (suppressed under reduced-motion).

### Section Label (signature)
The page's narrative cadence. A gold Fraunces **ordinal** (01–05) + a short
gold→transparent **hairline** + a **lowercase, untracked** worded label. Numbers run
only on the capability arc (where order carries meaning); trust/conversion sections
(pricing, CTA) carry no ordinal. This replaced the dotted uppercase eyebrow.

### Cards / Containers
- **Corner Style:** `16–20px` (`lg`+) for surfaces; `8–12px` for inner elements.
- **Background:** Surface Warm / Surface Warm Raised tints; never pure black panels.
- **Border:** warm hairline (Border / Border Strong). Full borders only — never a
  single colored side-stripe.
- **Internal Padding:** 14–34px depending on density.

### Pricing Tiers
Not a uniform card grid. The recommended tier (**Pro**) is the *only* framed card —
gold hairline border, 6%-gold tint, `translateY(-12px)` lift, soft gold bloom, and a
**gold price**. Free and Max are quiet open columns (no box) on desktop. There is no
"Most Popular" pill — the framing *is* the signpost. Tier names and labels are
lowercase.

### Jobs Roster (signature)
A faithful depiction of the real product's job list, grouped into lanes (Needs you /
Active now / Standing by). On desktop, single-line rows; at ≤560px each job reflows
into a two-tier card (name + status, full untruncated description, trigger pill) so
nothing truncates on mobile.

### Voice Orb (signature)
The living centerpiece — a breathing cyan sphere in a dark well. States: Listening
(violet→pink), Thinking (pink/magenta), Speaking (warm gold), always-on breathing;
the rail orb stays cyan (`#6CD8FF`). It is the one element allowed continuous motion.

### Navigation
Top bar: wordmark + 3 scroll links (Ink Tertiary, warming to Ink Primary on hover) +
a Download CTA. Links collapse to logo + CTA below 720px.

## 6. Do's and Don'ts

### Do:
- **Do** lead with the outcome, not the machinery — the finished deliverable and the
  time it saved. A busy founder should *feel* the value in 3 seconds.
- **Do** speak the user's language (deals, clients, "while you sleep") — never
  "workflow orchestration" or "agent steps."
- **Do** keep gold and cyan sparse and meaningful (the Two-Voice + Cyan-Is-Alive
  rules). Carry warmth through type, the orb, and copy.
- **Do** use full hairline borders, background tints, leading ordinals, or nothing to
  separate content.
- **Do** keep reveals **transform-only** (slide, never opacity-gated) so content is
  always visible — with JS off, in prerender/headless, before hydration.
- **Do** hold WCAG AA — body text ≥4.5:1; watch Ink Tertiary/Quaternary on raised
  surfaces.

### Don't:
- **Don't** look like a **busy automation tool** (Zapier / n8n): no pipeline DAGs,
  node graphs, step types, or run logs as the hero. Internals are glanceable proof at
  most, never the lede.
- **Don't** look like **crypto / AI hype**: no neon glow, synthwave gradients,
  "revolutionary," edgy-dark theatrics. Futurism comes from restraint, not noise.
- **Don't** use generic SaaS-template grammar: no gradient-blob heroes, identical
  feature-card grids, the hero-metric template, or a "Most Popular" pricing pill.
- **Don't** put a tracked uppercase eyebrow above every section. Use the lowercase
  numbered-arc label cadence instead.
- **Don't** use a colored side-stripe (`border-left > 1px`) on any card or callout.
- **Don't** use gradient text, glassmorphism-by-default, or gray drop shadows on
  rounded rectangles.
- **Don't** show *what we are* (the machinery) instead of *what it does for you*.
