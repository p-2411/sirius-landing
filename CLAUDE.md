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

The real Sirius app lives at `../sirius/` (Next.js app under
`/Users/parhamsepasgozar/Documents/GitHub/sirius/app`). The landing demo must
depict something **real or realistically shippable** — never invented product
surfaces. Ground truth from the real app:

- Persistent **72px icon rail**: Work · Workflows · Feed · Settings (cyan
  active). Keep it — it's app nav, not jargon.
- Workflow page: two-pane (DAG left + "Chat with this workflow" right + recent
  runs strip). Run detail (`/workflows/runs/[id]`) = an ordered **steps list**
  with each node's inline text output / collapsed input-output JSON.
- A run's outputs are the **files it actually writes** to the workspace
  (real folders: `reports/ data/ companies/ founders/`) plus the final text
  output — NOT a browser of invented sections like "Company profiles".
- Theme matches the landing: dark, gold accent (`217,185,120`), cyan listening
  (`108,216,255`), Fraunces display / Geist body / JetBrains mono.

We may add NEW pages to the real app for better UX, but they must be a
believable extension of this model. Before depicting any app surface, check
`../sirius/` (and its `ONBOARDING.md`/`SPEC.md`) rather than inventing.

## Verification (no test suite)

This repo has no test runner. Verify changes with:
`npx tsc --noEmit` + `npx eslint <changed files>` + `npm run build`
(`/` and `/demo` should prerender static).

## Design docs

Specs and plans for the landing demo live in `docs/superpowers/`.
