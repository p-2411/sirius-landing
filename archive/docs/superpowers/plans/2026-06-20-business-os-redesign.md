# Sirius "Operating System for Your Business" Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-spine the landing page from a solo "AI cofounder" to a company-wide **operating system for your business** — two layers (information + operation) joined by a compounding loop, plus a per-employee Sirius — with a Request-access GTM.

**Architecture:** Copy lives in `content/landing.ts` (one `as const` object consumed by every section). Sections are React components in `components/sirius-design/landing.tsx` and `components/sections/`, assembled in `app/page.tsx`, styled by `app/sirius-design.css` (scoped under `.sd`). The redesign rewrites the copy model, renames/replaces section components, adds one new "loop" visual and one "team" visual, swaps every download CTA for the recovered `WaitlistForm` (wired to the existing `/api/waitlist`), and removes the pricing/local/model-routing/download surfaces.

**Tech Stack:** Next.js 16 (App Router, `--webpack` build), React, TypeScript, Tailwind v4 + scoped CSS, `motion@12` (`motion/react`).

## Global Constraints

- **No test runner.** Per-task verification = `npx tsc --noEmit` && `npx eslint <changed files>` && `npm run build`. `/` and `/demo` must still prerender static. For visual tasks, also screenshot-verify against `docs/superpowers/specs/2026-06-20-business-os-redesign-design.md` per the standing screenshot loop (build, screenshot, inspect vs spec, loop until it matches).
- **Brand name is `Sirius`** (never "Sirus"), everywhere.
- **Copy is the source of truth in the spec** `docs/superpowers/specs/2026-06-20-business-os-redesign-design.md` — use it verbatim.
- **Positioning guardrail (CLAUDE.md):** audience is high-agency non-engineers; lead with the outcome, keep machinery secondary. The loop must read as value, not an architecture diagram.
- **Visual system (DESIGN.md):** warm near-black ground, gold (`#d9b978` / `217,185,120`) + cyan (`#6cd8ff` / `108,216,255`) only, Fraunces display / Geist body / JetBrains mono, calm motion, always honor `prefers-reduced-motion`.
- **Commit after every task** with a descriptive message ending:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Work happens on `main` (per session). Branch only if asked.

---

## File Structure

**Create:**
- `components/ui/waitlist-form.tsx` — recovered Request-access form (two-stage, posts `/api/waitlist`).
- `components/sirius/loop-flywheel.tsx` — §4 information↔operation loop visual.
- `components/sirius/team-constellation.tsx` — §5 per-employee → shared-brain visual.

**Modify:**
- `content/landing.ts` — new copy model.
- `components/sirius-design/landing.tsx` — hero CTAs, renamed/new/removed sections, footer nav.
- `components/sections/jobs-roster.tsx` — read `operationLayer.jobs`.
- `components/sections/relationships.tsx` — retitle as an operation-layer example.
- `components/sections/final-cta.tsx` — render `WaitlistForm` instead of `DownloadButton`.
- `components/sections/one-app.tsx` — (copy unchanged; verify still compiles).
- `components/layout/site-header.tsx` — new nav anchors + Request-access CTA.
- `app/page.tsx` — new section assembly.
- `app/layout.tsx` — drop `DownloadProvider` (cleanup task).
- `app/sirius-design.css` — styles for the two new visuals.
- `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md` — positioning updates.

**Delete (cleanup task):**
- `components/ui/download-button.tsx`, `components/ui/download-modal.tsx`, `components/layout/header-download.tsx`, `app/api/free-download/route.ts`, and the download-only helpers in `lib/airtable.ts` (`countDownloads`, `downloadExists`, `createDownload`) — only after no references remain.

---

### Task 1: Recover the Request-access form (`WaitlistForm`)

A complete two-stage Request-access form (email → name, honeypot, motion, a11y, wired to the live `/api/waitlist`) was deleted in commit `bb798c6`. Recover it verbatim — do not rebuild.

**Files:**
- Create: `components/ui/waitlist-form.tsx`

**Interfaces:**
- Produces: `export function WaitlistForm()` — renders `<form id="waitlist">`; CTA button label "Request access"; auto-focuses its input when an `a[href="#cta"]` or `a[href="#waitlist"]` is clicked or the hash becomes `#cta`/`#waitlist`. Posts `{stage:"email",email,company,elapsedMs}` then `{stage:"name",email,name}` to `/api/waitlist`.

- [ ] **Step 1: Recover the file from git history**

```bash
cd /Users/parhamsepasgozar/Documents/GitHub/sirius-landing
git show bb798c6^:components/ui/waitlist-form.tsx > components/ui/waitlist-form.tsx
```

- [ ] **Step 2: Verify it compiles and lints**

Run: `npx tsc --noEmit && npx eslint components/ui/waitlist-form.tsx`
Expected: no errors. (`motion@12` and `AppIcon` names `arrow`/`check` are present.)

- [ ] **Step 3: Commit**

