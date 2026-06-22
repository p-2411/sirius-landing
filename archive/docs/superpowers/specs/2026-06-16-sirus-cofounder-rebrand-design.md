# Sirus — "Your AI cofounder" rebrand (landing page)

**Date:** 2026-06-16
**Status:** Design — awaiting user review
**Scope:** Landing page only (`/`). Interactive `/demo`, blog bodies, and logo
image assets are explicit follow-ups.

---

## 1. Goal

Reposition the product from *"One assistant. It knows you. It does the work —
the same way, every time."* (workflows / local-first / model-routing) to
**"Your AI cofounder"** — an agent that *learns the business itself* (meetings,
CRM, inbox) and *runs the work autonomously* across your tools, with the
relationship/client win as the first concrete payoff.

Audience constraint (CLAUDE.md) still holds: target is high-agency
founders/investors/operators. Lead with the **outcome**; machinery is a
glanceable credibility prop, never the hero.

### Decisions locked in brainstorming
- **Name:** `Sirius → Sirus` (nods to Cyrus the Great). Mechanical rename in
  copy/markup only this pass.
- **Hero promise:** cofounder framing (broad), relationship/CRM as the first
  concrete proof — "both, sequenced."
- **Narrative spine:** Approach A — *"Stop explaining yourself"* (learns-you-led).
- **Autonomy:** sold **bold** ("it runs while you sleep") but grounded in the
  real trust-grant model — "give it the keys once."
- **Privacy / local-first:** kept as a trust anchor but **de-emphasized** (one
  quiet section, not a pillar).
- **Hero H1 voice:** "Stop explaining yourself." / "Your cofounder already knows."
- **Copy register:** **pure outcome** — no "knowledge graph", no "dossier", no
  under-the-hood mechanism words. Talk about what the founder *gets*.
- **Integrations:** founder/business-centric tools (HubSpot, Stripe, Notion,
  Slack, + Google) to make ROI obvious, with the open-ended "+ anything with an
  API" hedge. (Salesforce intentionally excluded for now.)

---

## 2. Grounding — real vs. aspirational (from `../sirius/`)

**Re-grounded 2026-06-17 after the app's major overhaul** (Vite SPA migration +
Jobs/Playbooks rename + home/voice rework). Honesty guardrails so the page
depicts something real or realistically shippable. The overhaul made the
cofounder/relationship story *more* grounded, not less.

| Claim on page | Reality in `../sirius/` (current) | How we frame it |
|---|---|---|
| Builds a picture of you / business / clients | **Real & stronger** — `entities` table (kinds: person, org, event, project, topic) with markdown dossier + vector embedding + `[[wiki-links]]` (`entity_links`) connecting them. Plus profile / threads / decisions / messages / observations layers | Depict honestly — this is the real engine behind §1 |
| §1 "your world" connected-web graph | **Real structure** — `entity_links` literally form a graph of linked people/orgs/projects/topics | The connected-web (Option B) maps to a real thing; still label nodes as real-world items, no tech terms |
| Per-client tracking / "never drop a client" | **Real bones** — a `kind='person'` dossier per contact (relationship history, wiki-linked); `todos` can attach to an entity; Gmail send + triggers | Depict as outcome (nudge card). Note: no CRM-branded UI/schema — dossiers are the contact model |
| Connects to Gmail / Calendar / Drive | **Real** — Gmail read+send, Calendar read+create, Drive read+write | Depict honestly |
| Connects to your CRM / other tools (HubSpot/Notion/Slack/Stripe) | **Reachable, not native** — any API via generic `http_request` node + encrypted Secrets; no first-class connectors | The *"+ anything with an API"* hedge is now literally accurate. Founder logos are glanceable aspirational props |
| Autonomous: runs while you sleep, drafts & sends | **Real & bolder** — a **Job** (a workflow *with a trigger*: cron/Gmail/webhook/manual) runs autonomously to completion on the Mac; no draft-for-approval for Jobs. `send_email` still needs a trust grant (revocable, per-channel) | Supports the "fully autonomous" framing the user chose; "give it the keys once" = the trust grant |
| Sits in on your meetings (live) | **Aspirational** — local Whisper transcription of recorded audio only; no live call join | Frame as product *direction*; no fake live-call UI. Transcription is real, just ahead of shipping |

