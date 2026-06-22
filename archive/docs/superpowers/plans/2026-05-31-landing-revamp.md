# Landing Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Sirius landing page as a demo-first page where the hero orb triggers a live social-posts automation film, followed by outcome cards, the "learns it once" differentiator, "one app not five," pricing (free-beta + $XX/mo), local-first, and a Download-for-Mac CTA.

**Architecture:** Restructure `app/page.tsx`'s section composition; rewrite `content/landing.ts` as the single copy source; rebuild `hero.tsx` to merge hero + demo (orb speech / tap → a new self-playing `SocialPostsDemo` film); add four new section components; refresh three existing ones; cut feeds and several legacy sections from the home page. The heavy `StartupAnalystAppDemo` and `/demo` route are untouched.

**Tech Stack:** Next.js (App Router, RSC), React client components, Tailwind v4 (`@theme` tokens in `globals.css`), `motion/react`, Web Audio via `useMicSignal`/`OrbAudioProvider`. No test runner.

---

## Verification model (read first)

This repo has **no unit-test runner** (`CLAUDE.md`). Each task substitutes the
"write failing test" step with **build/type/lint gates + a visual check**:

- Type gate: `npx tsc --noEmit`
- Lint gate: `npx eslint <changed files>`
- Visual check: `npm run dev` then open `http://localhost:3000` (and the brainstorm
  companion is already running if you want side-by-side reference). Confirm the
  described on-screen behavior before committing.
- Final gate (last task): `npm run build` — `/` and `/demo` must prerender static.

Commit after every task. Current branch: `interactive_element` (the landing repo's
working branch) — stay on it; do not open a worktree.

## File structure

**Create:**
- `lib/social-posts-demo.ts` — draft data + phase definitions for the film
- `components/sirius/social-posts-demo.tsx` — the self-playing demo film
- `components/sections/what-it-does.tsx` — outcome cards (replaces in-practice)
- `components/sections/learns-once.tsx` — "guide once → callable" (folds workflows)
- `components/sections/one-app.tsx` — "one app, not five" (folds three-ideas)
- `components/sections/pricing.tsx` — free-beta + $XX/mo

**Modify:**
- `content/landing.ts` — full copy restructure (single source of truth)
- `lib/use-mic-signal.ts` — add `onVoiceDetected` callback
- `components/sections/hero.tsx` — rebuild as hero+demo
- `components/sections/local-data.tsx` — copy refresh (keep structure)
- `components/sections/final-cta.tsx` — Download for Mac
- `components/layout/site-header.tsx` — nav + Download CTA
- `components/layout/site-footer.tsx` — copy refresh
- `app/page.tsx` — recompose section order, drop cut sections
- `app/layout.tsx` — SEO/metadata copy (if it references old taglines)

**Cut from home page (remove import + render; leave files unless unused):**
- `sections/in-practice.tsx`, `sections/live-demo.tsx`, `sections/workflows.tsx`,
  `sections/four-ways.tsx`, `sections/three-ideas.tsx`, `sections/whats-next.tsx`,
  `sections/faq.tsx`

**Untouched:** `app/demo/page.tsx`, `components/sirius/startup-analyst-demo.tsx`,
`lib/startup-analyst-demo.ts`, all `components/ui/*` and `components/sirius/appui/*`.

---

## Task 1: Restructure landing copy

**Files:**
- Modify: `content/landing.ts`

- [ ] **Step 1: Replace the exported object with the new page's copy**

Replace the whole `landingContent` export. Keep the `as const` and shape below;
this is the single source every section reads. (Price stays `"$XX"` placeholder.)

