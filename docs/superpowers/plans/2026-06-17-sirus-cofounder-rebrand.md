# Sirus "AI Cofounder" Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the landing page from "Sirius, one assistant" to **"Sirus, your AI cofounder"** — new name, new positioning, new section spine, with §2/§4 visuals reproducing the real app components.

**Architecture:** All copy lives in `content/landing.ts` (single source of truth). Section components in `components/sirius-design/landing.tsx` and `components/sections/*` render it. The page spine is composed in `app/page.tsx`. New section components are added for §1 (learns you), §2 (relationships), §4 (while you sleep). The reliability section is removed. Visual style for §2/§4 cards is ported verbatim from the validated mockups in `.superpowers/brainstorm/12595-1781690355/content/` using the real app's hex tokens.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind + a scoped design-system CSS (`app/sirius-design.css`, `.sd` prefix), `motion/react` for reveals.

**Verification model (no test runner in this repo):** Each task verifies with `npx tsc --noEmit`, `npx eslint <changed files>`, and (for visual tasks) `npm run build` + a screenshot. Commit after each task.

**Design source of truth for ported visuals:** the persisted mockups —
- `.superpowers/brainstorm/12595-1781690355/content/s2-real-card.html` (§2 EmailApprovalCard)
- `.superpowers/brainstorm/12595-1781690355/content/s4-real-roster-v3.html` (§4 Jobs roster)
- `.superpowers/brainstorm/12595-1781690355/content/s3-orbit-v2.html` (§3 orbit set)
- `.superpowers/brainstorm/12595-1781690355/content/s5-privacy.html` (§5 option A)
- `.superpowers/brainstorm/33399-1781548956/content/s1-world-graph.html` (§1 option B "Connected web")

**Spec:** `docs/superpowers/specs/2026-06-16-sirus-cofounder-rebrand-design.md`

---

## File Structure

**Modified:**
- `content/landing.ts` — full copy rewrite + new data shapes (`howItLearns`, `relationships`, `stack`, `whileYouSleep`).
- `app/layout.tsx` — metadata title/description rename.
- `app/opengraph-image.alt.txt`, `app/twitter-image.alt.txt` — rename.
- `components/sirius-design/landing.tsx` — hero copy, `DaySection`→repurposed, `LocalSection` copy+visual, footer wordmark; export new `LearnsYouSection`, `WhileYouSleepSection`.
- `components/sirius-design/logos.tsx` — founder-tool integration set.
- `components/sirius/brand-logos.tsx` — add `GoogleDrive`, `Stripe`, `Granola` marks + colors.
- `components/sirius/tool-orbit.tsx` — new `APPS` set.
- `components/sections/one-app.tsx` — copy keys (`stack`).
- `components/sections/final-cta.tsx` — (no code change; copy via content).
- `app/page.tsx` — new section order; drop `ReliabilitySection`/`RoutingSection`-as-is decisions.
- `app/sirius-design.css` — small additions for §1 pillars + graph.

**Created:**
- `components/sections/relationships.tsx` — §2 (real EmailApprovalCard reproduction).
- `components/sections/jobs-roster.tsx` — §4 Jobs roster (real JobRow reproduction), consumed by `WhileYouSleepSection`.
- `components/sirius/world-graph.tsx` — §1 connected-web SVG graph.

---

## Phase 0 — Baseline

### Task 0: Capture the current state

**Files:** none (read-only)

- [ ] **Step 1: Confirm clean tree & build green**

Run: `git status --short && npx tsc --noEmit && npm run build`
Expected: clean tree; tsc no errors; build prerenders `/` and `/demo`.

- [ ] **Step 2: Baseline screenshot**

Build is already done. Start the app and screenshot the current `/` for before/after comparison (per the screenshot-before-layout-changes workflow). Save the reference. No commit.

---

## Phase 1 — Rename Sirius → Sirus (landing surfaces only)

> Blog post bodies (`content/posts/*.mdx`), `lib/blog.ts`, and logo image files are OUT OF SCOPE (separate follow-up). Only landing-page surfaces change here.

### Task 1: Rename in metadata + alt text

**Files:**
- Modify: `app/layout.tsx:28-45`
- Modify: `app/opengraph-image.alt.txt`
- Modify: `app/twitter-image.alt.txt`

- [ ] **Step 1: Update `app/layout.tsx` metadata**

Replace the `metadata` object's strings (lines 28-45) with:

```tsx
export const metadata: Metadata = {
  title: "Sirus: your AI cofounder",
  description:
    "Sirus learns your business — sits in on meetings, reads your inbox and CRM — then runs the work across the tools you already use. On your Mac.",
  metadataBase: new URL("https://sirius.so"),
  openGraph: {
    title: "Sirus: your AI cofounder",
    description:
      "Sirus learns your business and runs the work across the tools you already use. On your Mac.",
    url: "https://sirius.so",
    siteName: "Sirus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirus: your AI cofounder",
    description:
      "Sirus learns your business and runs the work across the tools you already use. On your Mac.",
  },
};
```

(Leave `metadataBase` / `url` domain as-is — domain change is out of scope.)

- [ ] **Step 2: Update the two alt-text files**

Read each file first, then replace every `Sirius` with `Sirus` (keep the rest of the sentence intact).

