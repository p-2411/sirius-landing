# Hero "What do I have on today?" rundown demo — design

**Date:** 2026-06-06
**Status:** Approved (design), pending implementation plan
**Supersedes:** the hero's "Weekly social posts" directed film (`SocialPostsDemo`)

## Goal

Replace the hero's self-playing demo with a more relatable, outcome-led scenario:
the user asks Sirius **"What do I have on today?"**, and Sirius answers with a
spoken-then-written rundown of the day — calendar + inbox — highlights an email
from **Chris**, and crucially reports an action it has **already taken** on the
user's behalf (drafted a reply rescheduling, put a tentative calendar hold),
then asks for confirmation.

This lands four positioning pillars in one ~12-second loop:

- **Knows you** — your schedule, your people (Priya, Chris).
- **Reads across your tools** — calendar + inbox in one answer.
- **Acts on your behalf** — already drafted the reply and held the time (the hero beat).
- **Keeps you in control** — "Want me to send it?"

Audience constraint (CLAUDE.md): high-agency non-engineers. Lead with the felt
outcome; no machinery, no jargon, no numbers/metrics in copy.

## Why the hero demo (not /demo)

The scenario is a spoken question with an immediate answer — a natural fit for the
voice-orb hero demo. `SocialPostsDemo` is imported **only** by `hero.tsx`, and
`lib/social-posts-demo.ts` is imported only by that component, so the scenario can
be replaced cleanly. The `/demo` page (full dealflow app run) is unaffected.

## Fidelity to the real app (CLAUDE.md "demo must represent the real app")

- The **home (voice) surface** mirrors the app's voice home (`app/app/page.tsx`):
  persistent 72px rail, centered orb, transcript line.
- The **chat surface** reuses `components/sirius/appui/chat-pane.tsx`, which is a
  faithful static port of the app's chat pane and message bubbles.
- The **home → chat slide-up** is a demo transition. It is a believable extension
  of the real model (the app has both a voice home and chat surfaces); it does not
  invent a new product surface. Flag for review if a stricter reading is wanted.
- Theme tokens unchanged (dark, gold accent, cyan listening, Fraunces/Geist/JetBrains).

## Flow (directed film, looped)

1. **Home (voice).** Orb centered. The directed cursor taps the orb → orb enters
   `user` (listening) state → the question transcribes word-by-word:
   **"What do I have on today?"**
2. **Slide-up.** The chat surface slides up from the bottom over the home surface.
3. **Chat (text answer).** `ChatPane` shows the user message; the orb pulses
   (`sirius`) and the answer **streams word-by-word** (see Copy below).
4. **Rest + loop.** The closing question ("Want me to send it?") holds for a beat,
   then the scrubber loops back to the start.

Playback controls are unchanged from the current demo: RAF-driven `elapsed`
timeline, play/pause, click-to-seek, auto-loop, reduced-motion shows the final
state, IntersectionObserver starts playback on scroll-in.

## Copy (lives in `lib/today-demo.ts`)

**User prompt (spoken, transcribed):**
> What do I have on today?

**Sirius answer (streamed, paragraph breaks shown):**
> Morning. Three things on your calendar: standup at 9:30, lunch with Priya at 1,
> and your call with Chris at 4.
>
> Your inbox is light — four that actually need you. The one worth flagging: Chris
> wrote asking to push the 4pm; something came up on his end.
>
> I've already drafted a reply proposing tomorrow at 11 and put a tentative hold on
> both calendars. Want me to send it?

Notes:
- Names/times are placeholders that read as a real founder's day; keep them
  concrete but generic.
- No metrics, no "deterministic/workflow/model" words. The proactive action is the
  emotional peak — keep it in plain language.

## Components & data

### `lib/today-demo.ts` (new)
Pure data, no rendering. Exports:
- `HOME_PROMPT: string` — the question.
- `ANSWER_PARAGRAPHS: string[]` — the answer split into paragraphs (the renderer
  streams across the flattened word list and re-inserts paragraph breaks).
- Any small labels needed by the surfaces (e.g. transcript hint text).

### `components/sirius/today-demo.tsx` (new) — `TodayDemo`
The directed-film harness, adapted from `social-posts-demo.tsx`:
- Reuses `ScaledShot` (1360×850 design scaled into the player), `Rail`, `Orb`,
  and `ChatPane`.
- Two surfaces via a `surfaceFor(t)` helper: `home` and `chat`.
- Timeline `TL` derived from word counts of `HOME_PROMPT` and the flattened
  answer, so transcript typing and the answer stream always line up:
  - `orbClick → userStart → promptDone` (question transcribes)
  - `slideStart` (chat slides up) `→ siriusStart → answerDone` (answer streams)
  - `rest` (hold on the closing question) `→ total` (loop)
- Orb state mapping: `idle` → `user` (while the prompt transcribes) → `idle`
  (beat) → `sirius` (while the answer streams) → `idle`.
- Slide-up transition: chat surface `translateY(100% → 0)` with the home surface
  beneath; reduced-motion = instant.
- Directed cursor overlay (reused) taps the orb at `orbClick`.
- Scrubber (play/pause/seek/loop) reused verbatim.

### `components/sections/hero.tsx` (edit)
Swap `SocialPostsDemo` import/usage for `TodayDemo`. No other hero changes.

### Removals
Delete `components/sirius/social-posts-demo.tsx` and `lib/social-posts-demo.ts`
once `TodayDemo` is wired and the build is green (they have no other importers).

## Out of scope

- No change to `/demo` (dealflow app demo).
- No new app integrations or backend; this is a directed visual demo only.
- No interactive "send" — the closing question is rhetorical within the loop.

## Verification

Per CLAUDE.md (no test runner):
- `npx tsc --noEmit`
- `npx eslint` on changed/new files
- `npm run build` (`/` and `/demo` must still prerender static)
- Manual: scroll-in autoplay, play/pause, seek, loop, and reduced-motion all
  behave; transcript and answer stream stay aligned; slide-up reads cleanly.