```ts
// Landing copy — see docs/superpowers/specs/2026-05-31-landing-revamp-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    availability: "Free during beta",
    tagline: "One assistant. It knows you. It does the work.",
  },
  nav: [
    { id: "what-it-does", label: "What it does" },
    { id: "learns-once", label: "How it works" },
    { id: "pricing", label: "Pricing" },
  ],
  downloadCta: { label: "Download for Mac", href: "#cta" },
  hero: {
    title: "One assistant. It knows you.",
    titleAccent: "It does the work.",
    description:
      "Across your inbox, calendar, files, and any app with an API — it holds the context and does the jumping, so you don't.",
    betaPill: "Free during beta",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  beat: "You already knew what to do. The bottleneck was being the one holding the context and doing the jumping.",
  whatItDoes: {
    eyebrow: "What it actually does",
    title: "Your week, mostly handled.",
    cards: [
      { id: "standup",  title: "Your standup, ready before you are", body: "It pulls the week's commits, closed tickets, and threads. A draft is waiting before you sit down." },
      { id: "meeting",  title: "Your next meeting, briefed",          body: "Fifteen minutes before, it pulls the last thread, open tasks, and prior notes. You walk in with the file." },
      { id: "client",   title: "Client changes, already done",        body: "Feedback scattered across emails and a doc — it groups the changes, drafts the easy ones, flags what needs you." },
      { id: "outreach", title: "The outreach you didn't send",        body: "Fifty people, each needing a real message. It researches each one and drafts them all. You review and send." },
    ],
  },
  learnsOnce: {
    eyebrow: "Why it's reliable",
    title: "Guide it once. Then just ask.",
    body: "Every other agent re-thinks the task from scratch every run — slow, inconsistent, needs babysitting. Sirius crystallizes that first run into a workflow. After that, “do the morning briefing” runs clean in seconds. Change it by asking; you never rebuild anything.",
    before: "First run — you guide it.",
    after: "“Do another for X” — it runs itself.",
  },
  oneApp: {
    eyebrow: "One app, not five",
    title: "Your whole stack collapses into one subscription.",
    body: "The chat knows what your automations did this morning. The automations know what you talked about yesterday. Nothing falls between systems, because there is only one system.",
    replaces: ["AI chat", "automations & schedules", "research", "personal CRM"],
    becomes: "Sirius",
  },
  pricing: {
    eyebrow: "Pricing",
    betaBadge: "Limited time — free during beta",
    price: "$XX",
    priceSuffix: "/mo after",
    note: "Less than the tools it replaces. Far less than the assistant it stands in for.",
    cta: "Download for Mac",
  },
  local: {
    eyebrow: "Local-first",
    title: "Your data stays on your Mac.",
    body: "Memories, conversations, files — all local. The recurring jobs that run while you sleep use the cloud, with only the data they need to do their job. Prefer fully local? You can have that — the trade is that scheduled runs stop when your laptop does.",
  },
  cta: {
    title: "Get the assistant the others were pretending to be.",
    button: "Download for Mac",
    sub: "macOS · free during beta",
  },
  footer: {
    blurb: "One assistant that knows you and acts across everything. Local-first, Mac.",
  },
} as const;
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint content/landing.ts`
Expected: tsc may report errors in *other* files that still import removed keys
(`workflows`, `fourWays`, `threeIdeas`, `whatsNext`, old `hero.*`). That is
expected at this stage — those files are rebuilt/removed in later tasks. `eslint`
on `content/landing.ts` itself: clean.

- [ ] **Step 3: Commit**

```bash
git add content/landing.ts
git commit -m "content: restructure landing copy for demo-first revamp"
```

---

## Task 2: Add `onVoiceDetected` to the mic hook

The hero needs to know the moment real speech starts so it can trigger the demo.
`useMicSignal` already computes `voiceActive`; surface a one-shot callback.

**Files:**
- Modify: `lib/use-mic-signal.ts`

- [ ] **Step 1: Accept an options arg and a fired-once ref**

Change the signature and add a ref near the other refs:

```ts
export function useMicSignal(options?: { onVoiceDetected?: () => void }) {
  const { signalRef } = useOrbAudio();
  const [state, setState] = useState<MicState>("idle");
  const mediaRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const heardVoiceRef = useRef(false);
  const silenceSinceRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  const onVoiceRef = useRef(options?.onVoiceDetected);
  onVoiceRef.current = options?.onVoiceDetected;
```

- [ ] **Step 2: Fire it once when voice first goes active**

Inside `tick`, in the `if (voiceActive) {` branch, after `heardVoiceRef.current = true;`:

```ts
        if (voiceActive) {
          heardVoiceRef.current = true;
          silenceSinceRef.current = null;
          if (!firedRef.current) {
            firedRef.current = true;
            onVoiceRef.current?.();
          }
        } else if (heardVoiceRef.current) {
```

- [ ] **Step 3: Reset the one-shot flag on start**

