# Sirius landing page — bolder redesign (design spec)

**Date:** 2026-05-17
**Repo:** `sirius-landing` (Next.js 16, React 19, Tailwind v4, `motion`)
**Branch at spec time:** `Landing-Page-Assessment`

## 1. Problem

The landing page has four concrete problems:

1. **Only workflows are shown.** The hero *and* all four "In practice" vignettes render the same `WorkflowShot` DAG. Capabilities the spec promises (voice, chat, feeds, schedules) never appear as product UI. Several mock components exist in the repo but are unused.
2. **UI doesn't separate from the background.** Tokens put `surface-1 #2C261D` on `bg #1B1712` (~6% lightness apart) with `0.14`-alpha borders. Cards dissolve into the page.
3. **The page is static.** Only entrance reveals + the orb; no live product motion, flat hover/press states.
4. **Buttons look bad.** Flat solid gold rectangle / ghost outline, Unicode `↗` glyphs, no states.

## 2. Goals & non-goals

**Goal:** A bolder, cohesive whole-page redesign that fixes all four, reads as "expensive and calm," and keeps Sirius recognizable.

**Non-goals (YAGNI / out of scope):**
- No copy rewrite. All `content/landing.ts` strings are **fixed** (including the current hero headline "Your personal assistant / that doesn't forget."). This is a visual/structural redesign.
- No changes to the recreated product UI inside screenshot frames (see §9 scope boundary).
- No new bespoke product visualizations — reuse existing app-mock components.
- No user-controllable demo, no cinematic scroll-jacking, no charts/analytics, no new pages/routes.

## 3. Locked constraints

- **Typography:** Fraunces (display) + Geist (body/labels). Unchanged. No mono in UI.
- **Signature colours:** orb stays cyan; gold is reserved for marketing chrome/CTAs only; per-capability accents (cyan/green/gold) are not flattened to gold.
- **No glows.** Depth comes from value contrast, layered black shadows, borders, and a 1px crisp top edge — never luminous halos. The orb is the only light-emitting element.
- **Tailwind v4** with `@theme` CSS variables.
- **App continuity:** recreated app UI must keep matching the shipped Sirius desktop app 1:1.
- **Motion:** restrained & purposeful. No scroll-jacking.
- **Scope:** whole page, top to bottom.

## 4. Approach

**Token re-foundation + shared depth layer + one demo engine.** Rewrite the design tokens at the root so the new system cascades; upgrade the three shared primitives every section already uses; build one auto-cycling hero demo from existing mocks; re-skin every section to the new tokens with restrained reveals.