**Terminology shift (context for §4):** "Workflows" is now split for users into
**Jobs** (a captured process *with a trigger* — user-facing, autonomous, shown on
home/the Jobs page) and **Playbooks** (untriggered, Sirius's private reusable
procedures). This *validates* our §4 framing: each "job it's handling for you" =
literally a **Job** in the product. **Copy decision: stay outcome-only** — do
NOT use "Jobs" as a branded product label on the page; describe the outcomes
("your morning brief, your daily outreach"). Plain lowercase "job" as ordinary
English (e.g. "hand it a job") is fine.

**Current app surfaces (for the eventual demo, not this pass):**
- Stack: **Vite SPA + API host** (the Next.js App-Router UI was deleted).
- 72px rail = **Work · Jobs · Workspace · Settings** (`Workflows`→**Jobs**;
  "Work" is a chat *morph* on home, not a separate page; **no "Feed"**).
- Home = voice-orb hero + greeting + persistent composer that FLIPs into chat;
  an **IntentLanes** feed of deterministic action cards grouped into lanes:
  **Needs you · Failed · In motion · FYI** (this is the real "review queue").
- Voice orb states: **Listening** (violet→pink cycle), **Thinking** (pink/
  magenta), **Speaking** (warm gold), always-on breathing. (Rail orb stays cyan.)
- Workspace = flat **recent-files gallery** (PDF/DOCX/text thumbnails), NOT the
  old `reports/ data/ companies/ founders/` folder tree.

> **CLAUDE.md is now stale** and should be corrected (separate pass): rail is
> `Work · Jobs · Workspace · Settings` (not `…Workflows…Feed…`); workspace is a
> recent-files gallery (not fixed folders); "Workflows" → "Jobs/Playbooks". The
> theme note ("cyan listening") is only true of the rail orb now.

---

## 3. Page structure

Single source of truth for copy stays `content/landing.ts`. Section components
in `components/sirius-design/landing.tsx` (+ our `components/sections/*`) get
copy swaps and two adapted visuals. No new architecture.

| # | Section id | Title | Source component | Change |
|---|---|---|---|---|
| Hero | `hero` | Stop explaining yourself. | `SiriusHero` | copy swap |
| 1 | `how-it-learns` | It learns the business on its own. | `DaySection` shell → repurposed as 3-pillar | adapted: 3 pillars (meetings / clients / "it just knows") |
| 2 | `relationships` | It keeps every relationship warm. | **new section** | new visual: dossier + follow-up nudge card |
| 3 | `stack` | It works inside your whole stack. | `OneAppSection` | copy swap (replaces→becomes) |
| 4 | `while-you-sleep` | It's already handling these. | `DaySection` timeline (+ standing-jobs roster) | recast timeline beats + jobs roster (workflows-as-outcomes); reliability viz/stats cut |
| 5 | `local` | Your business stays on your Mac. | `LocalSection` | copy swap, de-emphasized |
| 6 | `right-brain` | It always uses the right brain for the job. | `RoutingSection` | light copy refresh |
| — | `pricing` | Start free. | `PricingSection` | tagline refresh |
| — | maker / CTA / footer | Meet your cofounder. | `FinalCtaSection`, footer | copy swap + rename |

Note: §1 and §4 both derive from today's `DaySection`/`ReliabilitySection`
material — the day-timeline moves to §4 (autonomy proof); §1 becomes a new
3-pillar "how it learns you" block. Implementation may split `DaySection` into
two components (`LearnsYouSection`, `WhileYouSleepSection`) for clarity.

---

## 4. Copy (implementation reference — final draft)

Rewrite of `content/landing.ts`:

