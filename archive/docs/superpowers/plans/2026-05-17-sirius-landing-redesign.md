# Sirius Landing Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bolder whole-page redesign of the `sirius-landing` site — real depth, flat pill marketing buttons, a mic-reactive orb, and an auto-cycling multi-capability hero demo — fixing all four problems in the spec.

**Architecture:** Token re-foundation in `app/globals.css` cascades to every section (all sections consume `var(--color-*)`). Three shared primitives are rebuilt. One new `CapabilityDemo` client component auto-cycles five existing prop-less `ProductMock` surfaces. One new `useMicSignal` hook feeds the already-built mic-reactive orb. Sections are re-skinned with a shared `useReveal` hook and an alternating canvas/sunken band rhythm. Copy and recreated app UI are untouched.

**Tech Stack:** Next.js 16 (App Router, `--webpack`), React 19, Tailwind v4 (`@theme`), `motion` v12, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-17-sirius-landing-redesign-design.md`

---

## Testing note (read before starting)

This repo has **no test framework** (`package.json` scripts = `dev`, `build`, `start`, `lint` only). Spec §12 defines verification as lint + build + a manual checklist. Adding a test runner to a static marketing page is out of scope and was not requested (YAGNI). Therefore **every task's verification step is:**

```
npm run lint        # must be clean
npm run build        # must succeed (Next 16, --webpack)
```

plus, for visual tasks, a one-line manual check on `npm run dev` (stated per task). Do not scaffold Jest/Vitest/Playwright. Commit after each task passes verification.

## Branch / worktree

Execute on a dedicated branch or git worktree off `Landing-Page-Assessment` (per project convention — do not work directly on whatever branch is checked out). Create it before Task 1.

## File map

| File | Responsibility | Action |
|---|---|---|
| `app/globals.css` | Design tokens, utility classes, reveal/edge helpers | Modify |
| `components/ui/button.tsx` | Marketing `ButtonLink` (flat pill) | Rewrite |
| `components/ui/surface.tsx` | Elevation primitive | Rewrite |
| `components/ui/screenshot-frame.tsx` | Framed app-shot bezel | Modify |
| `components/ui/product-mock.tsx` | Mock surface chrome | Modify (depth only) |
| `components/ui/section-divider.tsx` | Band transition | Rewrite |
| `lib/use-reveal.ts` | Shared scroll-reveal hook | Create |
| `lib/use-mic-signal.ts` | Mic capture → OrbAudio signalRef | Create |
| `components/sirius/mic-affordance.tsx` | "Talk to it" control + privacy copy | Create |
| `components/sirius/capability-demo.tsx` | Auto-cycling 5-scene hero demo | Create |
| `components/sections/hero.tsx` | Hero composition | Rewrite |
| `components/sections/in-practice.tsx` | Vignette → natural mock remap | Modify |
| `components/sections/workflows.tsx` | Recessed quote surfaces + the one DAG | Modify |
| `components/sections/four-ways.tsx` | Elevation + hover lift | Modify |
| `components/sections/three-ideas.tsx` | Reveal + band | Modify |
| `components/sections/local-data.tsx` | Trust points as surface cards + band | Modify |
| `components/sections/faq.tsx` | Grounded rows + press state | Modify |
| `components/sections/final-cta.tsx` | Strongest moment + remove radial wash | Modify |
| `components/sections/whats-next.tsx` | Contrast + reveal | Modify |
| `components/ui/waitlist-form.tsx` | Flat pill input + button | Modify |
| `components/layout/site-header.tsx` | "Join waitlist" → secondary pill | Modify |
| `components/layout/site-footer.tsx` | Hairlines that read | Modify |
| `app/page.tsx` | Band alternation order | Modify |

Scene mapping (locked — all components already exist, prop-less, `ProductMock`-wrapped; no new product UI):

- **Hero `CapabilityDemo` cycle:** Voice→`VoiceMock`, Chat→`ChatMock`, Feed→`OutreachInboxMock`, Schedule→`SchedulesMock`, Workflow→`WorkflowDagMock`.
- **In-practice vignettes:** design→`DesignTreeMock`, engineering→`StandupChannelMock`, meeting→`NoticeCardMock`, research→`ResearchBriefingMock`.
- **Workflows section:** the full app-accurate `WorkflowShot` (via `ScreenshotFrame`+`ScaledShot`) moves here — the one honest place for the DAG.

---

## Task 1: Token re-foundation in `globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace the `@theme` colour/elevation block**

In `app/globals.css`, replace the colour tokens (current lines ~15–45, from `--color-bg:` through `--color-bubble-assistant:`) with:

```css
  /* Canvas / elevation ramp — each step visibly separates (value, not light) */
  --color-bg: #0E0B08;
  --color-surface-deep: #0A0805;
  --color-surface-1: #19140F;
  --color-surface-2: #221B14;
  --color-surface-3: #2B221A;

  --color-ink-1: #F4ECDA;
  --color-ink-2: rgba(244, 236, 218, 0.74);
  --color-ink-3: rgba(244, 236, 218, 0.50);
  --color-ink-4: rgba(244, 236, 218, 0.32);

  --color-border: rgba(245, 235, 210, 0.10);
  --color-border-strong: rgba(245, 235, 210, 0.16);
  --color-edge-top: rgba(255, 255, 255, 0.07);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.40);
  --shadow-md: 0 4px 12px -6px rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.40);
  --shadow-lg: 0 18px 44px -14px rgba(0, 0, 0, 0.70), 0 3px 10px rgba(0, 0, 0, 0.45);
  --shadow-xl: 0 34px 64px -22px rgba(0, 0, 0, 0.85), 0 6px 16px rgba(0, 0, 0, 0.50);

  --color-accent: #d9b978;
  --color-accent-strong: #f0c879;
  --color-accent-muted: #8c6f3c;
  --color-accent-on: #171008;
  --color-accent-rgb: 217, 185, 120;
  --color-accent-strong-rgb: 240, 200, 121;

  --color-state-listening: #9bd6e5;
  --color-state-listening-strong: #6cd8ff;
  --color-state-listening-rgb: 155, 214, 229;
  --color-state-listening-strong-rgb: 108, 216, 255;

  --color-success: #a7dbb2;
  --color-warning: #f0c879;
  --color-danger: #f0a3a3;

  --color-bubble-user: #2B221A;
  --color-bubble-assistant: #19140F;
```