```bash
git add components/ui/waitlist-form.tsx
git commit -m "feat(landing): recover WaitlistForm for request-access CTA

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: New copy model in `content/landing.ts`

Rewrite the content object to the spec's copy. This task is **additive-safe**: it adds the new keys and updates in-place keys, **moves** `jobs` into `operationLayer`, and updates the one tightly-coupled consumer (`jobs-roster.tsx`) in the same task. Old keys still referenced by not-yet-touched sections (`howItLearns`, `whileYouSleep` minus jobs, `rightBrain`, `pricing`, `local`, `downloadCta`) are **kept** so the build stays green; they are deleted in Task 11.

**Files:**
- Modify: `content/landing.ts`
- Modify: `components/sections/jobs-roster.tsx:35` (the `const { jobs } = ...` line)

**Interfaces:**
- Produces (new keys consumed by later tasks):
  - `meta.wordmark: "Sirius"`, `meta.tagline`
  - `nav: readonly {id?,href?,label}[]`, `requestCta: {label,href}`
  - `hero: {eyebrow,title,titleAccent,description,proof,micHint,micPrivacy,tapFallback}`
  - `informationLayer: {eyebrow,title,lead,pillars: {title,body}[]}`
  - `operationLayer: {eyebrow,title,lead,jobs: {group,name,desc,trigger,activity,status}[]}`
  - `theLoop: {eyebrow,title,lead}`
  - `perEmployee: {eyebrow,title,lead}`
  - `stack: {eyebrow,title,body}`, `integrations: {label,tools,more}`
  - `relationships: {eyebrow,title,body,card}` (unchanged shape)
  - `maker: {quote,signature}`, `cta: {title,button,sub}`, `footer: {blurb}`

- [ ] **Step 1: Replace the body of `content/landing.ts` with the new model**

Keep the deprecated keys block at the bottom (marked) so existing components compile until Task 11.

```ts
// Landing copy — see docs/superpowers/specs/2026-06-20-business-os-redesign-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    tagline: "The operating system for your business.",
  },
  nav: [
    { id: "knows", label: "What it knows" },
    { id: "does", label: "What it does" },
    { id: "loop", label: "The loop" },
    { id: "team", label: "For your team" },
    { href: "/blog", label: "Blog" },
  ],
  requestCta: { label: "Request access", href: "#cta" },
  integrations: {
    label: "Runs inside the tools you already run on",
    tools: ["Slack", "Gmail", "Calendar", "Google Drive", "Notion", "HubSpot", "Salesforce", "Stripe", "Zoom", "Granola"],
    more: "+ anything with an API",
  },
  hero: {
    eyebrow: "The operating system for your business",
    title: "It knows how your business runs.",
    titleAccent: "So it runs it.",
    description:
      "Sirius learns your business from the inside — every meeting, every message, every client — and holds it as one picture nobody's ever had the time to keep. It sees what's slipping, then does the work to fix it, across the tools you already use.",
    proof: "Now rolling out to teams.",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  informationLayer: {
    eyebrow: "the information layer",
    title: "One picture of the whole business.",
    lead: "Everything your company knows is scattered — across inboxes, calls, threads, and a CRM nobody keeps current. Sirius pulls it together on its own. Every meeting it sits in, every Slack message, every email and client interaction feeds one living picture of how the business actually works — who's involved, what was promised, where it's stuck.",
    pillars: [
      { title: "Sits in on the meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next." },
      { title: "Reads every channel", body: "Inbox, Slack, the CRM — it keeps up with all of it so nobody has to be the one holding it in their head." },
      { title: "Finds what's slipping", body: "It connects the threads and surfaces the gaps: the promise nobody kept, the deal gone quiet, the work falling between systems." },
    ],
  },
  operationLayer: {
    eyebrow: "the operation layer",
    title: "It closes the gaps it finds.",
    lead: "Knowing isn't the point — doing is. From that picture, Sirius acts on what's falling through: it drafts the follow-up nobody sent, chases the deal that went quiet, builds the automation you kept meaning to set up. Real work, shipped across your apps — not another dashboard telling you what's wrong.",
    jobs: [
      { group: "Needs you",   name: "Prospect outreach",     desc: "research & write to fresh prospects every night",  trigger: "🕐 nightly",   activity: "awaiting you", status: "awaiting" },
      { group: "Active now",  name: "Inbound triage",        desc: "qualify every new inbound lead and book the demo", trigger: "✉️ on email", activity: "3 running",    status: "running" },
      { group: "Active now",  name: "Deal follow-ups",       desc: "chase any open deal that's gone quiet 5+ days",     trigger: "🕐 daily",     activity: "",             status: "running" },
      { group: "Standing by", name: "Renewal guard",         desc: "flag any account approaching its renewal date",     trigger: "🕐 daily",     activity: "2h ago",       status: "done" },
      { group: "Standing by", name: "Investor update",       desc: "draft the weekly update from live metrics",         trigger: "🕐 Mon 8:00", activity: "3d ago",       status: "done" },
      { group: "Standing by", name: "Watch: lead investor",  desc: "alert & draft the moment a key contact emails",     trigger: "✉️ on email", activity: "5h ago",       status: "done" },
    ],
  },
  relationships: {
    eyebrow: "one gap, closed",
    title: "It keeps every relationship warm.",
    body: "Sirius knows when you last spoke to each client, what you promised, and who's gone quiet. It drafts the follow-up, sends it at the right moment, and surfaces the prospects worth chasing — or just tells you who to call today.",
    card: {
      lane: "Needs you",
      eyebrow: "Follow-up ready",
      title: "Reply to Dana at Acme",
      why: "Acme thread · last reply 3 weeks ago · you promised the Q3 numbers",
      to: "Dana Reyes <dana@acme.co>",
      subject: "The Q3 numbers I promised",
      preview:
        "Hi Dana — circling back with the Q3 figures I promised. Quick recap below and the full sheet attached. Free Thursday to walk through it together?",
      actions: ["Send", "Edit", "Dismiss"],
    },
  },
  theLoop: {
    eyebrow: "the loop",
    title: "Every action makes it smarter.",
    lead: "This is what makes it an operating system and not a tool: the two layers feed each other. Everything Sirius does — every email sent, every deal moved, every automation that runs — flows back into what it knows. The picture sharpens, the gaps get clearer, and it ships more on its own. The longer it runs, the more it runs for you.",
  },
  perEmployee: {
    eyebrow: "for everyone, not just the org",
    title: "Everyone gets their own Sirius.",
    lead: "Each person on your team gets a Sirius that knows them. It takes notes in their meetings, handles their inbox, and builds the small automations they never found time for. And every bit of that work quietly feeds the same shared picture — so the whole company gets smarter every time one person gets help.",
  },
  stack: {
    eyebrow: "one mind, every tool",
    title: "It lives where the work already happens.",
    body: "Slack, Gmail, Calendar, Drive, Notion, your CRM — Sirius operates inside the tools your company already uses, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them.",
  },
  maker: {
    quote:
      "We were tired of tools that made us feed them. Every CRM, every tracker, every app needed us to keep it current — and none of them did anything with what they knew. We wanted the opposite: something that learns the business on its own, and then actually runs it. Nothing we tried did, so we built it.",
    signature: "— the people building Sirius",
  },
  cta: {
    title: "Put your business on Sirius.",
    button: "Request access",
    sub: "Early access · rolling out to teams now",
  },
  footer: {
    blurb: "The operating system for your business. It learns how your company runs, then runs it with you — across the tools you already use.",
  },

  // ── DEPRECATED — referenced only by sections removed in Task 11. Do not extend. ──
  downloadCta: { label: "Request access", href: "#cta" },
  howItLearns: {
    eyebrow: "how it learns you", title: "It learns the business on its own.", lead: "",
    pillars: [] as { title: string; body: string }[],
  },
  whileYouSleep: {
    eyebrow: "", title: "", lead: "",
    cards: [] as { id: string; time: string; when: string; title: string; body: string }[],
    close: "",
  },
  rightBrain: { eyebrow: "", title: "", body: "" },
  pricing: { title: "", tiers: [] as { name: string; was: string; price: string; priceSuffix: string; tagline: string; features: string[]; cta: string; featured: boolean }[] },
  local: { eyebrow: "", title: "", body: "", items: [] as string[] },
} as const;
```

- [ ] **Step 2: Point JobsRoster at the moved `jobs` data**

In `components/sections/jobs-roster.tsx`, change:

```ts
  const { jobs } = landingContent.whileYouSleep;
