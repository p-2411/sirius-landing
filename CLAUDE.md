# Sirius Landing — Working Guidance

## Audience & positioning (read before any copy/design/demo work)

**The target is high-agency professionals — founders, investors, agency owners,
freelancers — not engineers.** They buy outcomes and leverage, not pipelines.

Implication for everything on this site (copy, sections, and especially the
interactive demo):

- **Lead with the outcome, not the machinery.** "Your weekly dealflow, done
  before you're in" beats showing a DAG of `AGENT_TASK` nodes.
- **Showing *what we are* (the technical internals) reads as too technical.**
  Pipeline graphs, step types, run logs, internal jargon (`dealflow_pipeline`,
  `RUN_PYTHON`, step DAGs, input/output JSON) are credibility props at most —
  keep them glanceable and secondary, never the hero. The hero is the
  finished deliverable and the time/effort it saved.
- **Speak their language.** Deals, clients, hours saved, "while you sleep,"
  "before the meeting" — not "workflow orchestration" or "agent steps."
- When in doubt, ask: would a busy founder/investor *feel the value* in 3
  seconds, or are we asking them to appreciate how it works? Aim for the former.

This is a standing constraint, not a one-off note — apply it to future
changes unless the user explicitly overrides it.

## The demo must accurately represent the real app

The real Sirius app lives at `../sirius/` (a **Vite SPA + API host** under
`/Users/parhamsepasgozar/Documents/GitHub/sirius/app`; the old Next.js
App-Router UI was deleted). The landing demo must depict something **real or
realistically shippable** — never invented product surfaces. Ground truth from
the real app (current as of 2026-06-17, after the SPA + Jobs/Playbooks overhaul):

- Persistent **72px icon rail**: Work · **Jobs** · Workspace · Settings.
  "Work" is a chat **morph on home**, not a separate page. (There is no "Feed".)
- **Home** = voice-orb hero + greeting + a persistent composer that FLIPs into
  chat. Below it, an **IntentLanes** feed of deterministic action cards grouped
  into lanes: **Needs you · Failed · In motion · FYI**. This is the real
  "review queue" / briefing surface.
- **Jobs vs Playbooks**: a workflow *with a trigger* (cron/Gmail/webhook/manual)
  is a **Job** (user-facing, autonomous, on home/the Jobs page); an untriggered
  workflow is a **Playbook** (Sirius's private reusable procedure). Same
  underlying "workflow" structure — the only difference is the trigger.
- Job/workflow detail: two-pane (DAG left + "Chat with this workflow" right +
  recent runs strip). Run detail = an ordered **steps list** with each node's
  inline text output / collapsed input-output JSON.
- **Workspace** = a flat **recent-files gallery** (PDF/DOCX/text thumbnails) of
  what jobs actually wrote — NOT a fixed `reports/ data/ companies/ founders/`
  folder tree, and NOT invented sections like "Company profiles".
- **Dossiers / memory**: an `entities` store (person · org · event · project ·
  topic) with markdown dossiers, vector embeddings, and `[[wiki-links]]` that
  connect entities into a graph of the user's world. Plus profile / threads /
  decisions / messages / observations layers. Per-person dossiers are the
  closest thing to a CRM (no dedicated CRM schema/UI).
- **Voice orb** states: Listening (violet→pink cycle), Thinking (pink/magenta),
  Speaking (warm gold), always-on breathing. The **rail orb** stays cyan
  (`108,216,255`).
- Theme: dark, gold accent (`217,185,120`), cyan (`108,216,255`),
  Fraunces display / Geist body / JetBrains mono.

We may add NEW pages to the real app for better UX, but they must be a
believable extension of this model. Before depicting any app surface, check
`../sirius/` (and its `ONBOARDING.md`/`SPEC.md`) rather than inventing.

## Verification (no test suite)

This repo has no test runner. Verify changes with:
`npx tsc --noEmit` + `npx eslint <changed files>` + `npm run build`
(`/` and `/demo` should prerender static).

## Design docs

Specs and plans for the landing demo live in `docs/superpowers/`.
