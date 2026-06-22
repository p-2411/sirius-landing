# Waitlist signup — design

Date: 2026-05-11
Status: Approved (brainstorming → ready for plan)

## Goal

Replace the fake `WaitlistForm` (timeout-only) with a real two-stage signup that:

1. Collects an email, persists it to Airtable.
2. Slides horizontally to a second step that collects a name and updates the same row.
3. Slides horizontally to a confirmation message.

The Airtable base is the authoritative store; we should be able to view, filter, and export rows directly from Airtable's web UI.

## Non-goals

- No rate limiter in v1 (flagged as a follow-up if traffic warrants).
- No automated tests (repo has none today; not introducing the apparatus for this change).
- No user accounts, magic links, or downstream email automation. Sending to the list happens externally.
- No analytics events.

## Architecture

```
Browser (WaitlistForm)  ──POST──▶  /api/waitlist  ──HTTPS──▶  Airtable REST API
                                       │
                                       └─ AIRTABLE_TOKEN / AIRTABLE_BASE_ID / AIRTABLE_TABLE_NAME (env, server-only)
```

- Token never reaches the client. All Airtable calls happen in a Next.js Route Handler at `app/api/waitlist/route.ts`.
- Two-stage submission, both stages POST to the same endpoint with a `stage` discriminator.
- Lookup-by-email both stages — no `recordId` round-tripped to the client, so refreshing between stages doesn't break anything.

### Airtable schema

One base. One table named `Waitlist` (configurable via env). Fields:

| Field | Type | Notes |
|---|---|---|
| `Email` | Single line text | Primary field. Stored lowercased + trimmed. |
| `Name` | Single line text | Populated in stage 2. Can be empty between stages. |
| `Created At` | Created time (Airtable built-in) | Auto. |
| `Source` | Single line text | Defaulted to `"landing"`. |

Airtable PAT scoped to this base with `data.records:read` + `data.records:write`.

## API

`POST /api/waitlist` — single endpoint, branches on `stage`.

### Stage 1 — email

Request body:
```json
{
  "stage": "email",
  "email": "you@example.com",
  "company": "",         // honeypot
  "elapsedMs": 4321      // ms since form mount
}
```

Server logic:
1. If `company` is non-empty OR `elapsedMs < 800` → return `200 { ok: true }` without touching Airtable (silent bot reject).
2. Validate email with `^[^\s@]+@[^\s@]+\.[^\s@]+$`. If invalid → `400 { ok: false, error: "invalid" }`.
3. Normalize: `email = email.trim().toLowerCase()`.
4. `findByEmail(email)`:
   - If found → return `200 { ok: true }` (no write).
   - If not found → `createEntry({ email, source: "landing" })`, return `200 { ok: true }`.
5. On Airtable network/5xx → `502 { ok: false, error: "server" }`.

### Stage 2 — name

Request body:
```json
{
  "stage": "name",
  "email": "you@example.com",
  "name": "Parham"
}
```

Server logic:
1. Validate `email` (same regex) and `name` (non-empty after trim, ≤ 120 chars). If invalid → `400 { ok: false, error: "invalid" }`.
2. Normalize email same as stage 1, trim name.
3. `findByEmail(email)`:
   - If found → `updateName(recordId, name)`, return `200 { ok: true }`.
   - If not found → upsert: `createEntry({ email, name, source: "landing" })`, return `200 { ok: true }`. (Handles the edge case where stage 1 was bypassed or the row was deleted between stages.)
4. On Airtable error → `502 { ok: false, error: "server" }`.

### Why one endpoint, not two

Same auth surface, same validation helpers, same response shape. The `stage` discriminator is cheap and keeps the client a single `fetch` helper.

## Client — `WaitlistForm`

### State machine

```
'email'  ─submit─▶  'submittingEmail'  ─ok──▶  'name'
                                       │
                                       └─err─▶  'email' (inline error message)

'name'   ─submit─▶  'submittingName'   ─ok──▶  'done'
                                       │
                                       └─err─▶  'name'  (inline error message)
```

