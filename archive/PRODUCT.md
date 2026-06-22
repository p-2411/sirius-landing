# Product

## Register

brand

## Users

High-agency professionals — founders, investors, agency owners, freelancers —
**not engineers**. They buy outcomes and leverage, not pipelines. They land on
this site skeptical, time-poor, and fluent in product marketing, so they smell
hype and template scaffolding instantly. The job they're hiring for: convince me
in seconds that this AI cofounder will quietly do real work I care about (close
relationships, run my dealflow, handle the inbox) while I'm elsewhere — and make
me trust it enough to join the waitlist or download.

## Product Purpose

The marketing surface for **Sirius** — "your AI cofounder." It exists to sell the
outcome: an agent that learns your business itself (meetings, CRM, inbox) and
runs work autonomously across your tools while you sleep. Success is a visitor
*feeling* the value in three seconds and converting (waitlist / download), having
believed the product is real and shippable — never having been asked to admire
how it works. This is `/`, `/demo`, and `/blog` (the "Star Atlas"); the real app
lives separately at `../sirius/` and is the ground truth every depicted surface
must stay faithful to.

## Brand Personality

Bold, ambitious, futuristic — but the ambition is carried by **craft and
restraint, not volume**. Frontier-AI confidence shown the way a quiet-luxury
brand shows wealth: a living voice orb, a starfield, warm gold on near-black, one
deliberate gesture rather than ten loud ones. Voice is outcome-only and speaks
the user's language — deals, clients, hours saved, "while you sleep," "before the
meeting" — never "workflow orchestration," "agent steps," or internal jargon.
Emotional goal: calm conviction that something powerful is already working for
you. Aspirational, never breathless.

## Anti-references

- **Busy automation tool** (Zapier / n8n): no pipeline DAGs, node graphs, step
  types, or run logs as the hero. Internals are glanceable credibility props at
  most, never the lede.
- **Crypto / AI hype**: no neon glow, synthwave gradients, "revolutionary,"
  edgy-dark-mode theatrics. Futuristic is expressed through restraint, not noise.
- Generic SaaS template grammar: gradient-blob heros, identical feature-card
  grids, tracked-uppercase eyebrows on every section, the hero-metric template.
- Showing *what we are* (the technical machinery) instead of *what it does for
  you* (the finished deliverable and the time/effort it saved).

## Design Principles

- **Lead with the outcome, not the machinery.** "Your weekly dealflow, done
  before you're in" beats a diagram of agent tasks. Would a busy founder feel the
  value in 3 seconds, or are we asking them to appreciate how it works? Always
  aim for the former.
- **Speak their language.** Deals, clients, hours saved, "while you sleep." Never
  workflow/orchestration/agent-step vocabulary on the marketing surface.
- **Depict only what's real or realistically shippable.** Every app surface shown
  must trace to `../sirius/` (or be a believable extension of that model). No
  invented product surfaces; check ground truth before depicting.
- **Frame the product as learning YOU**, not as another automation tool — Sirius
  builds a picture of your world (people, orgs, clients) and acts from it.
- **Ambition through craft, not volume.** One living, deliberate gesture (the
  orb, a single reveal) carries more conviction than a louder page. Restraint is
  the flex.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1 and large text ≥3:1 against the dark
surfaces — watch muted ink tokens (`ink-3`/`ink-4`) on tinted backgrounds.
Signature motion (voice orb, starfield, ambient blooms, reveals) is core to the
brand and stays prominent; provide `prefers-reduced-motion` alternatives
(crossfade / static end-state) wherever motion conveys meaning or could trigger
discomfort, but motion need not be stripped where it's purely ambient and gentle.
Reveal animations must enhance an already-visible default so content never ships
blank to reduced-motion users or headless renderers.