Keep the `--font-*`, `--spacing-*`, and `--radius-*` blocks above unchanged.

- [ ] **Step 2: Remove the body radial-gradient wash**

Replace the `body { ... }` rule's `background` declaration (currently a `radial-gradient(...)` over `var(--color-bg)`) with a flat canvas:

```css
body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-ink-1);
  font-family: var(--font-body);
  font-weight: 400;
  letter-spacing: -0.005em;
  font-feature-settings: "ss01", "cv11";
}
```

- [ ] **Step 3: Update the depth utility classes**

Replace the `.band-deep`, `.panel-recessed`, and `.surface-line` rules with:

```css
.band-deep {
  position: relative;
  background: var(--color-surface-deep);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.band-sunken {
  position: relative;
  background: var(--color-surface-deep);
}

.panel-recessed {
  background: var(--color-surface-deep);
  border: 1px solid var(--color-border-strong);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.5);
}

.surface-line {
  background: linear-gradient(90deg, transparent, var(--color-border-strong), transparent);
}

.elevated {
  border: 1px solid var(--color-border);
  border-top-color: var(--color-edge-top);
  box-shadow: var(--shadow-md);
}
```

- [ ] **Step 4: Add the reveal utility (consumed by Task 6)**

Append to `app/globals.css`:

```css
.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal[data-revealed="true"] {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
}
```

- [ ] **Step 5: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: `npm run dev`, load `/`, confirm the page is now near-black with visibly separated cards/sections and no glow wash behind the hero.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat(landing): depth token re-foundation — near-black canvas, elevation ramp, no glow"
```

---

## Task 2: Rebuild `ButtonLink` as a flat pill

**Files:**
- Rewrite: `components/ui/button.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
};

const base =
  "group inline-flex items-center justify-center gap-2 font-medium tracking-[0.01em] " +
  "transition-colors duration-150 outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[var(--color-bg)]";