`done` is terminal — no reset, no edit.

### Transitions

- Single bar/border/button slot stays mounted. Content **inside** the bar is wrapped in `<AnimatePresence mode="wait">` keyed by step (`email` | `name` | `done`).
- Per-step motion: enter from `x: 24, opacity: 0`, exit to `x: -24, opacity: 0`, ~220 ms ease-out. Matches the "slides left" preview the user picked.
- Uses `motion` (already a dependency).

### Inputs and labels per step

| Step | Field | Placeholder | Button label |
|---|---|---|---|
| `email` | email | `you@example.com` | `Request access →` |
| `name`  | text  | `Your name`        | `Join →` |
| `done`  | — (display only) | — | (hidden) |

On `done`, the bar content becomes: `✓ You're on the list, {firstName or "you"}. We'll be in touch.`

`firstName` = `name.trim().split(/\s+/)[0]`.

### Anti-bot in the form

- Hidden honeypot: `<input name="company" tabIndex={-1} autoComplete="off" aria-hidden>` visually hidden via existing utility class. Sent with stage 1 only.
- `mountTime = performance.now()` captured in a `useRef` on mount. Each submit attaches `elapsedMs = performance.now() - mountTime` to stage 1 request.

### Validation

- **Client, stage 1:** same regex as today. Button disabled until match. Inline error if server rejects.
- **Client, stage 2:** name required, ≤ 120 chars, button disabled until non-empty after trim.

### Accessibility

- `<label htmlFor>` on the active input each step.
- `aria-invalid` toggled per step.
- Status line below bar: `<p aria-live="polite">` carries error text or empty.
- Focus moves to the newly-mounted input after each transition (use the same input id across steps so the SR experience is one continuous "fill in this field").

### Visual continuity

Keep current Tailwind classes for border, padding, button styling, status line. Only the inside of the bar changes.

## Files

### New

- `app/api/waitlist/route.ts` — `POST` handler. ~80 lines.
- `lib/airtable.ts` — `findByEmail(email)`, `createEntry({ email, name?, source })`, `updateName(recordId, name)`. Uses `fetch` against `https://api.airtable.com/v0/{baseId}/{table}`. No SDK dependency. ~60 lines.

### Modified

- `components/ui/waitlist-form.tsx` — rewrite around the state machine + `AnimatePresence`. Keeps existing Tailwind structure.
- `.env.local` (gitignored) — three vars below.
- `README.md` — short "Waitlist setup" section.

### Env vars

```
AIRTABLE_TOKEN=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_TABLE_NAME=Waitlist
```

`lib/airtable.ts` throws on missing env at first call; the route handler catches and returns `502 { ok: false, error: "server" }`.

## Error matrix

| Where | Surface |
|---|---|
| Invalid email format (client) | Inline error, no request sent |
| Invalid email (server) | 400 → inline error on email step |
| Honeypot or sub-800ms submit | 200 `{ ok: true }`, UI proceeds, no Airtable write (silent) |
| Airtable network / 5xx | 502 → inline "Something went wrong, try again." on current step |
| Empty name (client) | Submit disabled |
| Empty name (server) | 400 → inline error on name step |
| Missing env vars | First call throws; route returns 502 |

## Test plan (manual)

1. Happy path: fresh email → stage 1 creates row → stage 2 patches `Name`.
2. Duplicate email at stage 1: existing row is found, no new row created, UI still advances to name step, stage 2 patches the existing row's `Name`.
3. Invalid email at stage 1: inline error, no Airtable call.
4. Empty name at stage 2: submit disabled.
5. Honeypot trip: fill `company` via devtools → UI advances, no Airtable row.
6. Sub-800ms submit: paste email and submit immediately → UI advances, no Airtable row.
7. Airtable token missing: stage 1 returns 502, inline error.
8. Refresh between stage 1 and stage 2: re-entering same email still works (upsert path).

## Follow-ups (not in v1)

- Rate limiter (e.g., Upstash Ratelimit) if the form sees abuse.
- Send the row to Resend/Mailchimp from a background job.
- Analytics event on submit.
