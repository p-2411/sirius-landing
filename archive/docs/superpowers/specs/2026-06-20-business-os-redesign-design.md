# Sirius — "The operating system for your business" redesign

**Date:** 2026-06-20
**Supersedes:** `2026-06-16-sirus-cofounder-rebrand-design.md` (the "AI cofounder" framing)

## What changed

Sirius is repositioned from a solo founder's "AI cofounder" (a personal Mac app)
to **a company-wide operating system for a business**. The defining idea is a
two-layer system joined by a feedback loop:

- **Information layer** — Sirius learns the whole business by ingesting from every
  source: meetings, client interactions, Slack, email, the CRM. It unifies that
  into one living picture and spots gaps, patterns, and insight.
- **Operation layer** — it acts on that insight: fills the gaps, ships
  automations, and runs the work across your existing apps.
- **The loop** — every operation feeds back into the information layer. The more
  Sirius runs, the more it knows, the more it ships. That compounding loop is
  what makes it an operating system, not a tool.

It integrates across the apps a company already runs on (Slack, CRM, email,
calendar, drive, docs). And **every employee gets their own Sirius** that knows
*them* — transcribes their meetings, manages their email, builds their personal
automations — with all of that work feeding back into the shared org picture.

### Locked decisions (from brainstorming)

1. **Full pivot** to a company-wide business OS. Drop the solo "cofounder" framing.
2. **No privacy/local section.** Data control is treated as table stakes, not a
   selling point. Remove the "runs on your Mac" section, the download-for-Mac CTA,
   and the local-first pricing bullets.
3. **Go-to-market = Request access / waitlist.** No public pricing. Remove the
   3-tier pricing section.
4. **Narrative = Approach B** (outcome-forward; the loop is the engine reveal, not
   the opener).
5. **Cut** the model-routing ("right brain") section — weak fit for an OS narrative.

### Positioning guardrails (unchanged from CLAUDE.md)

Audience is still **high-agency non-engineers** — but now the buyer is the
founder/exec deciding for the whole org. Lead with the **outcome**, not the
machinery. The two-layer loop is the centerpiece, but it must read as *value*
("it gets smarter every time it acts"), never as an architecture diagram. Speak
their language: the business, clients, the work, "running itself."

> Implementation note: CLAUDE.md's audience section still says "runs on your Mac"
> and frames a solo user. Update those local/Mac implications during
> implementation so the standing guidance matches the company-OS positioning.

## Section spine (8 sections)

| # | Section | Anchor | Headline idea | Visual |
|---|---------|--------|---------------|--------|
| — | Hero | `#hero` | "It knows how your business runs. So it runs it." | Voice orb (keep) |
| 2 | Information layer | `#knows` | "One picture of the whole business." | Reuse `world-graph.tsx` |
| 3 | Operation layer | `#does` | "It closes the gaps it finds." | Reuse jobs roster + relationship card |
| 4 | The loop | `#loop` | "Every action makes it smarter." | **NEW: information↔operation flywheel** |
| 5 | Per-employee Sirius | `#team` | "Everyone gets their own Sirius." | New/repurposed: per-person instances feeding a center |
| 6 | Integrations | `#stack` | "It lives where the work already happens." | Reuse integrations strip + `tool-orbit` |
| 7 | Maker quote | — | reframed for the OS vision | — |
| 8 | CTA / Request access | `#cta` | "Put your business on Sirius." | Request-access modal |

**Nav:** What it knows · What it does · The loop · For your team · Blog →
CTA **Request access**.

## Copy (source of truth for `content/landing.ts`)

### meta
- `wordmark`: "Sirius"
- `tagline`: "The operating system for your business."

### nav
- `{ id: "knows", label: "What it knows" }`
- `{ id: "does", label: "What it does" }`
- `{ id: "loop", label: "The loop" }`
- `{ id: "team", label: "For your team" }`
- `{ href: "/blog", label: "Blog" }`
- CTA: `{ label: "Request access", href: "#cta" }`

### hero
- `eyebrow`: "The operating system for your business"
- `title`: "It knows how your business runs."
- `titleAccent`: "So it runs it."
- `description`: "Sirius learns your business from the inside — every meeting, every message, every client — and holds it as one picture nobody's ever had the time to keep. It sees what's slipping, then does the work to fix it, across the tools you already use."
- `proof`: "Now rolling out to teams."
- `micHint`: "say anything — watch it go to work"
- `micPrivacy`: "Your voice stays in your browser. We're not listening."
- `tapFallback`: "See it work"

### informationLayer (`#knows`)
- `eyebrow`: "the information layer"
- `title`: "One picture of the whole business."
- `lead`: "Everything your company knows is scattered — across inboxes, calls, threads, and a CRM nobody keeps current. Sirius pulls it together on its own. Every meeting it sits in, every Slack message, every email and client interaction feeds one living picture of how the business actually works — who's involved, what was promised, where it's stuck."
- `pillars`:
  - { title: "Sits in on the meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next." }
  - { title: "Reads every channel", body: "Inbox, Slack, the CRM — it keeps up with all of it so nobody has to be the one holding it in their head." }
  - { title: "Finds what's slipping", body: "It connects the threads and surfaces the gaps: the promise nobody kept, the deal gone quiet, the work falling between systems." }