```ts
meta: {
  wordmark: "Sirus",
  tagline: "Your AI cofounder. It learns the business, then runs it with you.",
}

integrations: {
  // Founder/business-centric tools so the ROI is obvious at a glance.
  // Aspirational beyond Gmail/Cal/Drive today; the open-ended hedge covers it.
  label: "Works inside the tools you run the business in",
  tools: ["Gmail", "Calendar", "Google Drive", "Notion", "Slack", "Superhuman", "Granola", "HubSpot", "Stripe", "Zapier"],
  more: "+ anything with an API",
}

hero: {
  eyebrow: "Your AI cofounder",
  title: "Stop explaining yourself.",
  titleAccent: "Your cofounder already knows.",
  description:
    "Sirus sits in on your meetings, reads your inbox and CRM, and builds the full picture — you, your business, every client — then runs the work across the tools you already use.",
  proof: "Free to start · Runs on your Mac",
}

// §1 — how it learns you (3 pillars) — PURE OUTCOME, no "dossier"/machinery
howItLearns: {
  eyebrow: "How it learns you",
  title: "It learns the business on its own.",
  lead: "Every other assistant makes you feed it. Sirus picks it up itself — so it just knows you, your business, and everyone you work with.",
  pillars: [
    { title: "Sits in on your meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next — no notes to write." },
    { title: "Keeps up with your clients", body: "It follows every deal, email, and conversation, so you're never the only one holding it all in your head." },
    { title: "It just knows", body: "Ask it about a deal, a person, or a promise you made three weeks ago — it already has the answer." },
  ],
}

// §2 — relationship engine (new)
relationships: {
  eyebrow: "Never drop a client",
  title: "It keeps every relationship warm.",
  body: "Sirus knows when you last spoke to each client, what you promised, and who's gone quiet. It drafts the follow-up, sends it at the right moment, and surfaces the prospects worth chasing — or just tells you who to call today.",
  // visual: a client dossier card + a "reach out" nudge
  nudge: {
    name: "Acme Co — Dana Reyes",
    lastTouch: "Last touch · 3 weeks ago",
    line: "You said you'd send the Q3 numbers. Draft ready.",
    action: "Follow-up drafted",
  },
}

// §3 — across your stack (recast oneApp)
stack: {
  eyebrow: "One cofounder, every tool",
  title: "It works inside your whole stack.",
  body: "Gmail, Calendar, Drive, Notion, your CRM — Sirus operates inside the tools you already use, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them.",
  replaces: ["personal CRM", "executive assistant", "research analyst", "outreach", "ops"],
  becomes: "Sirus",
}

// §4 — works while you sleep (recast timeline + reliability stats)
whileYouSleep: {
  eyebrow: "Works while you sleep",
  title: "It's already handling these.",
  lead: "Hand it a job and it owns it — running on its own while you're asleep, commuting, or in another meeting. A few of the jobs it's keeping for founders right now:",
  // The "workflows" concept, as outcomes — rendered as the REAL Jobs roster
  // (the app's JobRow component: status dot · Fraunces name · description ·
  // trigger chip · activity), grouped Needs you / Active now / Standing by.
  // Each job is a GENERALIZED RECURRING RULE (not a specific instance) — ROI
  // lives in the verb ("chase any deal that's gone cold"); concrete numbers
  // ("47 leads", "$240k") are RUN RESULTS that surface in the feed card, never
  // baked into the job. NEVER shown as a DAG or "steps".
  jobs: [
    // group, name, description (generalized), trigger, activity
    { group: "Needs you",    name: "Prospect outreach", desc: "research & write to fresh prospects every night", trigger: "🕐 nightly",   activity: "awaiting you" },
    { group: "Active now",   name: "Inbound triage",    desc: "qualify every new inbound lead and book the demo", trigger: "✉️ on email", activity: "3 running" },
    { group: "Active now",   name: "Deal follow-ups",   desc: "chase any open deal that's gone quiet 5+ days",    trigger: "🕐 daily",     activity: "" },
    { group: "Standing by",  name: "Renewal guard",     desc: "flag any account approaching its renewal date",    trigger: "🕐 daily",     activity: "2h ago" },
    { group: "Standing by",  name: "Investor update",   desc: "draft the weekly update from live metrics",        trigger: "🕐 Mon 8:00", activity: "3d ago" },
    { group: "Standing by",  name: "Watch: lead investor", desc: "alert & draft the moment a key contact emails", trigger: "✉️ on email", activity: "5h ago" },
  ],
  cards: [
    { id: "outreach", time: "02:00", when: "while you slept",     title: "The outreach you didn't send",  body: "Fifty prospects, each researched and written to by name. You wake up to messages already going out — and a short queue of the few that need you." },
    { id: "morning",  time: "08:00", when: "before you're in",     title: "Caught up before coffee",        body: "It reads last night's replies, your calendar, and what each client is waiting on, then tells you the three things that actually matter today." },
    { id: "brief",    time: "10:45", when: "before your 11:00",    title: "Briefed for the call",           body: "From the last meeting it sat in and every thread since, a one-page brief is waiting in the invite — who they are, what's open, what to push." },
    { id: "client",   time: "14:30", when: "client email lands",   title: "Handled before you see it",      body: "It logs what changed, drafts the reply, sends the easy one, and flags the single decision that's actually yours." },
  ],
  // Closing outcome line. NO reliability diagram, NO mechanism stats —
  // "how reliably it runs" is an implementation detail a founder doesn't care
  // about. The timeline above IS the proof that it just happens.
  close: "Set the boundaries once. After that it just happens — every day, while you're somewhere else.",
}

// §5 — privacy (quiet)
local: {
  eyebrow: "Yours alone",
  title: "Your business stays on your Mac.",
  body: "Everything it knows about your clients, your meetings, your conversations, and your files lives on your machine, not our servers. The cloud only listens for the triggers that kick off the work.",
  items: ["Clients", "Meetings", "Conversations", "Files"],
}

// §6 — model routing (kept)
rightBrain: {
  eyebrow: "Better answers, smaller bill",
  title: "It always uses the right brain for the job.",
  body: "Sirus isn't one model. It picks whichever frontier model fits the task, and moves to a sharper one the day it ships. You're never locked in, or stuck on last year's model.",
}

pricing: {
  // structure/prices unchanged; taglines refreshed:
  // Free: "Try your cofounder, free."
  // Pro:  "The same Sirus, all day."
  // Max:  "For founders who run on it."
}

maker: {
  quote:
    "We didn't want another tool to manage. We wanted a cofounder — someone who already knew the business, kept every client straight, and did the work without being asked twice. Nothing we tried remembered us, so we built the one that does.",
  signature: "— the people building Sirus",
}

cta: {
  title: "Meet your cofounder.",
  button: "Download for Mac",
  sub: "macOS · Apple silicon",
}

footer: {
  blurb: "Your AI cofounder. It learns the business and runs the work, across the tools you already use. On your Mac.",
}

nav: [
  { id: "how-it-learns", label: "How it learns you" },
  { id: "while-you-sleep", label: "What it does" },
  { id: "pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
]
```