In `start`, where `heardVoiceRef.current = false;` is set (just before defining `tick`):

```ts
      heardVoiceRef.current = false;
      silenceSinceRef.current = null;
      firedRef.current = false;
```

- [ ] **Step 4: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint lib/use-mic-signal.ts`
Expected: clean for this file (cross-file errors from Task 1 may persist).

- [ ] **Step 5: Commit**

```bash
git add lib/use-mic-signal.ts
git commit -m "feat: surface onVoiceDetected one-shot from useMicSignal"
```

---

## Task 3: Social-posts demo data + phases

**Files:**
- Create: `lib/social-posts-demo.ts`

- [ ] **Step 1: Create the data module**

```ts
// Data for the hero's self-playing social-posts demo film.
// Depicts: pull a Notion source → research 3 angles → 3 ready drafts
// surfaced as a home-surface notification.

export type DemoDraft = {
  id: string;
  angle: string;       // the researched angle this draft takes
  text: string;        // the post body the user would ship
};

export type DemoPhase = {
  id: "trigger" | "pull" | "research" | "draft" | "done";
  label: string;       // shown in the status line while running
  dwellMs: number;     // how long this phase holds before advancing
};

export const DEMO_PHASES: DemoPhase[] = [
  { id: "trigger",  label: "Heard you — on it.",            dwellMs: 700 },
  { id: "pull",     label: "Reading your Notion page…",     dwellMs: 1100 },
  { id: "research", label: "Researching three angles…",     dwellMs: 1500 },
  { id: "draft",    label: "Drafting three posts…",         dwellMs: 1300 },
  { id: "done",     label: "3 drafts ready",                dwellMs: 0 },
];

export const DEMO_SOURCE = "Notion · “Content ideas — Q2”";

export const DEMO_ANGLES = [
  "Contrarian take",
  "Founder story",
  "Tactical how-to",
];

export const DEMO_DRAFTS: DemoDraft[] = [
  {
    id: "contrarian",
    angle: "Contrarian take",
    text: "Everyone's adding AI to their product. Almost no one's removing the steps AI makes pointless. The win isn't a chatbot in the corner — it's the form that no longer needs filling. Subtract before you add.",
  },
  {
    id: "story",
    angle: "Founder story",
    text: "We almost shipped a dashboard nobody asked for. Then a customer said: “I don't want to check it — I want it to check itself.” We deleted the dashboard and built the alert. Usage tripled.",
  },
  {
    id: "howto",
    angle: "Tactical how-to",
    text: "How we cut our weekly reporting from 2 hours to 4 minutes: 1) one source of truth, 2) a saved workflow that pulls it, 3) a draft waiting Monday 8am. We review, we don't rebuild. Steal it.",
  },
];
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint lib/social-posts-demo.ts`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add lib/social-posts-demo.ts
git commit -m "feat: social-posts demo data + phases"
```

---

## Task 4: Social-posts demo film component

A self-playing film. Driven by a `running` prop (the hero flips it true on
trigger). Walks `DEMO_PHASES` on timers; on `done`, reveals a home-surface
notification card listing the 3 drafts, each expandable. Reduced-motion jumps
straight to `done`.