### operationLayer (`#does`)
- `eyebrow`: "the operation layer"
- `title`: "It closes the gaps it finds."
- `lead`: "Knowing isn't the point — doing is. From that picture, Sirius acts on what's falling through: it drafts the follow-up nobody sent, chases the deal that went quiet, builds the automation you kept meaning to set up. Real work, shipped across your apps — not another dashboard telling you what's wrong."
- Reuse the relationship card (`relationships.card` data) as the concrete "Needs you" example.
- Reuse the jobs roster (`whileYouSleep.jobs`) re-labelled as "what it's running right now," reframed away from "while you sleep" toward "across the business."

### theLoop (`#loop`)
- `eyebrow`: "the loop"
- `title`: "Every action makes it smarter."
- `lead`: "This is what makes it an operating system and not a tool: the two layers feed each other. Everything Sirius does — every email sent, every deal moved, every automation that runs — flows back into what it knows. The picture sharpens, the gaps get clearer, and it ships more on its own. The longer it runs, the more it runs for you."
- Flywheel nodes (NEW visual): **Information → Insight → Operation → Outcome →** (back to Information). Two arcs labelled "the information layer learns" (top) and "the operation layer acts" (bottom), the arrows closing the circle.

### perEmployee (`#team`)
- `eyebrow`: "for everyone, not just the org"
- `title`: "Everyone gets their own Sirius."
- `lead`: "Each person on your team gets a Sirius that knows them. It takes notes in their meetings, handles their inbox, and builds the small automations they never found time for. And every bit of that work quietly feeds the same shared picture — so the whole company gets smarter every time one person gets help."

### integrations (`#stack`)
- `label`: "Runs inside the tools you already run on"
- `title`: "It lives where the work already happens."
- `body`: "Slack, Gmail, Calendar, Drive, Notion, your CRM — Sirius operates inside the tools your company already uses, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them."
- `tools`: ["Slack", "Gmail", "Calendar", "Google Drive", "Notion", "HubSpot", "Salesforce", "Stripe", "Zoom", "Granola"]
- `more`: "+ anything with an API"

### maker
- `quote`: "We were tired of tools that made us feed them. Every CRM, every tracker, every app needed us to keep it current — and none of them did anything with what they knew. We wanted the opposite: something that learns the business on its own, and then actually runs it. Nothing we tried did, so we built it."
- `signature`: "— the people building Sirius"

### cta (`#cta`)
- `title`: "Put your business on Sirius."
- `button`: "Request access"
- `sub`: "Early access · rolling out to teams now"

### footer
- `blurb`: "The operating system for your business. It learns how your company runs, then runs it with you — across the tools you already use."

## Implementation outline

### content/landing.ts
Restructure to the keys above. Remove `howItLearns` (replaced by
`informationLayer`), `whileYouSleep.close`/`cards` framing reused under operation,
`rightBrain`, `pricing`, `local`. Keep `relationships.card` and
`whileYouSleep.jobs` data, re-homed under the operation layer.

### components/sirius-design/landing.tsx
- Rename/replace section components: `LearnsYouSection` → `InformationLayerSection`,
  `WhileYouSleepSection` → `OperationLayerSection` (+ fold in the relationship card),
  add `LoopSection`, add `ForYourTeamSection`.
- Remove `RoutingSection`, `PricingSection`, `LocalSection`.
- Hero CTA + nav CTA + footer CTA all become **Request access** (point at `#cta`).
- Update nav anchors and `data-screen-label`s.

### New component: the flywheel
- `components/sirius/loop-flywheel.tsx` — an SVG/CSS loop with the four labelled
  nodes (Information · Insight · Operation · Outcome) and a continuously animated
  arc showing flow around the circle. Honors DESIGN.md: warm near-black ground,
  gold + cyan only, calm motion (no frantic spinning), respects
  `prefers-reduced-motion`. `role="img"` with a descriptive `aria-label`.

### Request-access modal
- Repurpose `components/ui/download-modal.tsx` → a request-access form modal:
  captures **work email** (and optionally company), submits, then shows the
  existing done-state confirmation ("You're on the list."). Reuse the modal's
  current submit→confirm pattern; swap copy and fields. Replace
  `download-button.tsx` usage with a "Request access" trigger.

### Per-employee visual (section 5)
Either a new lightweight SVG of several small person-orbs feeding a central org
orb, or a repurpose of `tool-orbit.tsx` with people instead of tools. Keep it
glanceable and secondary to the copy.

### Docs
- Update `DESIGN.md`, `PRODUCT.md`, and CLAUDE.md's audience/local references to
  the company-OS positioning.

## Verification

No test runner. Verify with:
`npx tsc --noEmit` + `npx eslint <changed files>` + `npm run build`
(`/` and `/demo` must still prerender static). Screenshot-verify each section
against this spec per the standing screenshot loop.