const variantClasses = {
  primary:
    "min-h-11 px-7 rounded-full text-sm bg-[var(--color-accent)] text-[var(--color-accent-on)] " +
    "hover:bg-[var(--color-accent-strong)] active:bg-[var(--color-accent-muted)]",
  secondary:
    "min-h-11 px-6 rounded-full text-sm bg-[var(--color-surface-2)] text-[var(--color-ink-1)] " +
    "border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] " +
    "hover:border-[var(--color-accent)] active:bg-[var(--color-surface-1)]",
  quiet:
    "px-0 text-[var(--color-ink-2)] hover:text-[var(--color-ink-1)]",
};

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ButtonLink({ children, href, variant = "primary" }: ButtonLinkProps) {
  if (variant === "quiet") {
    return (
      <Link href={href} className={cn(base, variantClasses.quiet)}>
        <span className="underline-offset-4 group-hover:underline decoration-[rgba(217,185,120,0.6)]">
          {children}
        </span>
        <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(base, variantClasses[variant])}>
      {children}
      {variant === "primary" && (
        <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
```

Note: `hero.tsx` currently passes its own `<span>…↗</span>` as primary children — Task 9 removes that so the icon is not duplicated.

- [ ] **Step 2: Verify**

```
npm run lint
npm run build
```
Expected: both succeed (other call sites still type-check — props unchanged).

- [ ] **Step 3: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat(landing): flat pill ButtonLink with SVG arrow and real states"
```

---

## Task 3: Rebuild the `Surface` primitive

**Files:**
- Rewrite: `components/ui/surface.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = {
  children: ReactNode;
  level?: 1 | 2 | 3;
  interactive?: boolean;
  className?: string;
};

const levelBg: Record<1 | 2 | 3, string> = {
  1: "bg-[var(--color-surface-1)]",
  2: "bg-[var(--color-surface-2)]",
  3: "bg-[var(--color-surface-3)]",
};

export function Surface({ children, level = 1, interactive = false, className }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "border-t-[var(--color-edge-top)] shadow-[var(--shadow-md)]",
        "transition-[transform,background-color,border-color,box-shadow] duration-200",
        levelBg[level],
        interactive &&
          "hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)] " +
            "hover:shadow-[var(--shadow-lg)] motion-safe:hover:-translate-y-[3px] " +
            "active:translate-y-0 active:shadow-[var(--shadow-md)] cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: `npm run dev`, hover a Four-ways card — it lifts and the shadow deepens; reduced-motion → colour/shadow change only, no transform.

- [ ] **Step 3: Commit**

```bash
git add components/ui/surface.tsx
git commit -m "feat(landing): Surface elevation levels + interactive lift"
```

---

## Task 4: Depth pass on `ScreenshotFrame` and `ProductMock`

**Files:**
- Modify: `components/ui/screenshot-frame.tsx`
- Modify: `components/ui/product-mock.tsx`

- [ ] **Step 1: Heavier grounded bezel on `ScreenshotFrame`**

In `screenshot-frame.tsx`, replace the `<figure>` `className` (the `cn(...)` first argument string) with:

```
"relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] border-t-[var(--color-edge-top)] bg-[var(--color-surface-2)] p-2 shadow-[var(--shadow-xl)]"
```

Then wrap the existing `children`/`src`/placeholder branch so the inner content sits in a sunken well: change the `children ?` branch's wrapper `div` className from `"absolute inset-0 overflow-hidden bg-[var(--color-bg)]"` to:

```
"absolute inset-2 overflow-hidden rounded-[var(--radius-md)] border border-black/50 bg-[var(--color-surface-deep)]"
```

Leave the `<Image>` and placeholder branches' inner classes as-is (the recreated app UI inside is unchanged). Adjust the placeholder branch wrapper `"absolute inset-0 ..."` to `"absolute inset-2 rounded-[var(--radius-md)] ..."` to match the well.

- [ ] **Step 2: Match `ProductMock` frame to the new depth scale**

In `product-mock.tsx`, in the `<figure>` `cn(...)`, replace `"bg-[var(--color-surface-deep)] shadow-[0 24px 64px rgba(0,0,0,0.45)]"` with:

```
"bg-[var(--color-surface-deep)] border-t-[var(--color-edge-top)] shadow-[var(--shadow-lg)]"
```

(The `border border-[var(--color-border)]` already present stays.)

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: `npm run dev`, confirm framed shots now read as a weighted bezel with the app UI in a recessed well; the app UI pixels inside are visually identical to before.

- [ ] **Step 4: Commit**

```bash
git add components/ui/screenshot-frame.tsx components/ui/product-mock.tsx
git commit -m "feat(landing): grounded bezel + sunken well on frames"
```

---

## Task 5: Band-aware `SectionDivider` + page band order

**Files:**
- Rewrite: `components/ui/section-divider.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `section-divider.tsx`**

```tsx
export function SectionDivider() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="h-px w-full bg-[var(--color-border)]"
    />
  );
}
```

(Kept as a hairline; section background contrast — not the divider — now does the separating.)

- [ ] **Step 2: Add explicit band classes in `page.tsx`**

Section background separation is driven by each section's own wrapper (Tasks 9–15 set them). In `app/page.tsx`, no structural change is required, but add a comment above `<HeroSection />` documenting the intended rhythm so later tasks stay consistent:

```tsx
{/* Band rhythm: hero=canvas, in-practice=sunken, workflows=canvas,
    four-ways=sunken, three-ideas=canvas, local-data=sunken,
    faq=canvas, final-cta=deepest sunken, whats-next=canvas */}
```

Place it immediately inside `<main ...>` before `<SiteHeader />`.

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add components/ui/section-divider.tsx app/page.tsx
git commit -m "feat(landing): hairline divider; document band rhythm"
```

---

## Task 6: Shared `useReveal` hook + adopt in In-practice

**Files:**
- Create: `lib/use-reveal.ts`
- Modify: `components/sections/in-practice.tsx`

- [ ] **Step 1: Create `lib/use-reveal.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll. Returns a ref to attach to an element that also carries
 * the `.reveal` class; sets data-revealed="true" once when it enters view.
 * Honors reduced-motion via the CSS rule in globals.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= threshold) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [threshold, Math.min(1, threshold + 0.2)] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, revealed } as const;
}
```

- [ ] **Step 2: Refactor In-practice to use it (no behavior change)**

In `components/sections/in-practice.tsx`, replace the per-card `useRef`/`useState`/`useEffect` IntersectionObserver block inside `PracticeCard` with:

```tsx
const { ref, revealed } = useReveal<HTMLElement>(0.3);
```

Remove the now-unused `useEffect`, `useRef`, `useState` imports if nothing else uses them (the file still imports them for nothing else after this — verify and trim). Add at top:

```tsx
import { useReveal } from "@/lib/use-reveal";
```

Keep `ref` on the `<article ref={ref} ...>` and `data-revealed={revealed ? "true" : "false"}` exactly as before.

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: In-practice cards still reveal on scroll identically.

- [ ] **Step 4: Commit**

```bash
git add lib/use-reveal.ts components/sections/in-practice.tsx
git commit -m "feat(landing): shared useReveal hook; adopt in In-practice"
```

---

## Task 7: Mic capture — `useMicSignal` hook + `MicAffordance`

The orb already consumes `useOrbAudio().signalRef` (`{amplitude, centroid, active}`) and modulates size/colour. This task only adds capture.

**Files:**
- Create: `lib/use-mic-signal.ts`
- Create: `components/sirius/mic-affordance.tsx`

- [ ] **Step 1: Create `lib/use-mic-signal.ts`**

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOrbAudio } from "@/components/sirius/orb-audio-context";

type MicState = "idle" | "listening" | "denied" | "unsupported";

/**
 * Captures the mic on demand and writes amplitude + spectral centroid into the
 * shared OrbAudio signalRef. Nothing is recorded or transmitted. Fully cleaned
 * up on stop/unmount.
 */
export function useMicSignal() {
  const { signalRef } = useOrbAudio();
  const [state, setState] = useState<MicState>("idle");

  const mediaRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    mediaRef.current?.getTracks().forEach((t) => t.stop());
    mediaRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    signalRef.current = { amplitude: 0, centroid: 0.5, active: false };
    setState((s) => (s === "denied" || s === "unsupported" ? s : "idle"));
  }, [signalRef]);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      const time = new Uint8Array(analyser.fftSize);
      const freq = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(time);
        analyser.getByteFrequencyData(freq);

        let sumSq = 0;
        for (let i = 0; i < time.length; i++) {
          const v = (time[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / time.length);
        const amplitude = Math.min(1, rms * 3.2);

        let num = 0;
        let den = 0;
        for (let i = 0; i < freq.length; i++) {
          num += i * freq[i];
          den += freq[i];
        }
        const centroidRaw = den > 0 ? num / den / freq.length : 0.5;
        const centroid = Math.max(0, Math.min(1, centroidRaw * 2.2));

        signalRef.current = { amplitude, centroid, active: true };
        rafRef.current = requestAnimationFrame(tick);
      };

      setState("listening");
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      mediaRef.current?.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
      setState("denied");
    }
  }, [signalRef]);

  useEffect(() => () => stop(), [stop]);

  return { state, start, stop } as const;
}
```

- [ ] **Step 2: Create `components/sirius/mic-affordance.tsx`**

```tsx
"use client";

import { useReducedMotion } from "motion/react";

import { useMicSignal } from "@/lib/use-mic-signal";

export function MicAffordance() {
  const reduce = useReducedMotion();
  const { state, start, stop } = useMicSignal();

  // Reduced-motion: orb stays ambient and ignores audio anyway; offer nothing.
  if (reduce) return null;

  const listening = state === "listening";
  const disabled = state === "unsupported";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={listening ? stop : start}
        disabled={disabled}
        aria-pressed={listening}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-5 text-[13px] font-medium text-[var(--color-ink-1)] transition-colors duration-150 hover:bg-[var(--color-surface-3)] hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{
            background: listening
              ? "var(--color-state-listening-strong)"
              : "var(--color-ink-3)",
          }}
        />
        {listening ? "Listening — tap to stop" : disabled ? "Mic unavailable" : "Talk to it"}
      </button>
      <p className="text-[11px] leading-[1.5] text-[var(--color-ink-3)]">
        {state === "denied"
          ? "Mic blocked — the orb stays ambient."
          : "Your voice stays in your browser. We're not listening."}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. (Wired into the hero in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add lib/use-mic-signal.ts components/sirius/mic-affordance.tsx
git commit -m "feat(landing): mic capture hook + Talk-to-it affordance feeding the orb"
```

---

## Task 8: `CapabilityDemo` auto-cycling component

**Files:**
- Create: `components/sirius/capability-demo.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { VoiceMock, ChatMock, SchedulesMock } from "@/components/sirius/four-ways-mocks";
import { OutreachInboxMock } from "@/components/sirius/outreach-inbox-mock";
import { WorkflowDagMock } from "@/components/sirius/workflow-dag-mock";

type Scene = { id: string; label: string; render: () => React.ReactNode };

const SCENES: Scene[] = [
  { id: "voice", label: "Voice", render: () => <VoiceMock /> },
  { id: "chat", label: "Chat", render: () => <ChatMock /> },
  { id: "feed", label: "Feed", render: () => <OutreachInboxMock /> },
  { id: "schedule", label: "Schedule", render: () => <SchedulesMock /> },
  { id: "workflow", label: "Workflow", render: () => <WorkflowDagMock /> },
];

const INTERVAL = 5000;
const WORKFLOW_INDEX = SCENES.length - 1;

export function CapabilityDemo() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? WORKFLOW_INDEX : 0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const onScreen = useRef(true);

  useEffect(() => {
    if (reduce) return; // static Workflow scene, no timer
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen.current = e.isIntersecting;
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    const timer = window.setInterval(() => {
      if (!onScreen.current || document.hidden) return;
      setActive((i) => (i + 1) % SCENES.length);
    }, INTERVAL);

    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [reduce]);

  return (
    <div ref={wrapRef} className="mx-auto w-full max-w-3xl">
      {/* Non-interactive position indicator (no user control by design) */}
      <div
        aria-hidden="true"
        className="flex justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
      >
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            className="px-3 pb-2 transition-colors duration-200"
            style={{
              color:
                i === active ? "var(--color-state-listening-strong)" : "var(--color-ink-4)",
              borderBottom:
                i === active
                  ? "2px solid var(--color-state-listening-strong)"
                  : "2px solid transparent",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>
      <div className="h-px w-full bg-[var(--color-border)]">
        <div
          className="h-px bg-[var(--color-state-listening-strong)] transition-[width] duration-300"
          style={{ width: `${((active + 1) / SCENES.length) * 100}%` }}
        />
      </div>

      <div className="relative mt-5">
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== active}
            className="transition-opacity duration-500 motion-reduce:transition-none"
            style={
              i === active
                ? { opacity: 1 }
                : { opacity: 0, position: "absolute", inset: 0, pointerEvents: "none" }
            }
          >
            {s.render()}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. (Mounted in Task 9.)

- [ ] **Step 3: Commit**

```bash
git add components/sirius/capability-demo.tsx
git commit -m "feat(landing): auto-cycling CapabilityDemo across five existing mocks"
```

---

## Task 9: App-matching orb pulse + rebuild the Hero

**Files:**
- Modify: `components/sirius/orb.tsx`
- Rewrite: `components/sections/hero.tsx`

- [ ] **Step 1: Add the app-parity breathing pulse to the `Orb` component**

In `components/sirius/orb.tsx`, replace the entire `export function Orb(...) { ... }` function (from `export function Orb({` through its closing `}` right before `class SiriusOrbRenderer`) with:

```tsx
export function Orb({
  className,
  staticRender = false,
  glowless = false,
  tripartite = false,
  interactive = false,
  pulse = false,
}: {
  className?: string;
  staticRender?: boolean;
  glowless?: boolean;
  tripartite?: boolean;
  interactive?: boolean;
  pulse?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { signalRef } = useOrbAudio();
  const frozen = staticRender || !!shouldReduceMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const orb = new SiriusOrbRenderer(canvas, {
      mouseEnabled: !frozen && interactive,
      flowSpeed: frozen ? 0 : 1,
      yawSpeed: frozen ? 0 : 0.13,
      breatheAmp: frozen ? 0 : 0.012,
      audioRef: frozen ? null : signalRef,
      tripartite,
    });

    if (frozen) {
      orb.stop();
      orb.renderStatic();
    }

    return () => orb.destroy();
  }, [frozen, signalRef, tripartite, interactive]);

  // App-parity breathing pulse: continuous multi-sine wrapper scale plus a
  // stronger swell while the mic is listening. Ported verbatim from the
  // shipped Sirius app Orb so the landing mark reads as the same animal.
  useEffect(() => {
    if (!pulse || frozen) {
      const node = wrapperRef.current;
      if (node) node.style.transform = "scale(1)";
      return;
    }
    let smooth = 0;
    let raf = 0;
    const tick = () => {
      const sig = signalRef.current;
      const target = Math.max(0, Math.min(1, sig.active ? sig.amplitude : 0));
      smooth += (target - smooth) * 0.18;
      const node = wrapperRef.current;
      if (node) {
        const t = performance.now() * 0.001;
        const breath =
          1 + Math.sin(t * 0.9) * 0.012 + Math.sin(t * 1.7 + 1.2) * 0.006;
        const scaleAmp = sig.active ? 0.16 : 0.08;
        const dynamic = 1 + smooth * scaleAmp;
        node.style.transform = `scale(${(dynamic * breath).toFixed(4)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pulse, frozen, signalRef]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "pointer-events-none relative h-[clamp(280px,70vw,360px)] w-[clamp(280px,70vw,360px)] will-change-transform",
        className,
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} width={320} height={320} className="absolute inset-0 z-10 block h-full w-full blur-[0.45px]" />
    </div>
  );
}
```

(`glowless` stays in the signature unused, exactly as before, so existing callers that pass it still type-check. The renderer class and all helpers below are unchanged.)

- [ ] **Step 2: Commit the orb change**

```bash
git add components/sirius/orb.tsx
git commit -m "feat(landing): app-parity breathing pulse on the hero orb"
```

- [ ] **Step 3: Replace the hero file**

Keeps all copy via `landingContent.hero`. Removes the old single `WorkflowShot`/`ScreenshotFrame` block (its job moves to `CapabilityDemo` + the Workflows section). Adds `MicAffordance` under the orb and `CapabilityDemo` below the CTAs. Primary CTA no longer passes a manual arrow span (the button renders its own).

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { MicAffordance } from "@/components/sirius/mic-affordance";
import { CapabilityDemo } from "@/components/sirius/capability-demo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";

const orbVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
};
const line1Variants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const line2Variants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] } },
};
const subheadVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.28, ease: "easeOut" } },
};
const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.36, ease: "easeOut" } },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { title, description, primaryCta, proofPoints } = landingContent.hero;

  const motionState = shouldReduceMotion
    ? { initial: undefined as undefined, animate: undefined as undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 bg-[var(--color-bg)] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24"
    >
      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <SectionLabel>Personal assistant in private beta</SectionLabel>

          <motion.div
            initial={motionState.initial}
            animate={motionState.animate}
            variants={orbVariants}
            className="relative mt-8"
            style={{ width: "clamp(220px, 24vw, 320px)", height: "clamp(220px, 24vw, 320px)" }}
          >
            <Orb className="!h-full !w-full" interactive pulse />
          </motion.div>

          <div className="mt-5">
            <MicAffordance />
          </div>

          <h1
            className="font-display text-balance mt-10 font-normal text-[var(--color-ink-1)]"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: "0.9", letterSpacing: "-0.03em" }}
          >
            <motion.span className="block" initial={motionState.initial} animate={motionState.animate} variants={line1Variants}>
              {title}
            </motion.span>
            <motion.span
              className="block"
              initial={motionState.initial}
              animate={motionState.animate}
              variants={line2Variants}
              style={{ color: "var(--color-accent)" }}
            >
              <em className="font-display-italic not-italic">that doesn&apos;t forget.</em>
            </motion.span>
          </h1>

          <motion.p
            className="mx-auto mt-8 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[var(--color-ink-2)]"
            initial={motionState.initial}
            animate={motionState.animate}
            variants={subheadVariants}
          >
            {description}
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-5"
            initial={motionState.initial}
            animate={motionState.animate}
            variants={ctaVariants}
          >
            <ButtonLink href="#cta" variant="primary">
              {primaryCta}
            </ButtonLink>
            <ButtonLink href="#in-practice" variant="quiet">
              how it works
            </ButtonLink>
          </motion.div>

          <div className="mt-16 w-full">
            <CapabilityDemo />
          </div>

          <dl className="mx-auto mt-16 grid max-w-[760px] gap-5 border-y border-[var(--color-border)] py-8 text-left sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.title}>
                <dt className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
                  {point.title}
                </dt>
                <dd className="mt-2 text-[14px] leading-[1.55] text-[var(--color-ink-2)]">
                  {point.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: `npm run dev` →
- orb renders and is **visibly breathing/pulsing at rest** (the multi-sine swell, like the app orb) with colour drifting through the cyan family — never static.
- "Talk to it" present; granting mic makes the orb pulse **harder** and shift cooler/react to voice; denying shows the blocked copy and the orb stays on the ambient breathing pulse.
- CapabilityDemo cycles Voice→Chat→Feed→Schedule→Workflow ~every 5s; progress bar advances; scrolling it off-screen pauses it.
- reduced-motion (OS setting): no "Talk to it", orb pulse frozen at scale(1) (renderer also frozen), demo shows Workflow statically.
- copy is unchanged from before.

- [ ] **Step 5: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat(landing): rebuilt hero — pulsing interactive orb + auto-cycling demo"
```

---

## Task 10: In-practice — remap vignettes to natural mocks

**Files:**
- Modify: `components/sections/in-practice.tsx`

- [ ] **Step 1: Swap imports**

Remove the appui screenshot imports:
```tsx
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
import { WorkflowShot, ScaledShot } from "@/components/sirius/appui";
import type { WorkflowShotProps } from "@/components/sirius/appui";
```
Add:
```tsx
import { DesignTreeMock } from "@/components/sirius/design-tree-mock";
import { StandupChannelMock } from "@/components/sirius/standup-channel-mock";
import { NoticeCardMock } from "@/components/sirius/notice-card-mock";
import { ResearchBriefingMock } from "@/components/sirius/research-briefing-mock";
```

- [ ] **Step 2: Delete `SCREENSHOT_META` and `SHOT_BY_ID`**

Delete the entire `SCREENSHOT_META` constant and the entire `SHOT_BY_ID` constant (the large `Record<string, WorkflowShotProps>` block). Add:

```tsx
const MOCK_BY_ID: Record<string, () => React.ReactNode> = {
  design: () => <DesignTreeMock />,
  engineering: () => <StandupChannelMock />,
  meeting: () => <NoticeCardMock />,
  research: () => <ResearchBriefingMock />,
};
```

- [ ] **Step 3: Replace the artifact column's screenshot block**

In `PracticeCard`, replace this block:

```tsx
{screenshot && (
  <ScreenshotFrame
    alt={screenshot.alt}
    caption={screenshot.caption}
    className="mb-6"
  >
    {SHOT_BY_ID[card.id] && (
      <ScaledShot width={1360} height={850}>
        <WorkflowShot {...SHOT_BY_ID[card.id]} />
      </ScaledShot>
    )}
  </ScreenshotFrame>
)}
```

with:

```tsx
<div className="mb-6">{MOCK_BY_ID[card.id]?.()}</div>
```

Remove the now-unused `const screenshot = SCREENSHOT_META[card.id];` line.

- [ ] **Step 4: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: each of the four In-practice vignettes now shows a *different* product surface (design triage / standup / notice card / research briefing) — none is the workflow DAG; reveal + verbs animation still work; copy unchanged.

- [ ] **Step 5: Commit**

```bash
git add components/sections/in-practice.tsx
git commit -m "feat(landing): In-practice vignettes use natural per-domain mocks, not the DAG"
```

---

## Task 11: Workflows section — recessed quotes + the one DAG

**Files:**
- Modify: `components/sections/workflows.tsx`

- [ ] **Step 1: Add the imports**

```tsx
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
import { WorkflowShot, ScaledShot } from "@/components/sirius/appui";
```

- [ ] **Step 2: Add the section band**

Change the `<section>` className from `"relative scroll-mt-24 py-24 md:py-36"` to `"relative scroll-mt-24 bg-[var(--color-bg)] py-24 md:py-36"`.

- [ ] **Step 3: Ground the quote figures**

Replace each of the two `<figure className="relative border-l-2 border-[rgba(var(--color-accent-rgb),0.55)] pl-6 md:pl-8">` with:

```tsx
<figure className="relative rounded-[var(--radius-md)] border border-[var(--color-border)] border-t-[var(--color-edge-top)] bg-[var(--color-surface-1)] p-6 shadow-[var(--shadow-md)] md:p-7">
  <span aria-hidden="true" className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-[rgba(var(--color-accent-rgb),0.55)]" />
```

Keep the inner `<blockquote>` exactly as-is. Add the matching extra closing for the wrapper is not needed (only the className changed and one decorative `<span>` added before `<blockquote>`); ensure each `<figure>` still closes with `</figure>`.

- [ ] **Step 4: Add the canonical DAG below the two notes**

Immediately after the closing `</div>` of the right-column `flex flex-col gap-20` block (still inside the grid's right column, after the second `</figure>`), add:

```tsx
<ScreenshotFrame
  alt="Sirius workflow workspace — live DAG on the left, workflow chat on the right"
  caption="Workflow workspace — live DAG + chat"
  className="mt-4"
>
  <ScaledShot width={1360} height={850}>
    <WorkflowShot
      breadcrumb="Weekly client update"
      title="Weekly client update"
      tone="awaiting"
      statusLabel="Awaiting input"
      trigger="Manual trigger"
      runsMeta="12 runs · last 2h ago"
      railActive="flows"
      steps={[
        { id: "read", type: "GMAIL", title: "Pull this week’s thread", col: 0, next: ["draft"], state: "done" },
        { id: "draft", type: "LLM", title: "Draft the update", col: 1, next: ["review"], state: "done" },
        { id: "review", type: "APPROVAL", title: "Confirm the figure", col: 2, next: ["send"], state: "gated" },
        { id: "send", type: "SEND EMAIL", title: "Send to the client", col: 3, next: [], state: "idle" },
      ]}
      chatHeader="Chat with this workflow"
      messages={[
        { role: "user", text: "Sirius, where’s the client update?" },
        { role: "assistant", text: "Drafted from this week’s thread in your usual format. I flagged one revenue figure that changed — confirm it and I’ll send." },
      ]}
      recentRuns={[
        { tone: "done", label: "Done", when: "2h ago", dur: "1m 04s" },
        { tone: "done", label: "Done", when: "1d ago", dur: "58s" },
        { tone: "failed", label: "Failed", when: "3d ago", dur: "12s" },
      ]}
    />
  </ScaledShot>
</ScreenshotFrame>
```

(These are the exact props the hero used before this redesign — the DAG content is preserved, just relocated to where it belongs.)

- [ ] **Step 5: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: quotes are now grounded cards; the DAG appears once, here.

- [ ] **Step 6: Commit**

```bash
git add components/sections/workflows.tsx
git commit -m "feat(landing): Workflows — recessed quote cards + the canonical DAG"
```

---

## Task 12: Four-ways — elevation + hover lift

**Files:**
- Modify: `components/sections/four-ways.tsx`

- [ ] **Step 1: Make the cards interactive surfaces**

The section already uses `<Surface level={1} className="relative flex flex-col p-7">`. Change it to:

```tsx
<Surface key={item.id} level={1} interactive className="relative flex flex-col p-7">
```

- [ ] **Step 2: Confirm band**

The `<section>` already has `band-deep`; leave it (now a sunken band via Task 1). No change.

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: the four cards visibly separate from the sunken band, lift on hover, keep their per-capability accent colours (cyan/green/gold) and SVG glyphs.

- [ ] **Step 4: Commit**

```bash
git add components/sections/four-ways.tsx
git commit -m "feat(landing): Four-ways cards as interactive elevated surfaces"
```

---

## Task 13: Three-ideas, Local-data, FAQ — reveal, bands, grounded surfaces

**Files:**
- Modify: `components/sections/three-ideas.tsx`
- Modify: `components/sections/local-data.tsx`
- Modify: `components/sections/faq.tsx`

- [ ] **Step 1: Three-ideas band**

Change `<section id="three-ideas" className="relative scroll-mt-24 py-24 md:py-32">` to add the canvas band: `className="relative scroll-mt-24 bg-[var(--color-bg)] py-24 md:py-32"`. No other change (it already consumes tokens; the radial-gradient `div` it renders behind the Orb stays — it is the orb's own glow, a signature element, not a surface glow).

- [ ] **Step 2: Local-data — trust points become surface cards**

`local-data.tsx` already has `band-deep` (now sunken — good). Replace the `dl` block:

```tsx
<dl className="mt-8 grid gap-5 sm:grid-cols-3">
  ...<div key={point.title} className="border-y border-[var(--color-border)] py-4">...
```

with grounded cards:

```tsx
<dl className="mt-8 grid gap-4 sm:grid-cols-3">
  {trustPoints.map((point) => (
    <div
      key={point.title}
      className="rounded-[var(--radius-md)] border border-[var(--color-border)] border-t-[var(--color-edge-top)] bg-[var(--color-surface-1)] p-4 shadow-[var(--shadow-sm)]"
    >
      <dt className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
        {point.title}
      </dt>
      <dd className="mt-2 text-[14px] leading-[1.55] text-[var(--color-ink-2)]">
        {point.body}
      </dd>
    </div>
  ))}
</dl>
```

Keep the surrounding `trustPoints` destructuring as-is.

- [ ] **Step 3: FAQ — grounded rows + press**

`faq.tsx`'s section already sets `bg-[var(--color-surface-deep)]` (a sunken band — good; leave it). On the `<details>` element change `className="group border-t border-[var(--color-border)] open:border-[var(--color-border-strong)] last:border-b"` to:

```
"group mb-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 transition-colors duration-150 open:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
```

(Each Q is now a discrete grounded card with a hover/press response instead of a hairline list.)

- [ ] **Step 4: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: trust points and FAQ rows now read as separated surfaces; bands alternate cleanly with neighbours.

- [ ] **Step 5: Commit**

```bash
git add components/sections/three-ideas.tsx components/sections/local-data.tsx components/sections/faq.tsx
git commit -m "feat(landing): grounded surfaces + bands for three-ideas/local-data/faq"
```

---

## Task 14: Final CTA + WaitlistForm

**Files:**
- Modify: `components/sections/final-cta.tsx`
- Modify: `components/ui/waitlist-form.tsx`

- [ ] **Step 1: Final CTA — deepest band, remove radial wash**

In `final-cta.tsx` change the `<section id="cta" ...>` className from
`"relative isolate scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-24 md:px-10 md:py-32 lg:min-h-[80vh] lg:py-36"`
to
`"relative isolate scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface-deep)] px-6 py-24 md:px-10 md:py-32 lg:min-h-[80vh] lg:py-36"`.

Delete the wash div entirely:
```tsx
<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_36%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.45)_32%,transparent_72%)]" />
```

- [ ] **Step 2: WaitlistForm — flat pill input + button**

In `waitlist-form.tsx`, for **both** the `email` and `name` step `<input>` elements, change the class fragment
`rounded-[var(--radius-sm)]` → `rounded-full`, and `bg-[var(--color-surface-1)]` → `bg-[var(--color-surface-2)]`.

For **both** submit `<button>` elements, change `rounded-[var(--radius-sm)]` → `rounded-full` and `text-[var(--color-bg)]` → `text-[var(--color-accent-on)]`.

(No structural/logic change — only these class tokens, applied to both steps identically.)

- [ ] **Step 3: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: Final CTA sits on the deepest band, no dark wash; the waitlist field + button are flat pills consistent with `ButtonLink`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/final-cta.tsx components/ui/waitlist-form.tsx
git commit -m "feat(landing): final CTA on deepest band; pill waitlist field"
```