Run: `cat app/opengraph-image.alt.txt app/twitter-image.alt.txt`
Then edit both so the brand reads `Sirus`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint app/layout.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/opengraph-image.alt.txt app/twitter-image.alt.txt
git commit -m "rebrand: rename Sirius -> Sirus in metadata + social alt text"
```

### Task 2: Rename in shared chrome components

**Files:**
- Modify: `components/ui/download-modal.tsx` (any "Sirius" UI copy)
- Modify: `components/sirius/orb.tsx` (aria-label/comment "Sirius")
- Modify: `components/sirius/voice-orb.tsx` (any "Sirius" copy/aria)

- [ ] **Step 1: Find the occurrences**

Run: `grep -n "Sirius" components/ui/download-modal.tsx components/sirius/orb.tsx components/sirius/voice-orb.tsx`

- [ ] **Step 2: Replace user-visible `Sirius` → `Sirus`**

For each hit that is user-visible text or an `aria-label`, change `Sirius` → `Sirus`. Leave any code identifiers untouched (there should be none).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/ui/download-modal.tsx components/sirius/orb.tsx components/sirius/voice-orb.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/download-modal.tsx components/sirius/orb.tsx components/sirius/voice-orb.tsx
git commit -m "rebrand: rename Sirius -> Sirus in shared chrome"
```

> Note: `content/landing.ts` and `components/sirius-design/landing.tsx` also contain "Sirius" — those are handled in Phase 2/3 as part of the copy rewrite, so they're not touched here.

---

## Phase 2 — Rewrite the copy (`content/landing.ts`)

### Task 3: Replace `content/landing.ts` with the new cofounder copy

**Files:**
- Modify: `content/landing.ts` (full rewrite)

This is the single source of truth. The shape changes: `whatItDoes`→`howItLearns` (pillars) is NEW; `relationships` NEW; `oneApp`→`stack` (renamed key, same fields + extras); `learnsOnce` REMOVED; `whatItDoes` timeline content MOVES into `whileYouSleep`.

- [ ] **Step 1: Write the new file**

Replace the entire contents of `content/landing.ts` with:

```ts
// Landing copy — see docs/superpowers/specs/2026-06-16-sirus-cofounder-rebrand-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirus",
    tagline: "Your AI cofounder. It learns the business, then runs it with you.",
  },
  integrations: {
    label: "Works inside the tools you run the business in",
    tools: ["Gmail", "Calendar", "Google Drive", "Notion", "Slack", "Superhuman", "Granola", "HubSpot", "Stripe", "Zapier"],
    more: "+ anything with an API",
  },
  nav: [
    { id: "how-it-learns", label: "How it learns you" },
    { id: "while-you-sleep", label: "What it does" },
    { id: "pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ],
  downloadCta: { label: "Download for Mac", href: "#cta" },
  hero: {
    eyebrow: "Your AI cofounder",
    title: "Stop explaining yourself.",
    titleAccent: "Your cofounder already knows.",
    description:
      "Sirus sits in on your meetings, reads your inbox and CRM, and builds the full picture — you, your business, every client — then runs the work across the tools you already use.",
    proof: "Free to start — and it runs on your Mac.",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  // §1 — how it learns you (3 pillars + connected-web graph). Pure outcome.
  howItLearns: {
    eyebrow: "How it learns you",
    title: "It learns the business on its own.",
    lead: "Every other assistant makes you feed it. Sirus picks it up itself — so it just knows you, your business, and everyone you work with.",
    pillars: [
      { title: "Sits in on your meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next — no notes to write." },
      { title: "Keeps up with your clients", body: "It follows every deal, email, and conversation, so you're never the only one holding it all in your head." },
      { title: "It just knows", body: "Ask it about a deal, a person, or a promise you made three weeks ago — it already has the answer." },
    ],
  },
  // §2 — never drop a client (renders the real EmailApprovalCard).
  relationships: {
    eyebrow: "Never drop a client",
    title: "It keeps every relationship warm.",
    body: "Sirus knows when you last spoke to each client, what you promised, and who's gone quiet. It drafts the follow-up, sends it at the right moment, and surfaces the prospects worth chasing — or just tells you who to call today.",
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
  // §3 — across your stack (recast oneApp; consumed by OneAppSection).
  stack: {
    eyebrow: "One cofounder, every tool",
    title: "It works inside your whole stack.",
    body: "Gmail, Calendar, Drive, Notion, your CRM — Sirus operates inside the tools you already use, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them.",
    replaces: ["personal CRM", "executive assistant", "research analyst", "outreach", "ops"],
    becomes: "Sirus",
  },
  // §4 — works while you sleep: real Jobs roster + the day timeline.
  whileYouSleep: {
    eyebrow: "Works while you sleep",
    title: "It's already handling these.",
    lead: "Hand it a job and it owns it — running on its own while you're asleep, commuting, or in another meeting. A few of the jobs it's keeping for founders right now:",
    // Generalized recurring jobs (real Jobs-roster model). group ∈ Needs you | Active now | Standing by.
    jobs: [
      { group: "Needs you",   name: "Prospect outreach",     desc: "research & write to fresh prospects every night",  trigger: "🕐 nightly",   activity: "awaiting you", status: "awaiting" },
      { group: "Active now",  name: "Inbound triage",        desc: "qualify every new inbound lead and book the demo", trigger: "✉️ on email", activity: "3 running",    status: "running" },
      { group: "Active now",  name: "Deal follow-ups",       desc: "chase any open deal that's gone quiet 5+ days",     trigger: "🕐 daily",     activity: "",             status: "running" },
      { group: "Standing by", name: "Renewal guard",         desc: "flag any account approaching its renewal date",     trigger: "🕐 daily",     activity: "2h ago",       status: "done" },
      { group: "Standing by", name: "Investor update",       desc: "draft the weekly update from live metrics",         trigger: "🕐 Mon 8:00", activity: "3d ago",       status: "done" },
      { group: "Standing by", name: "Watch: lead investor",  desc: "alert & draft the moment a key contact emails",     trigger: "✉️ on email", activity: "5h ago",       status: "done" },
    ],
    cards: [
      { id: "outreach", time: "02:00", when: "while you slept",   title: "The outreach you didn't send", body: "Fifty prospects, each researched and written to by name. You wake up to messages already going out — and a short queue of the few that need you." },
      { id: "morning",  time: "08:00", when: "before you're in",   title: "Caught up before coffee",      body: "It reads last night's replies, your calendar, and what each client is waiting on, then tells you the three things that actually matter today." },
      { id: "brief",    time: "10:45", when: "before your 11:00",  title: "Briefed for the call",         body: "From the last meeting it sat in and every thread since, a one-page brief is waiting in the invite — who they are, what's open, what to push." },
      { id: "client",   time: "14:30", when: "client email lands", title: "Handled before you see it",    body: "It logs what changed, drafts the reply, sends the easy one, and flags the single decision that's actually yours." },
    ],
    close: "Set the boundaries once. After that it just happens — every day, while you're somewhere else.",
  },
  rightBrain: {
    eyebrow: "Better answers, smaller bill",
    title: "It always uses the right brain for the job.",
    body: "Sirus isn't one model. It picks whichever frontier model fits the task, and moves to a sharper one the day it ships. You're never locked in, or stuck on last year's model.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start free.",
    tiers: [
      {
        name: "Free", was: "", price: "$0", priceSuffix: "",
        tagline: "Try your cofounder, free.",
        features: ["Voice, chat, and jobs", "Runs locally on your Mac", "Limited monthly usage"],
        cta: "Download for Mac", featured: false,
      },
      {
        name: "Pro", was: "$30", price: "$20", priceSuffix: "/mo",
        tagline: "The same Sirus, all day.",
        features: ["Everything in Free", "Much higher usage limits"],
        cta: "Download for Mac", featured: true,
      },
      {
        name: "Max", was: "", price: "$50", priceSuffix: "/mo",
        tagline: "For founders who run on it.",
        features: ["Everything in Pro", "Top usage limits", "Early access to new features"],
        cta: "Download for Mac", featured: false,
      },
    ],
  },
  local: {
    eyebrow: "Yours alone",
    title: "Your business stays on your Mac.",
    body: "Everything it knows about your clients, your meetings, your conversations, and your files lives on your machine, not our servers. The cloud only listens for the triggers that kick off the work.",
    items: ["Clients", "Meetings", "Conversations", "Files"],
  },
  maker: {
    quote:
      "We didn't want another tool to manage. We wanted a cofounder — someone who already knew the business, kept every client straight, and did the work without being asked twice. Nothing we tried remembered us, so we built the one that does.",
    signature: "— the people building Sirus",
  },
  cta: {
    title: "Meet your cofounder.",
    button: "Download for Mac",
    sub: "macOS · Apple silicon",
  },
  footer: {
    blurb: "Your AI cofounder. It learns the business and runs the work, across the tools you already use. On your Mac.",
  },
} as const;
```

- [ ] **Step 2: Expect type errors (this is intended)**

Run: `npx tsc --noEmit`
Expected: errors in `landing.tsx` / `one-app.tsx` referencing removed keys (`whatItDoes`, `learnsOnce`, `oneApp`). These are fixed in Phase 3+. Do NOT try to fix them here.

- [ ] **Step 3: Commit**

```bash
git add content/landing.ts
git commit -m "rebrand: rewrite landing copy to the AI-cofounder positioning"
```

---

## Phase 3 — Logos & brand marks (founder stack)

### Task 4: Founder-tool integration set in `logos.tsx`

**Files:**
- Modify: `components/sirius-design/logos.tsx:107-122`

The hero strip + footer should show the founder stack. We reuse existing colored marks where present (Gmail, Calendar, Drive, Notion) and add monochrome marks for the rest via `brand-logos.tsx` (Task 5). For simplicity the hero strip uses the colored marks that already exist plus the brand-logos for Slack/HubSpot/Stripe/Zapier/Superhuman/Granola.

- [ ] **Step 1: Import BrandLogo and rebuild the lists**

At the top of `components/sirius-design/logos.tsx`, add:

```tsx
import { BrandLogo, BRAND_COLORS } from "@/components/sirius/brand-logos";
```

Then replace the export block (lines 104-122) with:

```tsx
type LogoEntry = { name: string; Mark: () => ReactElement };

const mono = (name: string): (() => ReactElement) =>
  function Mono() {
    return <BrandLogo name={name} color={BRAND_COLORS[name] ?? "#f6efdf"} className="h-full w-auto" />;
  };

// Hero integration strip — the founder stack, kept short and glanceable.
export const DESIGN_LOGOS: LogoEntry[] = [
  { name: "Gmail", Mark: LogoGmail },
  { name: "Calendar", Mark: LogoCalendar },
  { name: "Google Drive", Mark: LogoGoogleDrive },
  { name: "Notion", Mark: LogoNotion },
  { name: "Slack", Mark: mono("Slack") },
  { name: "HubSpot", Mark: mono("HubSpot") },
];

// Footer carries the fuller set.
export const FOOTER_LOGOS: LogoEntry[] = [
  ...DESIGN_LOGOS,
  { name: "Stripe", Mark: mono("Stripe") },
  { name: "Zapier", Mark: mono("Zapier") },
  { name: "Superhuman", Mark: mono("Superhuman") },
];
```

> The old `LogoGithub` / `LogoDiscord` / `LogoWord` / `LogoGoogleDocs` / `LogoGoogleSheets` functions may now be unused. Delete any that ESLint flags as unused in Step 3.

- [ ] **Step 2: Brand-logos must have the referenced names**

This depends on Task 5 adding `Stripe`, `Granola`, `GoogleDrive` to `brand-logos.tsx`. `Slack`, `HubSpot`, `Zapier`, `Superhuman` already exist there. Do Task 5 first if `BrandLogo` returns null for `Stripe`.

- [ ] **Step 3: Verify**

Run: `npx eslint components/sirius-design/logos.tsx`
Expected: no errors (remove any now-unused logo functions it flags).

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/logos.tsx
git commit -m "rebrand: founder-stack integration logos in hero + footer"
```

### Task 5: Add missing brand marks (Drive, Stripe, Granola)

**Files:**
- Modify: `components/sirius/brand-logos.tsx:7-89`

- [ ] **Step 1: Add three brands to the `BRANDS` map**

Inside the `BRANDS` object (after `Perplexity`), add:

```tsx
  Stripe: {
    viewBox: "0 0 24 24",
    paths: [
      "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
    ],
  },
  GoogleDrive: {
    viewBox: "0 0 24 24",
    paths: [
      "M7.71 3.5 1.15 15l3.43 5.94 6.56-11.44L7.71 3.5zm8.58 0H9.42l6.56 11.5h6.87L16.29 3.5zM5.06 16 1.62 21.94l.94.06h12.3L18.3 16H5.06z",
    ],
  },
  // Granola has no official simple-icons mark; use a clean lettermark tile until
  // an official SVG is supplied. (Tracked in spec §6 out-of-scope: logo assets.)
  Granola: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.2 4.9 8.5h-2.7L12 10.9l-2.2 3.8H7.1L12 6.2z",
    ],
  },
```

- [ ] **Step 2: Add brand colors**

In the `BRAND_COLORS` map, add:

```tsx
  Stripe: "#635BFF",
  Slack: "#E01E5A",
  Notion: "#F6EFDF",
  Gmail: "#EA4335",
  Calendar: "#4285F4",
  "Google Drive": "#1FA463",
  GoogleDrive: "#1FA463",
  Granola: "#9BD6A8",
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/brand-logos.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sirius/brand-logos.tsx
git commit -m "rebrand: add Stripe, Google Drive, Granola brand marks + colors"
```

### Task 6: Re-logo the §3 tool orbit

**Files:**
- Modify: `components/sirius/tool-orbit.tsx:9-11`

- [ ] **Step 1: Replace the `APPS` set**

Replace lines 9-11 with:

```tsx
// The founder stack Sirus operates inside. Names must match keys in
// brand-logos.tsx. Mixed native/aspirational — the "+ anything with an API"
// hedge in the hero/footer covers it.
const APPS = ["Gmail", "Notion", "Slack", "Superhuman", "Granola", "HubSpot", "Stripe", "Zapier"];
```

- [ ] **Step 2: Verify the orbit renders all marks**

Run: `npx tsc --noEmit && npx eslint components/sirius/tool-orbit.tsx`
Expected: no errors. (Each name resolves in `brand-logos.tsx`; `Gmail`/`Notion`/`Slack`/`Superhuman`/`HubSpot`/`Zapier` exist, `Granola`/`Stripe` added in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add components/sirius/tool-orbit.tsx
git commit -m "rebrand: founder-stack tools in the §3 orbit"
```

---

## Phase 4 — §1 "How it learns you" (pillars + connected-web graph)

### Task 7: World-graph SVG component

**Files:**
- Create: `components/sirius/world-graph.tsx`

Ports the "Connected web" (Option B) mockup. Nodes are real-world things linked to each other and to "You". Uses the landing `.sd` gold/cyan tokens via `currentColor`/inline rgba.

- [ ] **Step 1: Create the component**