```
to:
```ts
  const { jobs } = landingContent.operationLayer;
```

- [ ] **Step 3: Verify the build is green**

Run: `npx tsc --noEmit && npx eslint content/landing.ts components/sections/jobs-roster.tsx && npm run build`
Expected: PASS, `/` and `/demo` prerender. (Old sections still render off the deprecated keys with empty strings; that's fine — they're removed in Task 11. The page is mid-migration but compiles and builds.)

- [ ] **Step 4: Commit**

```bash
git add content/landing.ts components/sections/jobs-roster.tsx
git commit -m "feat(landing): new business-OS copy model (information/operation/loop/team)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: The loop flywheel visual

**Files:**
- Create: `components/sirius/loop-flywheel.tsx`
- Modify: `app/sirius-design.css` (append the `.loop-*` block)

**Interfaces:**
- Produces: `export function LoopFlywheel({ className }: { className?: string })` — an `role="img"` SVG diagram with four nodes (Information · Insight · Operation · Outcome) on a ring and a calm clockwise-travelling arc. No motion when `prefers-reduced-motion`.

- [ ] **Step 1: Create the component**

```tsx
// components/sirius/loop-flywheel.tsx
// §4 visual — the information↔operation loop. Four labelled nodes on a ring with
// a calm clockwise-travelling arc showing flow. The point isn't the diagram, it's
// the idea that every action feeds back. Honors DESIGN.md (gold + cyan, near-black)
// and prefers-reduced-motion (arc holds still).
const C = 200;
const R = 120;

type Tone = "cyan" | "gold";
const NODES: { key: string; label: string; sub: string; x: number; y: number; tone: Tone; lx: number; ly: number; anchor: "start" | "middle" | "end" }[] = [
  { key: "information", label: "Information", sub: "it learns everything", x: C, y: C - R, tone: "cyan", lx: C, ly: C - R - 30, anchor: "middle" },
  { key: "insight", label: "Insight", sub: "it spots the gaps", x: C + R, y: C, tone: "gold", lx: C + R + 16, ly: C - 4, anchor: "start" },
  { key: "operation", label: "Operation", sub: "it does the work", x: C, y: C + R, tone: "gold", lx: C, ly: C + R + 26, anchor: "middle" },
  { key: "outcome", label: "Outcome", sub: "it feeds back", x: C - R, y: C, tone: "cyan", lx: C - R - 16, ly: C - 4, anchor: "end" },
];

const hex = (t: Tone) => (t === "cyan" ? "#6cd8ff" : "#d9b978");
const halo = (t: Tone) => (t === "cyan" ? "rgba(108,216,255,.30)" : "rgba(217,185,120,.30)");

export function LoopFlywheel({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="A loop: the information layer learns everything, spots the gaps as insight, the operation layer does the work, and every outcome feeds back into what it knows — so it compounds."
    >
      <svg viewBox="0 0 400 400" className="loop-svg" aria-hidden="true">
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(232,224,200,.14)" strokeWidth="1.5" />
        <circle
          className="loop-flow"
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="rgba(108,216,255,.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={100}
        />
        {NODES.map((n) => (
          <g key={n.key}>
            <circle cx={n.x} cy={n.y} r={13} fill="none" stroke={halo(n.tone)} strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r={7} fill={hex(n.tone)} />
            <text x={n.lx} y={n.ly} textAnchor={n.anchor} className="loop-label-k">{n.label}</text>
            <text x={n.lx} y={n.ly + 15} textAnchor={n.anchor} className="loop-label-sub">{n.sub}</text>
          </g>
        ))}
        <text x={C} y={C - 4} textAnchor="middle" className="loop-center-k">the loop</text>
        <text x={C} y={C + 15} textAnchor="middle" className="loop-center-sub">it compounds</text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Append styles to `app/sirius-design.css`** (under the `.sd` scope, near the other section visuals)

```css
/* §4 — loop flywheel */
.sd .loop-svg { width: 100%; max-width: 420px; height: auto; margin-inline: auto; display: block; }
.sd .loop-flow {
  stroke-dasharray: 22 78;
  stroke-dashoffset: 0;
  animation: sd-loop-flow 7s linear infinite;
}
.sd .loop-label-k {
  fill: var(--color-ink-1, #f6efdf);
  font-family: var(--font-body), system-ui, sans-serif;
  font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
}
.sd .loop-label-sub {
  fill: var(--color-ink-3, rgba(206,208,197,.74));
  font-family: var(--font-body), system-ui, sans-serif;
  font-size: 11px;
}
.sd .loop-center-k {
  fill: var(--color-accent, #d9b978);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
}
.sd .loop-center-sub {
  fill: var(--color-ink-3, rgba(206,208,197,.74));
  font-family: var(--font-body), system-ui, sans-serif; font-size: 12px;
}
@keyframes sd-loop-flow { to { stroke-dashoffset: -100; } }
@media (prefers-reduced-motion: reduce) {
  .sd .loop-flow { animation: none; }
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/loop-flywheel.tsx && npm run build`
Expected: PASS. (Component isn't mounted yet; wired in Task 8.)

- [ ] **Step 4: Commit**

```bash
git add components/sirius/loop-flywheel.tsx app/sirius-design.css
git commit -m "feat(landing): loop flywheel visual for the information/operation loop

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: The per-employee "team constellation" visual

**Files:**
- Create: `components/sirius/team-constellation.tsx`
- Modify: `app/sirius-design.css` (append `.team-*` block)

**Interfaces:**
- Produces: `export function TeamConstellation({ className }: { className?: string })` — `role="img"` SVG: five small person-orbs on a ring, each linked to a central org orb, conveying "each person's Sirius feeds the shared brain." Static (no required motion); the central orb may breathe via the existing reduced-motion guard.

- [ ] **Step 1: Create the component**

```tsx
// components/sirius/team-constellation.tsx
// §5 visual — each person's Sirius (outer cyan nodes) feeds the shared org brain
// (center gold). Lines carry the work inward. Calm and glanceable, secondary to copy.
const C = 200;
const R = 132;
const PEOPLE = [
  { initials: "AR", angle: -90 },
  { initials: "JL", angle: -18 },
  { initials: "MK", angle: 54 },
  { initials: "TC", angle: 126 },
  { initials: "PS", angle: 198 },
];
const rad = (deg: number) => (deg * Math.PI) / 180;

export function TeamConstellation({ className }: { className?: string }) {
  const pts = PEOPLE.map((p) => ({ ...p, x: C + R * Math.cos(rad(p.angle)), y: C + R * Math.sin(rad(p.angle)) }));
  return (
    <div
      className={className}
      role="img"
      aria-label="Five people, each with their own Sirius, all connected to one shared brain at the centre — every person's work feeds the whole company's picture."
    >
      <svg viewBox="0 0 400 400" className="team-svg" aria-hidden="true">
        {pts.map((p) => (
          <line key={`l-${p.initials}`} x1={p.x} y1={p.y} x2={C} y2={C} stroke="rgba(108,216,255,.22)" strokeWidth="1.25" />
        ))}
        {pts.map((p) => (
          <g key={p.initials}>
            <circle cx={p.x} cy={p.y} r={22} fill="rgba(108,216,255,.08)" stroke="rgba(108,216,255,.45)" strokeWidth="1.25" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" className="team-initials">{p.initials}</text>
          </g>
        ))}
        <circle cx={C} cy={C} r={40} fill="rgba(217,185,120,.10)" stroke="rgba(217,185,120,.55)" strokeWidth="1.5" />
        <circle cx={C} cy={C} r={9} fill="#d9b978" />
        <text x={C} y={C + 60} textAnchor="middle" className="team-center-sub">the shared brain</text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Append styles to `app/sirius-design.css`**

```css
/* §5 — team constellation */
.sd .team-svg { width: 100%; max-width: 420px; height: auto; margin-inline: auto; display: block; }
.sd .team-initials {
  fill: var(--color-ink-1, #f6efdf);
  font-family: var(--font-body), system-ui, sans-serif; font-size: 13px; font-weight: 600;
}
.sd .team-center-sub {
  fill: var(--color-accent, #d9b978);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/team-constellation.tsx && npm run build`
Expected: PASS. (Mounted in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add components/sirius/team-constellation.tsx app/sirius-design.css
git commit -m "feat(landing): team constellation visual for per-employee Sirius

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Chrome — header nav + Request-access CTA + hero CTAs

Swap the download-driven chrome for Request-access. The header CTA becomes a plain anchor to `#cta` (the recovered `WaitlistForm` auto-focuses when an `a[href="#cta"]` is clicked). Hero CTAs: primary "Request access" → `#cta`, ghost "See it work" → `#knows`.

**Files:**
- Modify: `components/layout/site-header.tsx`
- Modify: `components/sirius-design/landing.tsx` (the `NAV_LINKS` const and `CTAs` function)

**Interfaces:**
- Consumes: `landingContent.nav`, `landingContent.requestCta`, `landingContent.meta.wordmark`.

- [ ] **Step 1: Update the header**

In `components/layout/site-header.tsx`, replace the import of `HeaderDownload` and its usage. Change the destructure and the CTA slot:

Replace:
```tsx
import { HeaderDownload } from "@/components/layout/header-download";
```
with:
```tsx
import { ScrollLink } from "@/components/layout/scroll-link";
```

Replace:
```tsx
  const { meta, nav, downloadCta } = landingContent;
```
with:
```tsx
  const { meta, nav, requestCta } = landingContent;
```

Replace:
```tsx
        <div className="flex items-center gap-3 sm:gap-4">
          <HeaderDownload label={downloadCta.label} />
        </div>
```
with:
```tsx
        <div className="flex items-center gap-3 sm:gap-4">
          <ScrollLink
            id="cta"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[var(--color-accent)] outline-none transition-colors hover:text-[var(--color-accent-strong)] focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
          >
            {requestCta.label}
            <span aria-hidden="true" className="inline-flex motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5">→</span>
          </ScrollLink>
        </div>
```

- [ ] **Step 2: Update `NAV_LINKS` and `CTAs` in `components/sirius-design/landing.tsx`**

Replace the `NAV_LINKS` const:
```tsx
const NAV_LINKS = [
  { id: "how-it-learns", label: "How it learns you" },
  { id: "while-you-sleep", label: "What it does" },
  { id: "pricing", label: "Pricing" },
];
```
with:
```tsx
const NAV_LINKS = [
  { id: "knows", label: "What it knows" },
  { id: "does", label: "What it does" },
  { id: "loop", label: "The loop" },
  { id: "team", label: "For your team" },
];
```

Replace the `CTAs` function:
```tsx
function CTAs() {
  return (
    <div className="cta-row">
      <DownloadButton />
      <ScrollLink id="how-it-learns" className="btn btn-ghost">
        See it work
        <span className="arrow" aria-hidden="true"> →</span>
      </ScrollLink>
    </div>
  );
}
```
with:
```tsx
function CTAs() {
  const { requestCta } = landingContent;
  return (
    <div className="cta-row">
      <ScrollLink id="cta" className="btn btn-primary">
        {requestCta.label}
      </ScrollLink>
      <ScrollLink id="knows" className="btn btn-ghost">
        See it work
        <span className="arrow" aria-hidden="true"> →</span>
      </ScrollLink>
    </div>
  );
}
```

Then remove the now-unused import `import { DownloadButton } from "@/components/ui/download-button";` from `landing.tsx` **only if** no other function in the file still uses it (the hero CTAs were its only use in this file besides PricingSection — PricingSection still exists until Task 11, so KEEP the import for now). Leave the import; Task 11 removes it with PricingSection.

- [ ] **Step 3: Update the hero proof line** (it still says "Runs entirely on your Mac")

In `SiriusHero`, replace the proof block:
```tsx
          <div className="proof reveal" style={d(0.54)}>
            <span className="proof-line">Free to start</span>
            <span className="proof-dot" aria-hidden="true" />
            <span className="proof-line">Runs entirely on your Mac</span>
          </div>
```
with:
```tsx
          <div className="proof reveal" style={d(0.54)}>
            <span className="proof-line">{landingContent.hero.proof}</span>
          </div>
```

- [ ] **Step 4: Verify + screenshot the header/hero**

Run: `npx tsc --noEmit && npx eslint components/layout/site-header.tsx components/sirius-design/landing.tsx && npm run build`
Expected: PASS. Screenshot `/` — header shows "Request access", hero shows the new headline ("It knows how your business runs. So it runs it.") and a "Request access" primary button.

- [ ] **Step 5: Commit**

```bash
git add components/layout/site-header.tsx components/sirius-design/landing.tsx
git commit -m "feat(landing): request-access chrome + new nav anchors + hero CTAs

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Information layer section (§2)

Rename `LearnsYouSection` → `InformationLayerSection`, anchor `#knows`, source `informationLayer`. Keeps the `WorldGraph` visual.

**Files:**
- Modify: `components/sirius-design/landing.tsx` (the `LearnsYouSection` function)
- Modify: `app/page.tsx` (import + usage rename) — done in Task 12; for now keep the old export name as an alias is unnecessary. To keep the build green, **rename and update `app/page.tsx`'s import in this task** (one-line change).

- [ ] **Step 1: Replace the `LearnsYouSection` function**

```tsx
/* ── §2 · Information layer — "What it knows" ────────────────────────── */
export function InformationLayerSection() {
  const { eyebrow, title, lead, pillars } = landingContent.informationLayer;
  return (
    <section id="knows" className="section" data-screen-label="What it knows">
      <div className="container">
        <div className="learns">
          <div>
            <SectionLabel index="01" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
            <div className="pillars">
              {pillars.map((p, i) => (
                <div key={p.title} className="pillar reveal" style={d(0.18 + 0.06 * i)}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={d(0.16)}>
            <WorldGraph className="world-graph" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update the import name in `app/page.tsx`**

Change `LearnsYouSection` → `InformationLayerSection` in both the import list and the JSX (`<LearnsYouSection />` → `<InformationLayerSection />`).

- [ ] **Step 3: Verify + screenshot**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx app/page.tsx && npm run build`
Expected: PASS. Screenshot — §2 reads "One picture of the whole business." with the world-graph.

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/landing.tsx app/page.tsx
git commit -m "feat(landing): §2 information layer section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Operation layer section (§3)

Replace `WhileYouSleepSection` → `OperationLayerSection`: header from `operationLayer` + the `JobsRoster`. Drop the time-of-day timeline (off-message for a company OS). Retitle `RelationshipsSection` so it reads as the concrete operation-layer example that follows.

**Files:**
- Modify: `components/sirius-design/landing.tsx` (the `WhileYouSleepSection` function)
- Modify: `app/page.tsx` (import + usage rename; reorder in Task 12)
- Modify: `components/sections/relationships.tsx` (SectionLabel only)

- [ ] **Step 1: Replace `WhileYouSleepSection`**

```tsx
/* ── §3 · Operation layer — "What it does" ───────────────────────────── */
export function OperationLayerSection() {
  const { eyebrow, title, lead } = landingContent.operationLayer;
  return (
    <section id="does" className="section band-deep" data-screen-label="What it does">
      <div className="container">
        <div className="section-head">
          <SectionLabel index="02" className="reveal" style={d(0)}>
            {eyebrow}
          </SectionLabel>
          <h2 className="section-title reveal" style={d(0.06)}>
            {title}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {lead}
          </p>
        </div>
        <div className="reveal" style={d(0.16)}>
          <JobsRoster />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Retitle `RelationshipsSection`** as the example beat

In `components/sections/relationships.tsx`, change the `SectionLabel`:
```tsx
            <SectionLabel index="02">{eyebrow}</SectionLabel>
```
to:
```tsx
            <SectionLabel index="03">{eyebrow}</SectionLabel>
```
(`eyebrow` now reads "one gap, closed" from the new content, so it presents as a concrete example under the operation layer.)

- [ ] **Step 3: Update `app/page.tsx` import/usage**

`WhileYouSleepSection` → `OperationLayerSection` in import and JSX. (Final ordering happens in Task 12; just keep it compiling here.)

- [ ] **Step 4: Verify + screenshot**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx components/sections/relationships.tsx app/page.tsx && npm run build`
Expected: PASS. Screenshot — §3 reads "It closes the gaps it finds." with the jobs roster, then the Acme follow-up card as the example.

- [ ] **Step 5: Commit**

```bash
git add components/sirius-design/landing.tsx components/sections/relationships.tsx app/page.tsx
git commit -m "feat(landing): §3 operation layer (jobs roster + relationship example)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: The loop section (§4)

New section mounting `LoopFlywheel`, centered head, source `theLoop`.

**Files:**
- Modify: `components/sirius-design/landing.tsx` (add `LoopSection`, import `LoopFlywheel`)
- Modify: `app/page.tsx` (import + mount; final order in Task 12)

- [ ] **Step 1: Add the import** at the top of `landing.tsx`:

```tsx
import { LoopFlywheel } from "@/components/sirius/loop-flywheel";
```

- [ ] **Step 2: Add the `LoopSection` function** (place after `OperationLayerSection`)

```tsx
/* ── §4 · The loop ───────────────────────────────────────────────────── */
export function LoopSection() {
  const { eyebrow, title, lead } = landingContent.theLoop;
  return (
    <section id="loop" className="section" data-screen-label="The loop">
      <div className="container">
        <div className="learns">
          <div>
            <SectionLabel index="04" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
          </div>
          <div className="reveal" style={d(0.16)}>
            <LoopFlywheel className="loop-figure" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount it in `app/page.tsx`** — add `LoopSection` to the import list and render `<LoopSection />` after `<OperationLayerSection />` (and after `<RelationshipsSection />`). Final ordering is locked in Task 12; just get it on the page.

- [ ] **Step 4: Verify + screenshot**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx app/page.tsx && npm run build`
Expected: PASS. Screenshot — §4 shows the loop visual with the four nodes; arc animates (and holds still under reduced motion).

- [ ] **Step 5: Commit**

```bash
git add components/sirius-design/landing.tsx app/page.tsx
git commit -m "feat(landing): §4 the loop section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: For-your-team section (§5)

New section mounting `TeamConstellation`, source `perEmployee`.

**Files:**
- Modify: `components/sirius-design/landing.tsx` (add `ForYourTeamSection`, import `TeamConstellation`)
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the import**

```tsx
import { TeamConstellation } from "@/components/sirius/team-constellation";
```

- [ ] **Step 2: Add the `ForYourTeamSection` function**

```tsx
/* ── §5 · For your team ──────────────────────────────────────────────── */
export function ForYourTeamSection() {
  const { eyebrow, title, lead } = landingContent.perEmployee;
  return (
    <section id="team" className="section band-deep" data-screen-label="For your team">
      <div className="container">
        <div className="learns">
          <div className="reveal" style={d(0.16)}>
            <TeamConstellation className="team-figure" />
          </div>
          <div>
            <SectionLabel index="05" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount in `app/page.tsx`** — import `ForYourTeamSection`, render `<ForYourTeamSection />` after `<LoopSection />`.

- [ ] **Step 4: Verify + screenshot**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx app/page.tsx && npm run build`
Expected: PASS. Screenshot — §5 reads "Everyone gets their own Sirius." with the constellation visual.

- [ ] **Step 5: Commit**

```bash
git add components/sirius-design/landing.tsx app/page.tsx
git commit -m "feat(landing): §5 for-your-team section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Maker quote section (§7) + final CTA → Request access (§8)

Add a small maker section (currently `landingContent.maker` is unrendered), and convert the final CTA to the recovered `WaitlistForm`.

**Files:**
- Modify: `components/sirius-design/landing.tsx` (add `MakerSection`)
- Modify: `components/sections/final-cta.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add `MakerSection`** to `landing.tsx`

```tsx
/* ── §7 · Maker quote ────────────────────────────────────────────────── */
export function MakerSection() {
  const { quote, signature } = landingContent.maker;
  return (
    <section className="section section-tight" data-screen-label="Why we built it">
      <div className="container">
        <figure className="mx-auto max-w-[60ch] text-center">
          <blockquote className="font-display reveal text-[clamp(1.4rem,3vw,2.1rem)] font-light leading-[1.3] tracking-[-0.015em] text-[var(--color-ink-1)]" style={d(0)}>
            “{quote}”
          </blockquote>
          <figcaption className="reveal mt-6 text-[13px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]" style={d(0.1)}>
            {signature}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Convert `final-cta.tsx` to the WaitlistForm**

Replace the file's import and CTA block. Change:
```tsx
import { DownloadButton } from "@/components/ui/download-button";
```
to:
```tsx
import { WaitlistForm } from "@/components/ui/waitlist-form";
```

Replace:
```tsx
        <div className="reveal mt-12 flex flex-col items-center gap-4" style={{ "--d": "0.12s" } as CSSProperties}>
          <DownloadButton label={cta.button} />
          <p className="text-[13px] leading-5 text-[var(--color-ink-3)]">
            {cta.sub}
          </p>
        </div>
```
with:
```tsx
        <div className="reveal mt-12 flex w-full max-w-[440px] flex-col items-center gap-4" style={{ "--d": "0.12s" } as CSSProperties}>
          <WaitlistForm />
          <p className="text-[13px] leading-5 text-[var(--color-ink-3)]">
            {cta.sub}
          </p>
        </div>
```

(`cta.button` is no longer used in this file — that's fine; the form provides its own "Request access" label.)

- [ ] **Step 3: Mount `MakerSection` in `app/page.tsx`** before `<FinalCtaSection />`. (Final order locked in Task 12.)

- [ ] **Step 4: Verify + screenshot**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx components/sections/final-cta.tsx app/page.tsx && npm run build`
Expected: PASS. Screenshot — maker quote renders; final CTA shows the inline Request-access email field; clicking the header "Request access" scrolls to it and focuses the input.

- [ ] **Step 5: Commit**

```bash
git add components/sirius-design/landing.tsx components/sections/final-cta.tsx app/page.tsx
git commit -m "feat(landing): maker quote + final CTA as request-access form

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Final page assembly + footer + remove dead sections

Lock the section order, update the footer nav anchors, and delete the removed sections (`RoutingSection`, `PricingSection`, `LocalSection` and their glyph helpers) plus their dead content keys and the download infrastructure.

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sirius-design/landing.tsx` (delete `RoutingSection`, `PricingSection`, `LocalSection`, `LockGlyph`, `CloudGlyph`, `withAccent` if now unused, and the `DownloadButton` import)
- Modify: `content/landing.ts` (delete the DEPRECATED block + `howItLearns`/`whileYouSleep`/`rightBrain`/`pricing`/`local`/`downloadCta`)
- Modify: `app/layout.tsx` (remove `DownloadProvider`)
- Delete: `components/ui/download-button.tsx`, `components/ui/download-modal.tsx`, `components/layout/header-download.tsx`, `app/api/free-download/route.ts`
- Modify: `lib/airtable.ts` (remove `countDownloads`, `downloadExists`, `createDownload` and the unused `LIMIT`/download types they need — only those used solely by free-download)

- [ ] **Step 1: Set the final `app/page.tsx` assembly**

```tsx
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/ui/section-divider";
import {
  SiriusHero,
  InformationLayerSection,
  OperationLayerSection,
  LoopSection,
  ForYourTeamSection,
  MakerSection,
  SiriusFooter,
} from "@/components/sirius-design/landing";
import { RelationshipsSection } from "@/components/sections/relationships";
import { OneAppSection } from "@/components/sections/one-app";
import { FinalCtaSection } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <SiteHeader />
      <SiriusHero />
      <SectionDivider />
      <InformationLayerSection />
      <OperationLayerSection />
      <RelationshipsSection />
      <LoopSection />
      <ForYourTeamSection />
      <OneAppSection />
      <SectionDivider />
      <MakerSection />
      <FinalCtaSection />
      <SiriusFooter />
    </main>
  );
}
```

- [ ] **Step 2: Delete dead section functions in `landing.tsx`**

Remove `RoutingSection`, `PricingSection`, `LocalSection`, `LockGlyph`, `CloudGlyph`. Remove `import { DownloadButton } ...`. If `withAccent` is no longer referenced (it was only used by `RoutingSection`), remove it too. Run eslint to confirm no unused-symbol errors.

- [ ] **Step 3: Update the footer nav** — the footer maps `NAV_LINKS` (already updated in Task 5) through `ScrollLink`; confirm `© 2026 Sirius` and the wordmark read "Sirius". No change needed beyond verifying.

- [ ] **Step 4: Remove the DEPRECATED block from `content/landing.ts`** (everything under the `// ── DEPRECATED` comment: `downloadCta`, `howItLearns`, `whileYouSleep`, `rightBrain`, `pricing`, `local`).

- [ ] **Step 5: Remove the download modal/provider**

In `app/layout.tsx`, remove `import { DownloadProvider } ...` and unwrap `<DownloadProvider>{children}</DownloadProvider>` → `{children}`. Then delete the files:
```bash
git rm components/ui/download-button.tsx components/ui/download-modal.tsx components/layout/header-download.tsx app/api/free-download/route.ts
```

- [ ] **Step 6: Prune download-only helpers in `lib/airtable.ts`**

Remove `countDownloads`, `downloadExists`, `createDownload` and any types/consts used **only** by them. Keep `findByEmail`, `createEntry`, `updateName` (used by `/api/waitlist`).

- [ ] **Step 7: Verify the whole site builds clean**

Run: `npx eslint . && npx tsc --noEmit && npm run build`
Expected: PASS, no unused-symbol or missing-import errors; `/` and `/demo` prerender static. Grep to confirm nothing dangling:
```bash
grep -rn "DownloadButton\|useDownloadModal\|DownloadProvider\|free-download\|whileYouSleep\|rightBrain\|howItLearns\|\.pricing\|landingContent.local" app components content lib --include="*.tsx" --include="*.ts"
```
Expected: no matches.

- [ ] **Step 8: Full-page screenshot pass** against the spec — verify the eight-section flow top to bottom on desktop and mobile (mind the headless ~500px min-width clamp; use the iframe workaround for mobile shots).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor(landing): final assembly; remove pricing/local/routing/download surfaces

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Docs + positioning alignment

Bring the standing docs in line with the company-OS positioning.

**Files:**
- Modify: `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`

- [ ] **Step 1: Update `PRODUCT.md`** — replace the "AI cofounder" one-liner and any solo framing with the operating-system positioning (information + operation layers, the loop, per-employee Sirius). Keep the workflows-framing note ("learns YOU").

- [ ] **Step 2: Update `DESIGN.md`** — update the product description/overview lines to the OS positioning; the visual system (palette, type, motion) is unchanged.

- [ ] **Step 3: Update `CLAUDE.md`** — in the Audience section, change the buyer to "the founder/exec deciding for the whole org" and soften the "runs on your Mac" implication (local is now table-stakes, not a hero claim). Do **not** touch the real-app ground-truth section (that documents `../sirius/`, unchanged).

- [ ] **Step 4: Verify build still green** (docs-only, but confirm):

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md PRODUCT.md CLAUDE.md
git commit -m "docs: align positioning to the business-OS redesign

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (completed against the spec)

**Spec coverage:** Hero → Task 5; Information layer (§2) → Task 6; Operation layer (§3, jobs + relationship example) → Tasks 2/7; The loop (§4) → Tasks 3/8; Per-employee (§5) → Tasks 4/9; Integrations (§6, `OneAppSection`/`stack`) → Task 2 copy + already mounted; Maker (§7) → Task 10; Request-access CTA (§8) → Tasks 1/10; nav/chrome → Task 5; remove pricing/local/routing/download → Task 11; docs → Task 12. All spec sections map to a task.

**Placeholder scan:** No TBD/TODO; every code step shows full code; the request-access backend is the existing `/api/waitlist` (no stub).

**Type consistency:** `operationLayer.jobs` shape matches the old `whileYouSleep.jobs` exactly (group/name/desc/trigger/activity/status), so `JobsRoster` keeps working after the one-line source swap. New section component names (`InformationLayerSection`, `OperationLayerSection`, `LoopSection`, `ForYourTeamSection`, `MakerSection`) are used consistently across `landing.tsx` and `app/page.tsx`. `requestCta`/`nav` consumed in header and hero match the content definition. Each task leaves `tsc`/`build` green (deprecated keys retained until Task 11).