---

## Task 15: Header, Footer, What's-next, ProgressRail polish

**Files:**
- Modify: `components/layout/site-header.tsx`
- Modify: `components/layout/site-footer.tsx`
- Modify: `components/sections/whats-next.tsx`

- [ ] **Step 1: Header — "Join waitlist" as a small secondary pill**

In `site-header.tsx`, replace the `<a href="#cta" ...>Join waitlist…</a>` element's className with a compact pill:

```
"group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-4 text-[12.5px] font-medium text-[var(--color-ink-1)] transition-colors duration-150 hover:bg-[var(--color-surface-3)] hover:border-[var(--color-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
```

Remove the inline `style={{ textDecorationColor: ... }}` and the `↗` text glyph span; keep just the "Join waitlist" label span (drop the underline-on-hover behaviour — it's now a pill).

- [ ] **Step 2: Header bar tint**

Change the `<header>` `bg-[rgba(27,23,18,0.84)]` to `bg-[rgba(14,11,8,0.82)]` so the sticky bar matches the new canvas.

- [ ] **Step 3: Footer — readable hairline + drop the accent dot wash**

In `site-footer.tsx`, remove the inline-styled radial `<span>` (the `style={{ background: "radial-gradient(circle at 50% 50%, rgba(217,185,120,0.18) ...)" }}` element) — it is a glow. Keep the `<Orb ... glowless />`. The `surface-line` and `border-[var(--color-border)]` now read correctly via Task 1; no other change.

- [ ] **Step 4: What's-next band**

`whats-next.tsx` already sets `bg-[var(--color-bg)]` (canvas band — correct in the rhythm). No structural change; the contrast fix is automatic from Task 1. Leave the `wn-dots` style block as-is.

- [ ] **Step 5: ProgressRail**

`progress-rail.tsx` uses only `bg-[var(--color-border-strong)]` and `bg-[var(--color-accent)]` — both remapped by Task 1. No code change. (Listed here only to confirm it was checked.)

- [ ] **Step 6: Verify**

```
npm run lint
npm run build
```
Expected: both succeed. Manual: header CTA is a clear pill (not bare text); sticky bar tint matches canvas; footer has no gold halo and its hairline is visible; progress rail thumb is visible.

- [ ] **Step 7: Commit**

```bash
git add components/layout/site-header.tsx components/layout/site-footer.tsx components/sections/whats-next.tsx
git commit -m "feat(landing): header pill CTA, readable footer, canvas-matched chrome"
```

---

## Task 16: Final verification pass

**Files:** none (verification + any small fixes uncovered)

- [ ] **Step 1: Lint + build**

```
npm run lint
npm run build
```
Expected: clean lint, successful build.

- [ ] **Step 2: Manual checklist on `npm run dev`**

Verify every item; fix and re-commit anything that fails:
- Widths 375 / 768 / 1024 / 1440: no horizontal scroll, hero + demo legible, cards separate from background.
- `prefers-reduced-motion` enabled (OS): no entrance/reveal animation, no "Talk to it" control, CapabilityDemo shows the Workflow scene statically, page fully usable.
- Mic **grant**: orb visibly reacts to voice (size + warm/cool hue shift). Mic **deny**: "Mic blocked — the orb stays ambient." copy shows, orb stays ambient, no console error.
- CapabilityDemo: cycles all five labels, progress bar tracks, pauses when scrolled away and when the tab is hidden.
- No browser console errors or React warnings on load or during a full scroll.
- Spot-check contrast: body text on `surface-1`/`surface-deep` and `ink-3` labels remain comfortably readable.
- App-mock surfaces inside frames (Workflows DAG, In-practice mocks) are visually intact (chrome correct, not clipped by the new sunken well).
- Copy is unchanged everywhere vs. `content/landing.ts`.

- [ ] **Step 3: Final commit (if Step 2 required fixes)**

```bash
git add -A
git commit -m "fix(landing): redesign verification pass adjustments"
```

---

## Self-review (completed by plan author)

- **Spec coverage:** §5 tokens → T1; §6 primitives → T2/T3/T4; §7 orb+demo → T7/T8/T9; §8 section table → T9–T15 (every row mapped); §9 scope boundary → respected (app UI inside frames untouched; T4 only reframes); §10 motion → T1 reveal CSS + T6 hook; §11 a11y → focus rings kept in T2/T7/T15, reduced-motion in T1/T7/T8, ≥44px targets via `min-h-11`; §12 verification → per-task + T16. No gaps.
- **Placeholder scan:** No TBD/TODO; every code step contains complete code or exact class-string edits quoted from current source.
- **Type consistency:** `useReveal` returns `{ref, revealed}` (T6) consumed unchanged; `useMicSignal` returns `{state, start, stop}` consumed by `MicAffordance` (T7); `OrbAudioSignal` shape `{amplitude, centroid, active}` matches `orb-audio-context.tsx` and the orb's reader; `CapabilityDemo` imports match the verified exports (`VoiceMock`,`ChatMock`,`SchedulesMock` from `four-ways-mocks`; `OutreachInboxMock`; `WorkflowDagMock`); `WorkflowShot` props in T11 match `WorkflowShotProps`.
