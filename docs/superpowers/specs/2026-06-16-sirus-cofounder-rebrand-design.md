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

Honesty guardrails so the page depicts something real or realistically
shippable.

| Claim on page | Reality in `../sirius/` | How we frame it |
|---|---|---|
| Builds dossiers on you / business / clients | **Real** — vector-indexed dossiers (people/orgs/projects) + multi-layer memory (profile → threads/decisions → messages) | Depict honestly |
| Connects to Gmail / Calendar / Drive | **Real** — OAuth integrations | Depict honestly |
| Autonomous: runs while you sleep, drafts & sends | **Real but bounded** — cron/Gmail/webhook triggers run autonomously; `send_email` needs a trust grant or per-turn approval | "Give it the keys once" — trust-grant framing |
| Reliable, same way every time (workflows) | **Real** — first run becomes a workflow; 2×/10×/⅒ stats | Keep, fold into "while you sleep" |
| Sits in on your meetings (live) | **Aspirational** — only local Whisper transcription of recorded audio today | Frame as product *direction*; no fake live-call UI. Transcription is real, so not a lie — just ahead of shipping |
| Connects to your CRM (HubSpot/Notion/Stripe) | **Aspirational** — Gmail/Cal/Drive/Word only today | Keep existing open-ended *"+ anything with an API"* hedge; CRM logos are glanceable props |
| Per-client follow-up timing / outreach engine | **Assemblable** — dossiers + Gmail + triggers exist; no CRM-branded UI | Depict as outcome (a nudge card), not as a fake product surface |

Real app surfaces (for any future demo work, not this pass): 72px rail =
**Work · Workflows · Workspace · Settings** (NOT "Feed" — that label in CLAUDE.md
is stale; briefings live on Home). Workspace folders: `reports/ data/
companies/ founders/`.

> **CLAUDE.md follow-up:** the "Feed" reference in the rail description is
> outdated and should be corrected to "Workspace" in a later pass.

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
| 4 | `while-you-sleep` | Give it the keys once. It runs. | `DaySection` timeline + `ReliabilitySection` stats | recast timeline beats + fold reliability stats |
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
  tools: ["HubSpot", "Gmail", "Calendar", "Notion", "Slack", "Google Drive", "Stripe"],
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
  title: "Give it the keys once. It runs.",
  lead: "You set the boundaries once. After that, Sirus does the work — drafting, sending, following up, briefing — while you're asleep, commuting, or in another meeting.",
  cards: [
    { id: "outreach", time: "02:00", when: "while you slept",     title: "The outreach you didn't send",  body: "Fifty prospects, each researched and written to by name. You wake up to messages already going out — and a short queue of the few that need you." },
    { id: "morning",  time: "08:00", when: "before you're in",     title: "Caught up before coffee",        body: "It reads last night's replies, your calendar, and what each client is waiting on, then tells you the three things that actually matter today." },
    { id: "brief",    time: "10:45", when: "before your 11:00",    title: "Briefed for the call",           body: "From the last meeting it sat in and every thread since, a one-page brief is waiting in the invite — who they are, what's open, what to push." },
    { id: "client",   time: "14:30", when: "client email lands",   title: "Handled before you see it",      body: "It logs what changed, drafts the reply, sends the easy one, and flags the single decision that's actually yours." },
  ],
  // reliability proof folded in (kept from current learnsOnce)
  stats: [
    { v: "2+ ×", unit: "faster",        note: "It runs the steps directly instead of working them out each time." },
    { v: "10×",  unit: "more reliable", note: "Once it's learned a task, every run follows the same path." },
    { v: "¹⁄₁₀", unit: "the cost",      note: "No tokens spent re-thinking the same task twice." },
  ],
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
4. **§2 `relationships`** — new section + a glanceable dossier/nudge card
   visual (adapt an existing mock card style; keep secondary, outcome-led).
5. **§3 `stack`** — `OneAppSection` copy swap (`replaces`/`becomes`).
6. **§4 `while-you-sleep`** — recast timeline (the day cards move here) + fold
   `ReliabilitySection` stats. New `WhileYouSleepSection` or reuse
   `DaySection` timeline markup with new copy.
7. **§5 `local`** — `LocalSection` copy swap, items updated.
8. **§6 `right-brain`** — light copy refresh.
9. **Pricing / maker / CTA / footer** — copy swaps.
10. **`app/page.tsx`** — reorder/rename section components to the new spine.

CSS: reuse `app/sirius-design.css` `.sd` tokens (gold `217,185,120`, cyan,
Fraunces/Geist/JetBrains). Two new visuals get minimal scoped additions.

---

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