---

## 5. Components — work breakdown

1. **Rename** `Sirius → Sirus`: `content/landing.ts`, `landing.tsx` (wordmark,
   aria-labels, footer `© Sirus`), `app/layout.tsx` metadata/title,
   `opengraph-image.alt.txt`, `twitter-image.alt.txt`. Grep `Sirius`
   repo-wide; update landing-page surfaces, leave blog bodies for follow-up.
2. **Hero** — copy swap only.
3. **§1 `how-it-learns`** — repurpose `DaySection` into a 3-pillar block (new
   `pillars` data shape). Likely a new `LearnsYouSection` component reusing
   existing `.section`/`reveal` styles.
4. **§2 `relationships`** — new section whose visual is a faithful reproduction
   of the app's real **`EmailApprovalCard`** in the "Needs you" lane (exact
   tokens from `cardStyle.ts`; ✉️ glyph, To/Subject zone + paper body,
   Send/Edit/Dismiss). Build a landing-side card component mirroring it.
5. **§3 `stack`** — `OneAppSection` copy swap (`replaces`/`becomes`).
6. **§4 `while-you-sleep`** — recast day timeline (the cards move here) **+** a
   faithful reproduction of the real **Jobs roster** (`JobRow` density, grouped
   Needs you / Active now / Standing by; generalized recurring jobs). New
   `WhileYouSleepSection`. **`ReliabilitySection` (loop-vs-chain + stats) is
   removed** — workflow reliability is now an implementation detail, not shown.
7. **§5 `local`** — `LocalSection` copy swap, items updated.
8. **§6 `right-brain`** — light copy refresh.
9. **Pricing / maker / CTA / footer** — copy swaps.
10. **`app/page.tsx`** — reorder/rename section components to the new spine.

CSS: reuse `app/sirius-design.css` `.sd` tokens (gold `217,185,120`, cyan,
Fraunces/Geist/JetBrains). Two new visuals get minimal scoped additions.

---

## 5b. Visuals & diagrams

