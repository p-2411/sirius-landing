# Sirius landing — revamp design (2026-05-31)

## Context

The current landing page (`app/page.tsx`) is a product-feature tour: hero (orb +
"In the proper sense") → in-practice vignettes → live startup-analyst demo →
workflows → four ways → three ideas → local data → FAQ → final CTA → what's next.
It reads bland and dated, the orb's voice interactivity has no payoff, and the
copy/CTA assume a private-access waitlist.

Two things have changed since the v1 spec:

1. There's a sharper product narrative (see the "paper" — glue-work problem,
   competitive gap, "learn it once" unlock, "a person not a task," ROI).
2. **The product is shipping.** The ask is now "Download for Mac," not "request
   access."

This revamp restructures the page around a **demo-first** architecture and
rebuilds the hero so its interactivity earns its place.

Audience is unchanged and binding (`CLAUDE.md`): high-agency professionals —
founders, investors, agency owners, freelancers — **not engineers**. Lead with
the outcome, not the machinery.

## Locked decisions

| Decision | Choice |
|---|---|
| Page architecture | **Demo-first** — the product working is the pitch |
| Hero interaction | **Orb triggers the demo** — speak (anything) → demo runs; tap fallback w/o mic |
| Demo scenario | **Social-posts automation** — pulls a Notion page → researches 3 angles → surfaces **3 ready drafts as a home-surface notification** |
| Primary CTA | **Download for Mac** |
| Pricing | **Show it** — "free during beta" loud, "$XX/mo after" quiet; ROI framing ("less than the tools it replaces, far less than the assistant it stands in for") |
| Price number | Placeholder `$XX/mo` until the real number is supplied |
| Tone | No Jeeves/old-British affect — voice can't carry on a landing page. Plain, confident, matched per section |
| ROI competitor/salary numbers | Framing only, no hard `$100–200`/`$50–80k` figures unless requested later |

## Page architecture (top → bottom)

A single long scroll. Section IDs in parentheses for nav/anchors.

1. **Header** (`site-header`) — Sirius wordmark · nav (How it works · What it does
   · Pricing) · **Download for Mac** button. Sticky, condenses on scroll.

2. **Hero = the demo** (`#hero`) — the crux. See "Hero interaction" below.
   - Headline: *"One assistant. It knows you. It does the work."*
   - Subhead: *"Across your inbox, calendar, files, and any app with an API — it
     holds the context and does the jumping, so you don't."*
   - Orb (cyan, listening identity) sits **below** the headline as the voice
     on-ramp, with a "say anything — watch it go to work" affordance.
   - Primary: **Download for Mac**. Pill: **Free during beta**.
   - On trigger, the demo unfolds in-place (the social-posts film).

3. **The beat** (`#beat`) — one line connecting demo → value:
   *"You already knew what to do. The bottleneck was being the one holding the
   context and doing the jumping."*

4. **What it does** (`#what-it-does`) — outcome cards, 3–4, no jargon. Pulled from
   the paper's "what it actually does": standup ready before you are · next
   meeting briefed · client changes already done · the outreach you didn't send.

5. **It learns it once** (`#learns-once`) — the reliability differentiator.
   *"Guide it once. Then just ask."* Other agents re-think every run; Sirius
   crystallizes the first run into a callable workflow. Small before/after
   (first run = you guide it → saved → "do another for X" = runs itself).

6. **One app, not five** (`#one-app`) — the stack collapses into one
   subscription (AI chat · automation · research · briefings · personal CRM →
   Sirius). Capability breadth + ROI framing (no hard numbers).

7. **Pricing** (`#pricing`) — card: **Free during beta** (loud) · **$XX/mo
   after** (quiet) · "less than the tools it replaces, far less than the
   assistant it stands in for" · **Download for Mac**.

8. **Local-first** (`#local`) — your data stays on your Mac. Memories,
   conversations, files local; recurring/asleep jobs use the cloud with only
   what they need.

9. **Final CTA** (`#cta`) — **Download for Mac** · "macOS · free during beta".

10. **Footer** (`site-footer`) — unchanged structure, copy refreshed.

FAQ is **optional / trimmed** — keep a short 3–4 item FAQ above the footer only
if it earns space; otherwise cut. (Resolve on review.)

## Hero interaction (detail)

The hero merges what were two sections (hero + live demo) into one continuous
opening.

- **Idle:** orb pulses on a synthetic signal (never looks dead). Affordance:
  "say anything — watch it go to work."
- **Mic granted + speech detected:** orb reacts to voice (amplitude → size,
  frequency → hue, reusing `use-mic-signal`). Any speech (content ignored)
  trips the trigger → the social-posts demo film begins in-place. Microcopy:
  *"Your voice stays in your browser. We're not listening."*