**Files:**
- Create: `components/sirius/social-posts-demo.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import {
  DEMO_PHASES,
  DEMO_SOURCE,
  DEMO_ANGLES,
  DEMO_DRAFTS,
  type DemoPhase,
} from "@/lib/social-posts-demo";

type PhaseId = DemoPhase["id"];

export function SocialPostsDemo({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [openDraft, setOpenDraft] = useState<string | null>(null);

  // Reset whenever a run (re)starts.
  useEffect(() => {
    if (!running) return;
    if (reduce) {
      setPhaseIndex(DEMO_PHASES.length - 1);
      return;
    }
    setPhaseIndex(0);
  }, [running, reduce]);

  // Advance through the phases on their dwell timers.
  useEffect(() => {
    if (!running || reduce) return;
    if (phaseIndex >= DEMO_PHASES.length - 1) return;
    const t = window.setTimeout(
      () => setPhaseIndex((i) => Math.min(i + 1, DEMO_PHASES.length - 1)),
      DEMO_PHASES[phaseIndex].dwellMs,
    );
    return () => window.clearTimeout(t);
  }, [running, reduce, phaseIndex]);

  const phase = DEMO_PHASES[phaseIndex];
  const done = phase.id === "done";

  const reached = useMemo(() => {
    const order: PhaseId[] = ["trigger", "pull", "research", "draft", "done"];
    const idx = order.indexOf(phase.id);
    return (id: PhaseId) => order.indexOf(id) <= idx;
  }, [phase.id]);

  if (!running) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-10 w-full max-w-[560px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-deep)] text-left shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
      aria-live="polite"
    >
      {/* status bar */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: done ? "var(--color-success)" : "var(--color-state-listening-strong)",
            boxShadow: done ? "none" : "0 0 0 0 rgba(108,216,255,0.6)",
          }}
        />
        <span className="text-[12px] font-medium text-[var(--color-ink-2)]">{phase.label}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-4)]">
          Sirius · home
        </span>
      </div>

      <div className="p-4">
        {!done ? (
          <ol className="flex flex-col gap-2.5">
            <Step active={phase.id === "pull"} done={reached("research")} label={`Read ${DEMO_SOURCE}`} />
            <Step active={phase.id === "research"} done={reached("draft")} label="Researched 3 angles">
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {DEMO_ANGLES.map((a) => (
                  <span key={a} className="rounded-md border border-[var(--color-border)] px-2 py-1 text-[10px] text-[var(--color-ink-3)]">
                    {a}
                  </span>
                ))}
              </div>
            </Step>
            <Step active={phase.id === "draft"} done={false} label="Drafting 3 posts in your voice" />
          </ol>
        ) : (
          <AnimatePresence>
            <motion.div
              key="notice"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* home-surface notification */}
              <div className="relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
                <div className="absolute -left-px top-3 bottom-3 w-[3px] rounded-full bg-[var(--color-accent)]" aria-hidden />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]">
                    Sirius · noticed · just now
                  </span>
                </div>
                <p className="mt-3 font-display text-[18px] leading-tight text-[var(--color-ink-1)]">
                  Three drafts ready. Pick one, ship.
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--color-ink-2)]">
                  Pulled from {DEMO_SOURCE}, researched 3 angles, written in your voice.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {DEMO_DRAFTS.map((d) => {
                    const open = openDraft === d.id;
                    return (
                      <div key={d.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-deep)]">
                        <button
                          type="button"
                          onClick={() => setOpenDraft(open ? null : d.id)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left focus-ring"
                        >
                          <span className="text-[12px] font-medium text-[var(--color-ink-1)]">{d.angle}</span>
                          <span className="ml-auto text-[var(--color-ink-4)]">{open ? "–" : "+"}</span>
                        </button>
                        {open && (
                          <p className="border-t border-[var(--color-border)] px-3 py-2.5 text-[12.5px] leading-[1.55] text-[var(--color-ink-2)]">
                            {d.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function Step({
  active,
  done,
  label,
  children,
}: {
  active: boolean;
  done: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex gap-2.5" style={{ opacity: active || done ? 1 : 0.45 }}>
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: done
            ? "var(--color-success)"
            : active
              ? "var(--color-state-listening-strong)"
              : "var(--color-ink-4)",
        }}
      />
      <div className="min-w-0">
        <span className="text-[12.5px] text-[var(--color-ink-1)]">{done ? `✓ ${label}` : label}</span>
        {children}
      </div>
    </li>
  );
}
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sirius/social-posts-demo.tsx`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add components/sirius/social-posts-demo.tsx
git commit -m "feat: self-playing social-posts demo film"
```

---

## Task 5: Rebuild the hero (orb triggers the demo)

Merge hero + demo. Headline/subhead/CTA, then the orb as the voice on-ramp wired
to `useMicSignal({ onVoiceDetected })`; a "See it work" tap button is the
fallback / always-available trigger. On trigger, render `<SocialPostsDemo running />`.

**Files:**
- Modify: `components/sections/hero.tsx` (replace file contents)

- [ ] **Step 1: Replace the file**

```tsx
"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { SocialPostsDemo } from "@/components/sirius/social-posts-demo";
import { useMicSignal } from "@/lib/use-mic-signal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  const reduce = useReducedMotion();
  const { title, titleAccent, description, betaPill, micHint, micPrivacy, tapFallback } =
    landingContent.hero;
  const { downloadCta } = landingContent;

  const [running, setRunning] = useState(false);
  const trigger = useCallback(() => setRunning(true), []);

  const { state: micState, start: startMic } = useMicSignal({ onVoiceDetected: trigger });
  const listening = micState === "listening";
  const micUnavailable = micState === "unsupported";

  const onOrbClick = useCallback(() => {
    // Tap always works as a trigger; also try to open the mic so speech reacts.
    if (!micUnavailable && !listening) startMic();
    trigger();
  }, [micUnavailable, listening, startMic, trigger]);

  const motionState = reduce
    ? { initial: undefined, animate: undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <Container className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-[clamp(2rem,6vh,5rem)] text-center">
        <motion.h1
          {...motionState}
          variants={fade}
          className="font-display text-balance font-normal text-[var(--color-ink-1)]"
          style={{ fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: "0.98", letterSpacing: "-0.03em" }}
        >
          <span className="block">{title}</span>
          <span className="block" style={{ color: "var(--color-accent)" }}>
            {titleAccent}
          </span>
        </motion.h1>

        <motion.p
          {...motionState}
          variants={fade}
          className="mx-auto mt-7 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[var(--color-ink-2)]"
        >
          {description}
        </motion.p>

        <motion.div {...motionState} variants={fade} className="mt-9 flex items-center justify-center gap-5">
          <ButtonLink href={downloadCta.href} variant="primary">
            {downloadCta.label}
          </ButtonLink>
          <span className="rounded-full border border-[rgba(108,216,255,0.4)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-state-listening-strong)]">
            {betaPill}
          </span>
        </motion.div>

        {/* Orb = voice on-ramp / trigger */}
        <div className="mt-12 flex flex-col items-center">
          <button
            type="button"
            onClick={onOrbClick}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Speak to Sirius and watch it work"
            className="relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[rgba(108,216,255,0.55)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--color-bg)]"
            style={{ width: "clamp(120px,16vh,180px)", height: "clamp(120px,16vh,180px)" }}
          >
            <Orb className="!h-full !w-full" pulse />
          </button>
          {!running && (
            <>
              <p className="mt-4 text-[13px] text-[var(--color-state-listening-strong)]" aria-live="polite">
                {listening ? "listening…" : micUnavailable ? tapFallback : micHint}
              </p>
              <button
                type="button"
                onClick={trigger}
                className="btn btn-quiet mt-1 text-[12px]"
              >
                {tapFallback} ↓
              </button>
            </>
          )}
        </div>

        {!running && (
          <p className="mt-6 text-[11px] text-[var(--color-ink-4)]">{micPrivacy}</p>
        )}

        <SocialPostsDemo running={running} />
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/hero.tsx`
Expected: clean for this file (page.tsx still errors until Task 11).

- [ ] **Step 3: Visual check**

Run: `npm run dev`, open `http://localhost:3000`. Confirm: headline + subhead +
Download for Mac + beta pill; orb pulses; clicking the orb or "See it work"
reveals the film, which walks pull → 3 angles → drafting → a "Three drafts ready"
notification with 3 expandable drafts. Granting mic and speaking also triggers it.

- [ ] **Step 4: Commit**

```bash
git add components/sections/hero.tsx
git commit -m "feat: rebuild hero as orb-triggered demo opening"
```

---

## Task 6: "What it does" outcome cards

**Files:**
- Create: `components/sections/what-it-does.tsx`

- [ ] **Step 1: Write the section**

```tsx
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function WhatItDoesSection() {
  const { eyebrow, title, cards } = landingContent.whatItDoes;
  return (
    <section id="what-it-does" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionLabel tone="warm">{eyebrow}</SectionLabel>
        <h2 className="font-display mt-7 max-w-[20ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
          {title}
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <div
              key={c.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition-colors hover:border-[var(--color-border-strong)]"
            >
              <h3 className="font-display text-[18px] font-normal leading-tight text-[var(--color-ink-1)]">
                {c.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-[var(--color-ink-2)]">{c.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

> Note: confirm `SectionLabel` accepts a `tone="warm"` prop (it does in
> `live-demo.tsx`). If your copy's `eyebrow` differs, the component still renders.

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/what-it-does.tsx`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/what-it-does.tsx
git commit -m "feat: 'what it does' outcome cards section"
```

---

## Task 7: "It learns it once" section

**Files:**
- Create: `components/sections/learns-once.tsx`

- [ ] **Step 1: Write the section**

```tsx
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function LearnsOnceSection() {
  const { eyebrow, title, body, before, after } = landingContent.learnsOnce;
  return (
    <section id="learns-once" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionLabel tone="warm">{eyebrow}</SectionLabel>
            <h2 className="font-display mt-7 max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
              {body}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full rounded-[var(--radius-md)] border border-[rgba(108,216,255,0.4)] bg-[var(--color-surface-1)] p-4 text-[13px] text-[var(--color-ink-1)]">
              {before}
            </div>
            <span className="text-[var(--color-accent)]" aria-hidden>↓ saved</span>
            <div className="w-full rounded-[var(--radius-md)] border border-[rgba(167,219,178,0.4)] bg-[var(--color-surface-1)] p-4 text-[13px] text-[var(--color-ink-1)]">
              {after}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/learns-once.tsx`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/learns-once.tsx
git commit -m "feat: 'learns it once' differentiator section"
```

---

## Task 8: "One app, not five" section

**Files:**
- Create: `components/sections/one-app.tsx`

- [ ] **Step 1: Write the section**

```tsx
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function OneAppSection() {
  const { eyebrow, title, body, replaces, becomes } = landingContent.oneApp;
  return (
    <section id="one-app" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionLabel tone="warm">{eyebrow}</SectionLabel>
        <h2 className="font-display mt-7 max-w-[22ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
          {title}
        </h2>
        <p className="mt-7 max-w-[56ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
          {body}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {replaces.map((t) => (
            <span
              key={t}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-[13px] text-[var(--color-ink-3)] line-through decoration-[var(--color-ink-4)]"
            >
              {t}
            </span>
          ))}
          <span className="text-[var(--color-accent)] text-[18px]" aria-hidden>→</span>
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3.5 py-2 text-[13px] font-semibold text-[#1b1712]">
            {becomes}
          </span>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/one-app.tsx`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/one-app.tsx
git commit -m "feat: 'one app, not five' section"
```

---

## Task 9: Pricing section

**Files:**
- Create: `components/sections/pricing.tsx`

- [ ] **Step 1: Write the section**

```tsx
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { landingContent } from "@/content/landing";

export function PricingSection() {
  const { eyebrow, betaBadge, price, priceSuffix, note, cta } = landingContent.pricing;
  const { downloadCta } = landingContent;
  return (
    <section id="pricing" className="scroll-mt-24 py-24 md:py-32">
      <Container className="flex flex-col items-center text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {eyebrow}
        </span>
        <div className="mt-7 w-full max-w-[440px] rounded-[var(--radius-lg)] border border-[rgba(240,179,90,0.35)] bg-[var(--color-surface-1)] p-8">
          <span className="inline-block rounded-full border border-[rgba(108,216,255,0.4)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-state-listening-strong)]">
            {betaBadge}
          </span>
          <div className="mt-6 font-display text-[44px] font-normal leading-none text-[var(--color-ink-1)]">
            {price}
            <span className="text-[16px] text-[var(--color-ink-3)]">{priceSuffix}</span>
          </div>
          <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-[1.55] text-[var(--color-ink-2)]">
            {note}
          </p>
          <div className="mt-7 flex justify-center">
            <ButtonLink href={downloadCta.href} variant="primary">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/pricing.tsx`
Expected: clean for this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/pricing.tsx
git commit -m "feat: pricing section (free beta + monthly)"
```

---

## Task 10: Refresh local-data, final-cta, header, footer

These reuse existing structure; only copy + CTA wiring changes. Read each file
first to match its current prop/class patterns, then make the minimal edits below.

**Files:**
- Modify: `components/sections/local-data.tsx`
- Modify: `components/sections/final-cta.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `components/layout/site-footer.tsx`

- [ ] **Step 1: local-data — point copy at `landingContent.local`**

Read `components/sections/local-data.tsx`. Replace its title/body text sources
with `landingContent.local.eyebrow/title/body` (the section previously read
`landingContent.localData.*`, which no longer exists). Keep its layout/diagram.
Ensure `id="local"` on the `<section>` and `scroll-mt-24`.

- [ ] **Step 2: final-cta — Download for Mac**

Read `components/sections/final-cta.tsx`. Ensure the section has `id="cta"`.
Set the heading to `landingContent.cta.title`, the primary button label to
`landingContent.cta.button` (link `href="#cta"` is fine as the download anchor
placeholder until the real .dmg URL exists), and the sub-line to
`landingContent.cta.sub`. Remove any "request access"/waitlist form wording.

- [ ] **Step 3: site-header — nav + Download CTA**

Read `components/layout/site-header.tsx`. Render nav links from
`landingContent.nav` (`{id,label}` → `<a href={"#"+id}>`), and the primary CTA
as `landingContent.downloadCta.label` linking to `landingContent.downloadCta.href`.
Remove any old "request access" label.

- [ ] **Step 4: site-footer — copy refresh**

Read `components/layout/site-footer.tsx`. Replace any old tagline with
`landingContent.footer.blurb` and the wordmark from `landingContent.meta.wordmark`.
Remove "private beta" framing in favor of `landingContent.meta.availability`
("Free during beta") if the footer shows availability.

- [ ] **Step 5: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint components/sections/local-data.tsx components/sections/final-cta.tsx components/layout/site-header.tsx components/layout/site-footer.tsx`
Expected: clean for these files.

- [ ] **Step 6: Commit**

```bash
git add components/sections/local-data.tsx components/sections/final-cta.tsx components/layout/site-header.tsx components/layout/site-footer.tsx
git commit -m "refresh: local-first, download CTA, header nav, footer copy"
```

---

## Task 11: Recompose the home page

**Files:**
- Modify: `app/page.tsx` (replace contents)

- [ ] **Step 1: Replace the file**

```tsx
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/hero";
import { WhatItDoesSection } from "@/components/sections/what-it-does";
import { LearnsOnceSection } from "@/components/sections/learns-once";
import { OneAppSection } from "@/components/sections/one-app";
import { PricingSection } from "@/components/sections/pricing";
import { LocalDataSection } from "@/components/sections/local-data";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { ProgressRail } from "@/components/ui/progress-rail";
import { SectionDivider } from "@/components/ui/section-divider";
import { landingContent } from "@/content/landing";

export default function HomePage() {
  const { beat } = landingContent;
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-ink-1)]">
      <SiteHeader />
      <ProgressRail />
      <HeroSection />
      <SectionDivider />
      <section id="beat" className="py-16 md:py-20">
        <div className="mx-auto max-w-[640px] px-6 text-center">
          <p className="font-display text-[clamp(1.3rem,2.6vw,1.9rem)] font-normal italic leading-[1.3] text-[var(--color-ink-1)]">
            {beat}
          </p>
        </div>
      </section>
      <SectionDivider />
      <WhatItDoesSection />
      <SectionDivider />
      <LearnsOnceSection />
      <SectionDivider />
      <OneAppSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <LocalDataSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
```

> FAQ is intentionally cut from the home page (spec open question resolved: cut).
> The `faq.tsx` file is left in place, just not rendered.

- [ ] **Step 2: Type + lint gate**

Run: `npx tsc --noEmit && npx eslint app/page.tsx`
Expected: clean. `tsc` should now be clean repo-wide for the home page graph
(cut sections are no longer imported). If `tsc` reports errors in the now-orphan
cut files (`four-ways.tsx`, `three-ideas.tsx`, `whats-next.tsx`, `workflows.tsx`,
`in-practice.tsx`, `live-demo.tsx`) because they reference removed `landingContent`
keys, that's handled in Task 12.

- [ ] **Step 3: Visual check**

Run: `npm run dev`, open `http://localhost:3000`. Scroll the whole page top to
bottom and confirm the section order matches the spec: hero+demo → beat → what it
does → learns once → one app → pricing → local-first → final CTA → footer.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: recompose home page for demo-first revamp"
```

---

## Task 12: Remove orphaned sections + fix SEO

The cut section files still reference deleted `landingContent` keys and will
break `npm run build` (which type-checks the whole project). Delete the files no
longer used by the home page, after confirming nothing else imports them.

**Files:**
- Delete: `components/sections/in-practice.tsx`, `components/sections/live-demo.tsx`,
  `components/sections/workflows.tsx`, `components/sections/four-ways.tsx`,
  `components/sections/three-ideas.tsx`, `components/sections/whats-next.tsx`
- Keep: `components/sections/faq.tsx` (unused but harmless — leave it)
- Modify: `app/layout.tsx` (SEO metadata)

- [ ] **Step 1: Confirm no remaining importers**

Run:
```bash
grep -rln "sections/in-practice\|sections/live-demo\|sections/workflows\|sections/four-ways\|sections/three-ideas\|sections/whats-next" app components
```
Expected: no output (only `app/page.tsx` referenced them, now removed). If `faq.tsx`
appears, that's fine — leave faq. If any other file appears, stop and reassess.

- [ ] **Step 2: Delete the cut section files**

```bash
git rm components/sections/in-practice.tsx components/sections/live-demo.tsx components/sections/workflows.tsx components/sections/four-ways.tsx components/sections/three-ideas.tsx components/sections/whats-next.tsx
```

> Note: `live-demo.tsx` imported `StartupAnalystDemo`; that component and the
> `/demo` route remain. Only the home-page wrapper section is removed.

- [ ] **Step 3: Update SEO/metadata copy**

Read `app/layout.tsx`. Update the `metadata` (title/description/openGraph) to the
new positioning, e.g. title `"Sirius — one assistant that knows you and does the work"`,
description from `landingContent.hero.description`. Remove any "request access"/
"private beta" phrasing. Keep existing metadata structure/keys.

- [ ] **Step 4: Check `faq.tsx` for stale keys**

Read `components/sections/faq.tsx`. If it references removed `landingContent` keys
at module scope, it would still break the build even though unused (it's compiled).
If so, either delete it too (`git rm`) or update its references to existing copy.
Prefer deleting if it's not on the page and references dead keys.

- [ ] **Step 5: Full build gate**

Run: `npx tsc --noEmit && npx eslint . && npm run build`
Expected: type-clean, lint-clean, and a successful build where `/` and `/demo`
both prerender as static (`○`/`●` in the route table, not `ƒ`).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove cut sections, refresh SEO for revamp"
```

---

## Task 13: Final verification pass

- [ ] **Step 1: Build + static prerender**

Run: `npm run build`
Expected: success; route table shows `/` and `/demo` static.

- [ ] **Step 2: Manual QA checklist (run `npm run dev`)**

Confirm each:
- Hero: headline, subhead, Download for Mac, free-beta pill render; orb pulses.
- Orb tap **and** "See it work" both start the film; film reaches the "3 drafts
  ready" notification; each draft expands/collapses.
- Granting mic + speaking starts the film (and the orb reacts to voice).
- Section order matches the spec; all anchor links in the header scroll correctly
  (`#what-it-does`, `#learns-once`, `#pricing`, `#cta`).
- Reduced motion (OS setting): orb calm, film jumps straight to the 3 drafts.
- Mobile width (~390px): hero stacks, cards single-column, pricing card fits.
- `/demo` route still loads the startup-analyst demo unchanged.

- [ ] **Step 3: Commit any QA fixes, then finish**

```bash
git add -A && git commit -m "fix: landing revamp QA polish" || echo "no fixes needed"
```

---

## Self-review notes (author)

- **Spec coverage:** hero/orb-trigger (T2,T4,T5) · social-posts demo w/ home
  notification (T3,T4) · beat (T11) · what-it-does cards (T6) · learns-once (T7) ·
  one-app, feeds removed (T8) · pricing free-beta+$XX (T9) · local-first (T10) ·
  Download CTA (T5,T9,T10) · header nav/footer (T10) · cut sections incl. feeds
  (T12) · `/demo` untouched (noted T12) · verification (T13). All spec sections map.
- **Deferred (from spec open questions):** `$XX` price placeholder stays until the
  real number is supplied; FAQ resolved as **cut from home**; 4 outcome cards
  chosen (standup/meeting/client/outreach — "posts" is the hero demo).
- **Type consistency:** `landingContent` keys defined in T1 are the exact keys
  read in T5–T11 (`hero.*`, `beat`, `whatItDoes.*`, `learnsOnce.*`, `oneApp.*`,
  `pricing.*`, `local.*`, `cta.*`, `nav`, `downloadCta`, `footer`, `meta`).
  `SocialPostsDemo` takes a single `running` prop in both T4 and T5.