Token strategy: **remap existing token names in place** (don't rename) so most components inherit the new look automatically and churn/risk stays low. Add new tokens only where needed (`surface-3`, shadow scale, top-edge highlight).

## 5. Design foundation — new `@theme` tokens (`app/globals.css`)

Replace the colour/elevation block. Existing names are remapped to new values; new names added.

```
/* Canvas / elevation ramp — each step visibly separates (value, not light) */
--color-bg:           #0E0B08;   /* page canvas (remapped) */
--color-surface-deep: #0A0805;   /* sunken bands / wells (remapped) */
--color-surface-1:    #19140F;   /* raised card (remapped) */
--color-surface-2:    #221B14;   /* higher / hover (remapped) */
--color-surface-3:    #2B221A;   /* NEW: active / popover / inset highlight */

/* Ink — warm cream on near-black */
--color-ink-1: #F4ECDA;
--color-ink-2: rgba(244,236,218,0.74);
--color-ink-3: rgba(244,236,218,0.50);
--color-ink-4: rgba(244,236,218,0.32);

/* Borders + elevation edge (no glow) */
--color-border:        rgba(245,235,210,0.10);
--color-border-strong: rgba(245,235,210,0.16);
--color-edge-top:      rgba(255,255,255,0.07);  /* NEW: 1px top edge for lift */

/* Shadow scale — layered black, no colour */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.40);
--shadow-md: 0 4px 12px -6px rgba(0,0,0,0.50), 0 1px 2px rgba(0,0,0,0.40);
--shadow-lg: 0 18px 44px -14px rgba(0,0,0,0.70), 0 3px 10px rgba(0,0,0,0.45);
--shadow-xl: 0 34px 64px -22px rgba(0,0,0,0.85), 0 6px 16px rgba(0,0,0,0.50);

/* Accent (kept; gold = chrome/CTA only) */
--color-accent:        #d9b978;
--color-accent-strong: #f0c879;   /* hover */
--color-accent-muted:  #8c6f3c;   /* press */
--color-accent-on:     #171008;   /* text on gold */

/* Signature state / semantic colours — UNCHANGED */
--color-state-listening / -strong, --color-success/-warning/-danger, bubbles, accent-rgb…
```

Section rhythm: alternate `--color-bg` and `--color-surface-deep` bands so adjacent sections separate. The `body` radial-gradient wash is removed (it was a faint glow).

## 6. Shared component primitives

### `ButtonLink` (`components/ui/button.tsx`) — marketing chrome only
- Base: `inline-flex items-center justify-center`, `rounded-full` (full pill), Geist medium, min height 44px, 150ms transition, **kept** gold `focus-visible` ring. Flat — no gradient, no sheen, no 3D edge.
- **primary:** `bg accent` / text `accent-on`; hover `bg accent-strong`; active `bg accent-muted`. Lucide `arrow-up-right` SVG (replaces Unicode `↗`), `translate-x-0.5` on hover.
- **secondary:** `bg surface-2`, text `ink-1`, `border border-strong`; hover `bg surface-3` + border `accent`; active `bg surface-1` inset. Filled pill (no more ghost outline).
- **quiet:** text link `ink-2`→`ink-1`, animated gold underline, Lucide arrow.

### `Surface` (`components/ui/surface.tsx`)
- Levels map to `surface-1/2/3`; every surface gets `border` + `border-top: var(--color-edge-top)` + `--shadow-md`. `interactive` → hover raises one level + `-translate-y-[3px]` + `--shadow-lg`, press resets. Reduced-motion: no transform, colour change only.

### `ScreenshotFrame` (`components/ui/screenshot-frame.tsx`)
- Bezel = `surface-2` + edge + `--shadow-xl`; content sits in a `surface-deep` sunken well with an inner dark border. **Recreated app UI inside is untouched.**

## 7. Hero (`components/sections/hero.tsx`)

Composition (top→bottom): eyebrow → **mic-reactive orb** + privacy microcopy → existing Fraunces headline/subhead (copy unchanged) → flat pill primary CTA + quiet link → **auto-cycling capability demo** → existing proof-point row.

### Mic-reactive orb
Reuse `components/sirius/orb.tsx` + `orb-audio-context.tsx`.
- **App-parity pulse & colour (required):** the hero orb must pulse and drift colour like the orb in the shipped Sirius app, not sit still. Port the app Orb's exact breathing formula — a continuous wrapper-scale `scale = (1 + smoothedAmplitude·scaleAmp) · (1 + sin(t·0.9)·0.012 + sin(t·1.7+1.2)·0.006)` where `t = performance.now()·0.001`, `smoothedAmplitude` lerps the mic amplitude at `0.18`/frame, and `scaleAmp = 0.16` while listening else `0.08`. Colour drift comes from the existing landing renderer (intensity ramp + audio-centroid warm/cool bias); listening amplifies the pulse and biases cooler/cyan. This is a `pulse` capability added to the landing `Orb` component.
- Default (no mic): the breathing pulse still runs on ambient (amplitude 0) so the orb is never visually dead.
- Inline "Talk to it" affordance → `getUserMedia({audio:true})` → Web Audio `AnalyserNode`. RMS amplitude → orb scale; spectral centroid → hue **within the cyan band only**. No recording; nothing leaves the browser; microcopy states this.
- Denied / unsupported / `prefers-reduced-motion` → stay ambient (pulse frozen at `scale(1)`), prompt hidden.
- Cleanup on unmount: stop tracks, `AudioContext.close()`, cancel the pulse rAF.

### `CapabilityDemo` (new, `components/sirius/capability-demo.tsx`)
- Ordered scenes `[Voice, Chat, Feed, Schedule, Workflow]`. Each scene is a thin wrapper around an **existing** app mock (candidates: `appui/chat-pane`, `appui/recent-runs`, `appui/workflow-shot`, `sirius/research-briefing-mock`, `sirius/standup-channel-mock`, `sirius/outreach-inbox-mock`). Exact component-per-scene finalized in implementation against what each mock actually renders; constraint: existing mocks only.
- A **non-interactive** label strip (five labels, active highlighted) + progress bar keyed to active index. No click handlers — it is a position indicator, not a control (consistent with the "no user control" decision).
- Auto-advance ~5000ms, opacity crossfade. Pauses when off-screen (IntersectionObserver) and on `document.hidden`.
- `prefers-reduced-motion` → no timer; render the Workflow scene statically; labels become a static legend.

## 8. Section-by-section plan

Page order unchanged. Every section: new tokens, alternating canvas/sunken band, one restrained reveal, copy unchanged.

| Section | Change |
|---|---|
| SiteHeader | New tokens; "Join waitlist" → small quiet/secondary pill; orb mark unchanged. |
| ProgressRail | Re-tokened; active tick gold. |
| Hero | Per §7. |
| In practice | Re-map each vignette off `WorkflowShot` to its natural existing mock: Design→feedback/notice mock, Engineering→standup-channel mock, Meeting→brief mock, Research→research-briefing mock. Final mock-per-vignette validated in implementation (existing mocks only). Cards get real elevation + reveal. |
| Workflows | Quote notes become recessed surface cards on the accent rule; one `WorkflowShot` legitimately stays here. |
| Four ways | New elevation scale + rest→hover lift; per-capability accents kept (not flattened); SVG glyphs kept. |
| Three ideas | Re-tokened; stronger hierarchy via ink ramp + sunken band. |
| Local data | Trust points → separated surface cards on sunken band; diagram re-tokened. |
| FAQ | List on grounded surfaces with real borders + press states. |
| Final CTA | Strongest moment: large Fraunces + flat gold pill on deepest sunken band. |
| What's next | Re-tokened; oversized type kept; contrast fixed. |
| SiteFooter | Re-tokened; hairline borders that read. |
| SectionDivider | Replaced by band transition (canvas↔sunken edge + hairline) instead of faint line. |

## 9. Scope boundary (must not be blurred)

Two button/UI vocabularies coexist:
1. **Marketing chrome** — `ButtonLink` + section layout. Restyled here. Gold pill lives only here.
2. **Recreated product UI** — everything inside `ScreenshotFrame` (`WorkflowShot`, `chat-pane`, `status-pill`, `app-pill`, DAG, etc.). 1:1 recreations of the shipped app. **Not touched.** The pill restyle never reaches them.

Coherence is maintained by sharing the warm palette/tokens, not by unifying button shape.

## 10. Motion system

- One shared `useReveal()` hook (generalize the existing IntersectionObserver + `data-revealed` pattern in `in-practice.tsx`). Transform/opacity only.
- Timings: micro 150–200ms; section reveals ~500–600ms ease-out; list stagger 40ms; exit faster than enter.
- All motion gated by the existing global `prefers-reduced-motion` reduce block in `globals.css` (kept).

## 11. Accessibility

- Verify every new ink/surface pair: body ≥4.5:1, large ≥3:1 (ramp built to pass; verified, not assumed).
- `focus-visible` gold rings preserved on all interactive elements; pill targets ≥44px.
- Capability accent never the only signal (label + position too).
- Mic affordance is a real labelled button; demo cycling is decorative and has a static reduced-motion path.

## 12. Verification

No test framework in repo (`package.json` = next + eslint only). Verification is:
- `npm run lint` clean.
- `npm run build` succeeds (Next 16, `--webpack`).
- Manual checklist on `npm run dev`: widths 375 / 768 / 1024 / 1440; reduced-motion on; mic grant **and** deny paths; no console errors; contrast spot-check on new tokens; confirm app-mock surfaces inside frames are visually unchanged vs. current.

## 13. Files touched (anticipated)

- `app/globals.css` — token re-foundation, remove glow wash, band utilities.
- `components/ui/{button,surface,screenshot-frame,section-divider}.tsx` — primitives.
- `components/sirius/capability-demo.tsx` — **new**.
- `components/sirius/orb*.tsx` — wire mic-reactive path if not already complete.
- `components/sections/*` — re-skin + In-practice mock re-mapping.
- `components/layout/{site-header,site-footer}.tsx` — re-token.
- Possibly a new `lib/use-reveal.ts` hook.
- No `content/landing.ts` changes.