- **No mic / denied / unsupported / reduced-motion:** show a **"▸ See it work"**
  tap button instead of the mic prompt. Tapping runs the same film.
- **Reduced motion:** film jumps to the payoff state (3 drafts) without the
  step-by-step animation.

The trigger is a single `onTriggerDemo()` seam so voice, tap, and reduced-motion
all enter the same path.

## The demo component (social-posts film)

A **new** directed-film component, lighter than the existing
`StartupAnalystAppDemo`. It models the same idea (a self-playing depiction of the
real app) but targets a different surface: the **home/voice surface with a
notification**, not the workflow → run → files app shell.

Reuse, don't reinvent:
- Pattern/architecture from `components/sirius/startup-analyst-demo.tsx`
  (intersection-observer gated autoplay, phase state machine, reduced-motion
  jump-to-payoff, `data-mode` card growth).
- App-UI primitives in `components/sirius/appui/*` (`Rail`, `ChatPane`,
  `AppPill`, etc.) and `components/sirius/notice-card-mock.tsx` for the
  home-surface notification with the 3 drafts.
- Theme tokens (dark, gold accent, cyan listening) — already in `globals.css`.

Film phases:
1. **Trigger** — user spoke / tapped. "Heard you — on it."
2. **Pull** — reads the Notion source page.
3. **Research** — three angles explored (three quick beats).
4. **Draft** — three posts written.
5. **Payoff** — home surface shows a **notification card: "3 drafts ready"**,
   expandable to three readable, pick-one-ship draft previews.

Output is **readable drafts**, not files-on-disk — the deliverable, surfaced
where the user lives (home), per the audience guidance.

The existing heavy `StartupAnalystAppDemo` + `/demo` route are **out of scope to
delete**; they stay for the standalone `/demo` page. The new home page does not
embed the startup-analyst film.

## Component reuse map (old → new)

| Existing | Fate |
|---|---|
| `sections/hero.tsx` | **Rebuilt** — orb-triggers-demo opening |
| `sections/live-demo.tsx` + `sirius/startup-analyst-demo.tsx` | **Not on home page.** Demo engine pattern reused for the new social film; originals retained for `/demo` |
| `sections/in-practice.tsx` | **Repurposed** → "What it does" outcome cards |
| `sections/workflows.tsx` | **Folded** → "It learns it once" |
| `sections/four-ways.tsx` | **Cut** (voice/chat/feed/automations no longer a standalone section; voice shown live in hero) |
| `sections/three-ideas.tsx` | **Folded** → "One app, not five" |
| `sections/local-data.tsx` | **Kept**, copy refreshed → "Local-first" |
| `sections/faq.tsx` | **Optional/trimmed** (resolve on review) |
| `sections/whats-next.tsx` | **Cut** from home (beta scarcity replaced by Download + free-beta) |
| `sections/final-cta.tsx` | **Repurposed** → Download-for-Mac close |
| `ui/*`, `sirius/appui/*`, `sirius/orb.tsx`, `notice-card-mock.tsx` | **Kept** — shared primitives |
| **New:** Pricing section | Built fresh |
| **New:** social-posts demo film | Built fresh |

Cut components are removed from `page.tsx`; the files may be deleted in the
implementation PR once nothing imports them (confirm during execution).

## Visual / design system

Keep the existing tokens (`globals.css`): warm-dark `#1B1712`, gold accent
`#f0b35a`, cyan listening `#6cd8ff`, Fraunces display + Geist body, flat
tints/borders (no gradients per house style). The revamp is structural +
copy-led; visual treatment stays in the established system, refreshed where
sections are rebuilt. Signature elements keep native color (orb cyan, gold =
chrome/CTAs).

## Accessibility & responsive

- Reduced-motion: orb ambient-only, no mic prompt, demo jumps to payoff.
- Mic permission is opt-in; no audio leaves the browser; copy says so.
- Keyboard: orb is a real button (tap = trigger); CTA links focusable.
- Mobile: hero demo stacks; outcome cards 1-col; pricing card full-width.

## Out of scope

- The real download/distribution pipeline (.dmg hosting) — page links to
  whatever URL is provided; wiring is separate.
- The real price number (placeholder `$XX/mo`).
- Deleting/altering the `/demo` route and `StartupAnalystAppDemo`.
- Backend/waitlist API changes beyond repointing the CTA.

## Verification

No test runner (per `CLAUDE.md`):
`npx tsc --noEmit` + `npx eslint <changed files>` + `npm run build`
(`/` and `/demo` must still prerender static).

## Open questions (resolve during/after review)

- Real `$XX/mo` price.
- Keep a trimmed FAQ, or cut entirely?
- Exact 4 outcome cards (the paper offers 5: standup / meeting / client changes /
  posts / outreach — pick 4, since "posts" is now the hero demo).