**Governing rule:** show the *outcome* (the thing you'd wake up to), not the
mechanism. No node/edge "knowledge-graph architecture" pictures, no pipeline
DAGs, no loop-vs-chain. When a diagram appears, its labels are *real things in
the founder's world* (client names, deals, promises), never tech terms
("entity", "embedding", "step", "node").

**Use the real app components.** §2 and §4 reproduce the app's ACTUAL UI
faithfully (exact tokens/layout), not invented widgets. The shared visual
language IS the app's card design language — extracted from `../sirius/`:
- Card frame (`cardStyle.ts`): `--color-surface-1 #2C261D` bg, `1px` border
  `rgba(232,224,200,.14)`, **3px left spine** in accent (`gold #d9b978`),
  radius `16`, padding `14`, soft shadow, hover lift.
- Card header: emoji glyph (✉️ email · 💬 needs-input · ⚠️ failed · 🔄 running ·
  ✏️ diff · 📄 content) + uppercase eyebrow (accent, 10.5px) + **Fraunces** title
  (15px/400) + muted "why" line (`ink-4`, 11.5px).
- Tokens: surface-2 `#342D23`, surface-deep `#14110D`, ink-1 `#F6EFDF`,
  ink-3 `rgba(206,208,197,.62)`, ink-4 `rgba(196,199,189,.40)`, border-strong
  `rgba(232,224,200,.24)`, accent-strong `#f0c879`, cyan `#6cd8ff`,
  success `#a7dbb2`, danger `#f0a3a3`.
- Lanes (`lanes.ts`): **Needs you** (gold) · **Failed** (danger) · **In motion**
  (muted) · **FYI** (cyan).

| Section | Visual | Source | Notes |
|---|---|---|---|
| Hero | Orb | real voice `Orb` | Brand identity — keep |
| §1 learns the business | **"Your world" connected-web graph** (Option B) — *You* + real-world nodes linked to *each other* (Dana → Acme → Q3 numbers) | **the one intentional concept visual** (no app screen exists); built new | Centerpiece. Nodes = real things ("Dana · Acme", "Q3 numbers owed", "intro · Tue call"). No tech labels. Grounded in the real `entity_links` data. Can animate assembling on scroll |
| §2 never drop a client | **Real `EmailApprovalCard`** in the "Needs you" lane — ✉️ glyph, eyebrow, Fraunces title, To/Subject zone + paper body, Send/Edit/Dismiss | **real app component** (`EmailApprovalCard.tsx`, `cardStyle.ts`) | This is the literal product card. Concrete run numbers (e.g. "47 leads drafted") belong here / in the feed, not in §4 |
| §3 your whole stack | **Tool orbit** — Sirus orb at center, founder stack orbiting on two rings | `tool-orbit.tsx` (re-logo) | Tools: Gmail · Calendar · Drive · Notion · Slack · **Superhuman · Granola** · HubSpot · Stripe · **Zapier** + "anything with an API". Aspirational/native mix — the hedge covers it |
| §4 works while you sleep | **Real Jobs roster** (`JobRow`, grouped Needs you / Active now / Standing by) **+** the narrated day timeline | **real component** (`JobRow.tsx`) + `DaySection` timeline | Jobs = generalized recurring rules (see §4 copy). Status dot (gold awaiting · cyan running · green done) + trigger chip (🕐/✉️/🔗). Timeline kept as the emotional throughline |
| §5 privacy | **Cloud-listens → Mac-vault** (Option A) — a thin trigger signal from the cloud into a locked "Your Mac" vault holding Client dossiers · Meeting transcripts · Conversations · Files | adapt `LocalSection` visual | Closest to the real architecture (cloud only relays triggers; data + work stay local) |
| §6 right brain | none (type-led) | — | Keep |

**Retire as heroes:** `workflow-dag-mock`, `design-tree-mock` (machinery).

**Build cadence:** lock the shared card language first (it's the app's, already
specified above), then build & ship **section by section** with a
screenshot-verify loop (build → screenshot → compare to spec → iterate → commit
→ next section), per the standing screenshot-before-layout-changes workflow.

## 6. Out of scope (follow-ups)
- Interactive `/demo` rebrand (separate spec).
- Blog post bodies (only wordmark/nav rename touches blog chrome).
- Logo image assets (`icon.png`, `opengraph-image.png`, favicons) and domain.
- New integration logo SVGs (HubSpot/Stripe/Slack) — these are a
  **deliberate requirement** (founder ROI), so marks must exist. If absent from
  `components/sirius-design/logos.tsx`, add clean monochrome marks in the same
  style as the current set (this is in scope for implementation, called out
  here as a known work item).
- CLAUDE.md "Feed → Workspace" correction.

---

## 7. Verification
Per CLAUDE.md (no test suite): `npx tsc --noEmit` + `npx eslint <changed>` +
`npm run build` (`/` must prerender static). Screenshot-verify the new sections
against this spec per the screenshot-before-layout-changes workflow.