```tsx
// §1 visual — the "your world" connected web. Nodes are real-world things
// (people, companies, deals, promises) linked to each other and to YOU. This
// is the one intentional concept visual; labels are never tech terms.
const NODES: Array<{ x: number; y: number; label: string; anchor?: "start" | "middle" | "end" }> = [
  { x: 100, y: 80, label: "Dana", anchor: "middle" },
  { x: 80, y: 160, label: "Acme Co", anchor: "middle" },
  { x: 150, y: 215, label: "Q3 numbers", anchor: "middle" },
  { x: 285, y: 90, label: "Foundry", anchor: "middle" },
  { x: 320, y: 175, label: "Series A", anchor: "middle" },
  { x: 250, y: 40, label: "Intro · Tue", anchor: "middle" },
];

const EDGES: Array<[number, number, number, number]> = [
  [100, 80, 80, 160],
  [80, 160, 150, 210],
  [100, 80, 190, 120],
  [190, 120, 285, 90],
  [285, 90, 320, 175],
  [285, 90, 250, 40],
  [190, 120, 320, 175],
];

export function WorldGraph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 250" className={className} role="img" aria-label="A map of your world that Sirus builds itself">
      {EDGES.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(217,185,120,0.30)" strokeWidth={1} />
      ))}
      {/* You — the cyan core */}
      <circle cx={190} cy={120} r={18} fill="rgba(108,216,255,0.18)" />
      <circle cx={190} cy={120} r={7} fill="#6cd8ff" />
      <text x={190} y={148} textAnchor="middle" fontFamily="var(--font-mono, ui-monospace), monospace" fontSize={10} fill="#6cd8ff">YOU</text>
      {NODES.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={4} fill="#d9b978" />
          <text x={n.x} y={n.y - 10} textAnchor={n.anchor ?? "middle"} fontFamily="var(--font-mono, ui-monospace), monospace" fontSize={10} fill="rgba(199,203,212,0.9)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/world-graph.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sirius/world-graph.tsx
git commit -m "feat(§1): connected-web world-graph visual"
```

### Task 8: `LearnsYouSection` (replaces the old `DaySection` at the §1 slot)

**Files:**
- Modify: `components/sirius-design/landing.tsx` (replace `DaySection` export with `LearnsYouSection`)
- Modify: `app/sirius-design.css` (append pillars styles)

- [ ] **Step 1: Append pillar CSS to `app/sirius-design.css`**

Add at the end of the file:

```css
/* §1 — how it learns you: 3 pillars + world graph */
.sd .learns { display: grid; gap: clamp(28px, 4vw, 56px); grid-template-columns: 1fr; align-items: center; }
@media (min-width: 900px) { .sd .learns { grid-template-columns: 1.1fr 0.9fr; } }
.sd .pillars { display: grid; gap: clamp(16px, 2vw, 24px); margin-top: clamp(24px, 3vh, 36px); }
.sd .pillar { border-top: 1px solid rgba(var(--accent-rgb), 0.16); padding-top: 16px; }
.sd .pillar h3 { font-size: clamp(1.05rem, 1.6vw, 1.25rem); color: var(--ink-1, #f6efdf); margin: 0 0 6px; font-weight: 500; }
.sd .pillar p { color: var(--ink-3, rgba(206,208,197,0.7)); font-size: 0.95rem; line-height: 1.5; margin: 0; }
.sd .world-graph { width: 100%; max-width: 460px; margin-inline: auto; }
```

- [ ] **Step 2: Replace the `DaySection` export in `landing.tsx`**

In `components/sirius-design/landing.tsx`, add the `WorldGraph` import near the other imports:

```tsx
import { WorldGraph } from "@/components/sirius/world-graph";
```

Then replace the entire `export function DaySection() { ... }` block (the `/* ── 1 · A day... */` section) with:

```tsx
/* ── §1 · How it learns you ──────────────────────────────────────────── */
export function LearnsYouSection() {
  const { eyebrow, title, lead, pillars } = landingContent.howItLearns;
  return (
    <section id="how-it-learns" className="section" data-screen-label="How it learns you">
      <div className="container">
        <div className="learns">
          <div>
            <div className="section-eyebrow reveal" style={d(0)}>
              <span className="eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </div>
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
          <div className="reveal" style={d(0.16)} aria-hidden="false">
            <WorldGraph className="world-graph" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx`
Expected: `landing.tsx` no longer references `whatItDoes`; remaining tsc errors are only about `learnsOnce`/`oneApp`/the page import of `DaySection` (fixed in later tasks).

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/landing.tsx app/sirius-design.css
git commit -m "feat(§1): LearnsYouSection with pillars + world graph"
```

---

## Phase 5 — §2 "Never drop a client" (real EmailApprovalCard)

### Task 9: `RelationshipsSection`

**Files:**
- Create: `components/sections/relationships.tsx`

Ports `s2-real-card.html` verbatim into JSX (exact app tokens). Two-column: copy left, the real `EmailApprovalCard` in a "Needs you" lane right.

- [ ] **Step 1: Create the component**

```tsx
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { landingContent } from "@/content/landing";

// App theme tokens (faithful to ../sirius/app/app/globals.css) so the card
// reads as the real product component.
const T = {
  s1: "#2C261D", s2: "#342D23", deep: "#14110D",
  ink1: "#F6EFDF", ink2: "rgba(238,232,218,.84)", ink3: "rgba(206,208,197,.62)", ink4: "rgba(196,199,189,.40)",
  border: "rgba(232,224,200,.14)", borderS: "rgba(232,224,200,.24)", accent: "#d9b978",
};

export function RelationshipsSection() {
  const { eyebrow, title, body, card } = landingContent.relationships;
  return (
    <section id="relationships" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <div className="section-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </div>
            <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2rem,4.4vw,3.2rem)] font-light leading-[0.98] tracking-[-0.025em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-[var(--color-ink-3)]">
              {body}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ background: "#1B1712", borderRadius: 18, padding: "26px 22px", maxWidth: 480, marginInline: "auto", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
              {/* Lane header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 2px 12px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.accent }}>{card.lane}</span>
                <span style={{ height: 1, flex: 1, background: T.border }} />
                <span style={{ fontSize: 11, color: T.ink4 }}>1</span>
              </div>
              {/* EmailApprovalCard */}
              <div style={{ position: "relative", background: T.s1, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.accent}`, borderRadius: 16, padding: 14, boxShadow: "0 6px 18px -16px rgba(0,0,0,.5)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 16, lineHeight: "20px", marginTop: 1 }}>✉️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.accent }}>{card.eyebrow}</div>
                    <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400, fontSize: 15, lineHeight: 1.25, letterSpacing: "-.005em", color: T.ink1 }}>{card.title}</h3>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: T.ink4 }}>{card.why}</div>
                  </div>
                </div>
                {/* email preview */}
                <div style={{ marginTop: 10, borderRadius: 11, border: `1px solid ${T.borderS}`, overflow: "hidden" }}>
                  <div style={{ padding: "9px 11px", background: T.s2, borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                      <span style={{ flexShrink: 0, width: 44, fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.ink3 }}>To</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink1 }}>{card.to}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                      <span style={{ flexShrink: 0, width: 44, fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.ink3 }}>Subject</span>
                      <span style={{ fontSize: 12.5, color: T.ink2 }}>{card.subject}</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px 11px", background: T.deep }}>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: T.ink3 }}>{card.preview}</p>
                  </div>
                </div>
                {/* actions */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 11 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: T.accent, color: "#1a1206" }}>{card.actions[0]}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: "transparent", color: T.ink2, border: `1px solid ${T.borderS}` }}>{card.actions[1]}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: "transparent", color: T.ink3, border: `1px solid ${T.border}` }}>{card.actions[2]}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint components/sections/relationships.tsx`
Expected: no errors in this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/relationships.tsx
git commit -m "feat(§2): RelationshipsSection rendering the real EmailApprovalCard"
```

---

## Phase 6 — §3 "Your whole stack" copy

### Task 10: Point `OneAppSection` at the `stack` key

**Files:**
- Modify: `components/sections/one-app.tsx:7-19`

- [ ] **Step 1: Update the keys + add the body line**

Replace lines 7-19 with:

```tsx
export function OneAppSection() {
  const { eyebrow, title, body } = landingContent.stack;
  return (
    <section id="stack" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionLabel index="03" tone="warm">
              {eyebrow}
            </SectionLabel>
            <h2 className="font-display mt-7 max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-[var(--color-ink-3)]">
              {body}
            </p>
          </Reveal>
```

(Keep the rest of the file — the `ToolOrbit` block and closing tags — unchanged. Update the `id="one-app"` → `id="stack"` as shown.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint components/sections/one-app.tsx`
Expected: no errors in this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/one-app.tsx
git commit -m "feat(§3): point stack section at new copy + body line"
```

---

## Phase 7 — §4 "Works while you sleep" (Jobs roster + day timeline)

### Task 11: Jobs-roster component

**Files:**
- Create: `components/sections/jobs-roster.tsx`

Ports `s4-real-roster-v3.html`. Renders `landingContent.whileYouSleep.jobs` grouped, in the real `JobRow` density.

- [ ] **Step 1: Create the component**

```tsx
import { landingContent } from "@/content/landing";

const T = {
  bg: "#1B1712", s1: "#2C261D", s2: "#342D23",
  ink1: "#F6EFDF", ink3: "rgba(206,208,197,.62)", ink4: "rgba(196,199,189,.40)",
  border: "rgba(232,224,200,.14)", accent: "#d9b978", cyan: "#6cd8ff", success: "#a7dbb2",
};

const GROUP_ORDER = ["Needs you", "Active now", "Standing by"] as const;
const GROUP_COLOR: Record<string, string> = { "Needs you": T.accent, "Active now": T.cyan, "Standing by": T.ink3 };

function StatusDot({ status }: { status: string }) {
  if (status === "running") {
    return <span style={{ width: 12, height: 12, borderRadius: 999, border: `1.5px solid rgba(108,216,255,.25)`, borderTopColor: T.cyan, boxSizing: "border-box", display: "inline-block" }} />;
  }
  const color = status === "awaiting" ? T.accent : T.success;
  const halo = status === "awaiting" ? "rgba(217,185,120,.20)" : "rgba(167,219,178,.18)";
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: `0 0 0 3px ${halo}`, display: "inline-block" }} />;
}

export function JobsRoster() {
  const { jobs } = landingContent.whileYouSleep;
  return (
    <div style={{ background: T.bg, borderRadius: 18, padding: "20px 18px", maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        {GROUP_ORDER.map((group) => {
          const rows = jobs.filter((j) => j.group === group);
          if (rows.length === 0) return null;
          return (
            <div key={group}>
              <div style={{ padding: "12px 16px 6px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: GROUP_COLOR[group] }}>{group}</div>
              {rows.map((j, i) => {
                const last = group === "Standing by" && i === rows.length - 1;
                const activityColor = j.activity === "awaiting you" ? T.accent : j.activity === "3 running" ? T.cyan : T.ink4;
                return (
                  <div key={j.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: last ? "none" : `1px solid ${T.border}`, minHeight: 46 }}>
                    <span style={{ flexShrink: 0, width: 16, display: "inline-flex", justifyContent: "center" }}><StatusDot status={j.status} /></span>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ flexShrink: 0, maxWidth: "48%", fontFamily: "var(--font-display), Georgia, serif", fontSize: 15, letterSpacing: "-.01em", color: T.ink1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.name}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: T.ink3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.desc}</span>
                    </div>
                    <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: T.s2, border: `1px solid ${T.border}`, fontSize: 11, color: T.ink3, whiteSpace: "nowrap" }}>{j.trigger}</span>
                    <span style={{ flexShrink: 0, width: 96, textAlign: "right", fontSize: 12, color: activityColor, whiteSpace: "nowrap" }}>{j.activity}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint components/sections/jobs-roster.tsx`
Expected: no errors in this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/jobs-roster.tsx
git commit -m "feat(§4): Jobs roster reproducing the real JobRow density"
```

### Task 12: `WhileYouSleepSection` (roster + day timeline)

**Files:**
- Modify: `components/sirius-design/landing.tsx` (add `WhileYouSleepSection`; remove `ReliabilitySection`)

- [ ] **Step 1: Import the roster in `landing.tsx`**

Add near the imports:

```tsx
import { JobsRoster } from "@/components/sections/jobs-roster";
```

- [ ] **Step 2: Replace `ReliabilitySection` with `WhileYouSleepSection`**

Delete the entire `export function ReliabilitySection() { ... }` block (the `/* ── 2 · Guide it once ... */` section) and replace it with:

```tsx
/* ── §4 · Works while you sleep ──────────────────────────────────────── */
export function WhileYouSleepSection() {
  const { eyebrow, title, lead, cards, close } = landingContent.whileYouSleep;
  return (
    <section id="while-you-sleep" className="section band-deep" data-screen-label="What it does">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
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

        <ol className="timeline" style={{ marginInline: "auto" }}>
          {cards.map((c, i) => (
            <li key={c.id} className="tl-item reveal" style={d(0.08 * i)}>
              <div className="tl-marker" aria-hidden="true">
                <span className="tl-dot" />
              </div>
              <div className="tl-time">
                <span className="tl-clock font-display">{c.time}</span>
                <span className="tl-when">{c.when}</span>
              </div>
              <div className="tl-card">
                <h3 className="tl-title">{c.title}</h3>
                <p className="tl-body">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="section-lead reveal" style={{ ...d(0.2), textAlign: "center", marginTop: "clamp(28px,4vh,48px)" }}>
          {close}
        </p>
      </div>
    </section>
  );
}
```

> The `.timeline`, `.tl-item`, `.tl-marker`, `.tl-dot`, `.tl-time`, `.tl-clock`, `.tl-when`, `.tl-card`, `.tl-title`, `.tl-body` classes already exist in `app/sirius-design.css` (from the former DaySection) — reused as-is.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx`
Expected: `landing.tsx` no longer references `learnsOnce`. Remaining tsc error is only `app/page.tsx` importing removed exports (fixed in Task 15).

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/landing.tsx
git commit -m "feat(§4): WhileYouSleepSection (Jobs roster + day timeline); remove reliability section"
```

---

## Phase 8 — §5 privacy + remaining copy

### Task 13: Update `LocalSection` items label + vault contents

**Files:**
- Modify: `components/sirius-design/landing.tsx` (the `LocalSection` — only the copy comes from content; verify the vault renders the new 4 items)

- [ ] **Step 1: Confirm `LocalSection` reads `landingContent.local`**

`LocalSection` already maps `items` into `.vault-item`s and reads `eyebrow/title/body`. Since `content/landing.ts` now provides `local.items = ["Clients","Meetings","Conversations","Files"]` and the new title/body, no structural change is required. Read the current `LocalSection` to confirm it still type-checks against the new `local` shape.

Run: `npx tsc --noEmit`
Expected: no error originating in `LocalSection`.

- [ ] **Step 2: (If desired) widen the vault for 4 items**

If the four items overflow the `.vault-items` row at narrow widths, no code change is needed — the existing flex wraps. Leave as-is unless the screenshot in Task 16 shows clipping.

- [ ] **Step 3: Commit (only if a change was made)**

```bash
git add components/sirius-design/landing.tsx
git commit -m "feat(§5): privacy vault shows clients/meetings/conversations/files"
```

(If no change was needed, skip the commit — `local` copy already flowed through from Task 3.)

### Task 14: Footer wordmark + verify pricing/maker/CTA/right-brain copy

**Files:**
- Modify: `components/sirius-design/landing.tsx` (footer `aria-label`, wordmark text, `© Sirus`)

- [ ] **Step 1: Update footer brand strings**

In `SiriusFooter`, change:
- `aria-label="Sirius home"` → `aria-label="Sirus home"`
- `<span className="font-display">Sirius</span>` → `<span className="font-display">Sirus</span>`
- `<span>© 2026 Sirius</span>` → `<span>© 2026 Sirus</span>`

- [ ] **Step 2: Confirm RoutingSection/PricingSection/maker/CTA read content keys that still exist**

`RoutingSection` reads `rightBrain` (exists), `PricingSection` reads `pricing` (exists). `FinalCtaSection` reads `cta` (exists). No code change needed — copy flows from Task 3.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx`
Expected: no errors from this file.

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/landing.tsx
git commit -m "rebrand: Sirus wordmark in footer"
```

---

## Phase 9 — Compose the page

### Task 15: New section spine in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the imports + body**

Replace the whole file with:

```tsx
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/ui/section-divider";
import {
  SiriusHero,
  LearnsYouSection,
  WhileYouSleepSection,
  RoutingSection,
  PricingSection,
  LocalSection,
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
      <LearnsYouSection />
      <RelationshipsSection />
      <OneAppSection />
      <WhileYouSleepSection />
      <RoutingSection />
      <PricingSection />
      <SectionDivider />
      <LocalSection />
      <SectionDivider />
      <FinalCtaSection />
      <SiriusFooter />
    </main>
  );
}
```

- [ ] **Step 2: Verify the whole project type-checks**

Run: `npx tsc --noEmit`
Expected: **no errors** (all removed-key references are now gone).

- [ ] **Step 3: Lint changed files**

Run: `npx eslint app/page.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose the AI-cofounder section spine"
```

### Task 16: Confirm nav + header use the new section ids

**Files:**
- Modify: `components/sirius-design/landing.tsx` (the `NAV_LINKS` const, ~line 28)
- Check: `components/layout/site-header.tsx`, `components/layout/header-nav.tsx`

- [ ] **Step 1: Update `NAV_LINKS` ids in `landing.tsx`**

Replace the `NAV_LINKS` array (~line 28) with ids matching the new sections:

```tsx
const NAV_LINKS = [
  { id: "how-it-learns", label: "How it learns you" },
  { id: "while-you-sleep", label: "What it does" },
  { id: "pricing", label: "Pricing" },
];
```

- [ ] **Step 2: Check the header nav source**

Run: `grep -n "what-it-does\|learns-once\|one-app\|right-brain\|Sirius" components/layout/site-header.tsx components/layout/header-nav.tsx`
Update any stale section id (`what-it-does`→`how-it-learns`, `learns-once`→`while-you-sleep`, `one-app`→`stack`) and any `Sirius` wordmark → `Sirus`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius-design/landing.tsx components/layout/site-header.tsx components/layout/header-nav.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sirius-design/landing.tsx components/layout/site-header.tsx components/layout/header-nav.tsx
git commit -m "rebrand: nav + header point at new section anchors; Sirus wordmark"
```

---

## Phase 10 — Build, screenshot-verify, finish

### Task 17: Full build + visual pass

**Files:** none (verification)

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: success; `/` prerenders static. If `/demo` errors due to a removed export, it imports nothing from the changed sections — but if it does, note it (demo rebrand is a separate spec; only fix an outright build break, minimally).

- [ ] **Step 2: Screenshot each new section**

Start the app and screenshot the full `/` page. Compare each section against the spec §5b table and the mockups:
- Hero copy "Stop explaining yourself." / orb / founder logos strip.
- §1 pillars + connected-web graph (cyan YOU core, gold nodes, real labels).
- §2 EmailApprovalCard (gold spine, ✉️, To/Subject zone, Send/Edit/Dismiss).
- §3 orbit (Gmail/Notion/Slack/Superhuman/Granola/HubSpot/Stripe/Zapier).
- §4 Jobs roster (Needs you/Active now/Standing by) + day timeline + close line.
- §5 vault (Clients/Meetings/Conversations/Files).
- Footer "Sirus".

- [ ] **Step 3: Fix any visual drift**

For each mismatch, edit the relevant component and re-screenshot. Loop until each section matches the spec/mockup. Commit fixes individually:

```bash
git add <files>
git commit -m "fix(<section>): <what changed> to match spec"
```

### Task 18: Final lint + cleanup sweep

**Files:** any flagged

- [ ] **Step 1: Lint the whole changed surface**

Run: `npx eslint app components/sirius-design components/sections components/sirius`
Expected: no errors. Remove any unused imports/functions it flags (e.g. leftover logo functions in `logos.tsx`).

- [ ] **Step 2: Confirm no stray "Sirius" on landing surfaces**

Run: `grep -rn "Sirius" app components content/landing.ts | grep -v node_modules`
Expected: only blog-related files (out of scope). No hits in `content/landing.ts`, `app/page.tsx`, `app/layout.tsx`, `components/sirius-design/landing.tsx`, `components/sections/*`.

- [ ] **Step 3: Final type-check + build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 4: Commit any cleanup**

```bash
git add -A
git commit -m "chore: lint cleanup for cofounder rebrand"
```

---

## Self-Review notes (for the implementer)

- **Spec coverage:** name rename (T1-2,14,16) · hero (T3) · §1 learns-you pillars+graph (T7-8) · §2 real card (T9) · §3 orbit+copy (T6,10) · §4 roster+timeline (T11-12) · §5 privacy (T13) · §6 right-brain + pricing + maker + CTA (T3,14) · founder logos (T4-5) · page spine (T15) · nav (T16). All spec sections map to a task.
- **Out of scope (do NOT do here):** `/demo` rebrand, blog `.mdx` bodies, logo image assets (`icon.png`, `opengraph-image.png`), domain, the Granola official logo (placeholder lettermark used, flagged in T5).
- **Type consistency:** `content/landing.ts` keys used by components — `howItLearns.pillars`, `relationships.card.{lane,eyebrow,title,why,to,subject,preview,actions}`, `stack.{eyebrow,title,body}`, `whileYouSleep.{jobs[{group,name,desc,trigger,activity,status}],cards,close}`, `local.items`, `rightBrain`, `pricing`, `cta`, `maker`, `footer`, `integrations`, `nav` — all defined in Task 3 and consumed exactly as named.
- **Verification is tsc + eslint + build + screenshot** (no test runner), per CLAUDE.md.
