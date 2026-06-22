# Waitlist Signup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fake `WaitlistForm` with a two-stage signup that persists email then name to Airtable, with horizontal slide transitions between email → name → confirmation.

**Architecture:** Next.js App Router Route Handler at `app/api/waitlist/route.ts` proxies to Airtable's REST API using a server-only PAT. Single endpoint dispatches on a `stage` discriminator (`"email"` | `"name"`). Client form is a 3-step state machine wrapped in `<AnimatePresence mode="wait">`. Lookup-by-email both stages — no record IDs cross the network boundary.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `motion` (already a dep), Airtable REST API (no SDK).

**Spec:** `docs/superpowers/specs/2026-05-11-waitlist-design.md`

**Testing note:** This repo has no test framework configured and the spec explicitly excludes adding one. Every task includes manual verification (curl + browser). If you find yourself wanting to add a test runner, stop and confirm with the user first.

---

## File map

| Path | Action | Responsibility |
|---|---|---|
| `lib/airtable.ts` | Create | Server-side Airtable client: `findByEmail`, `createEntry`, `updateName`. Reads env vars, throws on missing. |
| `app/api/waitlist/route.ts` | Create | `POST` handler. Validates, runs bot defenses, calls `lib/airtable.ts`, returns JSON. |
| `components/ui/waitlist-form.tsx` | Replace | Client state machine for email → name → done with horizontal motion transitions. |
| `.env.local` | Create (gitignored) | `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`. |
| `README.md` | Modify | Add "Waitlist setup" section. |

---

## Task 1: Airtable base + env vars

**Files:**
- Create: `.env.local` (gitignored — confirm `.env.local` is in `.gitignore` before writing; it already is)

**Out-of-code prerequisites (user does these once in Airtable's web UI; document the steps for them):**

1. Create a new Airtable base named `Sirius Landing` (or reuse an existing one).
2. Inside it create a table named exactly `Waitlist` with these fields:
   - `Email` — Single line text (primary field, the leftmost column)
   - `Name` — Single line text
   - `Source` — Single line text
   - `Created At` — **Created time** (Airtable's built-in field type, not a formula). Set time zone to UTC.
3. Visit `https://airtable.com/create/tokens` → create a Personal Access Token with:
   - Scopes: `data.records:read`, `data.records:write`
   - Access: only the `Sirius Landing` base
4. From the base URL `https://airtable.com/appXXXXXXXXXXXXXX/...`, copy the `appXXXXXXXXXXXXXX` segment — that's the base ID.

- [ ] **Step 1: Confirm `.env.local` is gitignored**

Run:
```bash
grep -E '^\.env\.local$|^\.env\.\*\.local$' .gitignore
```

Expected: at least one match. If nothing matches, stop and tell the user — do not proceed.

- [ ] **Step 2: Create `.env.local` with placeholder values the user will fill in**

Write file `/Users/parhamsepasgozar/Documents/GitHub/Sirius-Landing-Page/.env.local`:

```bash
# Airtable — waitlist
AIRTABLE_TOKEN=pat_REPLACE_ME
AIRTABLE_BASE_ID=app_REPLACE_ME
AIRTABLE_TABLE_NAME=Waitlist
```

- [ ] **Step 3: Verify the token + base work with a smoke-test curl**

After the user replaces the placeholders, run:
```bash
source .env.local && curl -sS -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer $AIRTABLE_TOKEN" \
  "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/$AIRTABLE_TABLE_NAME?maxRecords=1"
```

Expected: `200`. If you get `401` the token is wrong; `404` means base ID or table name is wrong; `403` means token scopes are insufficient.

- [ ] **Step 4: Do not commit `.env.local`**

Run:
```bash
git status --short -- .env.local
```

Expected: no output (file is ignored). If it shows up as untracked, double-check `.gitignore`.

- [ ] **Step 5: Commit nothing in this task**

This task creates only ignored files. No commit.

---

## Task 2: `lib/airtable.ts` server helper

**Files:**
- Create: `lib/airtable.ts`

- [ ] **Step 1: Write the file**

Create `/Users/parhamsepasgozar/Documents/GitHub/Sirius-Landing-Page/lib/airtable.ts`:

```ts
const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

type AirtableConfig = {
  token: string;
  baseId: string;
  tableName: string;
};

function readConfig(): AirtableConfig {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "Waitlist";
  if (!token || !baseId) {
    throw new Error("Airtable env vars missing (AIRTABLE_TOKEN / AIRTABLE_BASE_ID)");
  }
  return { token, baseId, tableName };
}

function tableUrl(cfg: AirtableConfig): string {
  return `${AIRTABLE_API_BASE}/${cfg.baseId}/${encodeURIComponent(cfg.tableName)}`;
}

function authHeaders(cfg: AirtableConfig): HeadersInit {
  return {
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
  };
}

export type WaitlistRecord = {
  id: string;
  email: string;
  name: string | null;
};

export async function findByEmail(email: string): Promise<WaitlistRecord | null> {
  const cfg = readConfig();
  const filter = `LOWER({Email})='${email.replace(/'/g, "\\'")}'`;
  const url = `${tableUrl(cfg)}?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`;
  const res = await fetch(url, { headers: authHeaders(cfg), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Airtable findByEmail failed: ${res.status}`);
  }
  const data = (await res.json()) as { records: Array<{ id: string; fields: Record<string, unknown> }> };
  const row = data.records[0];
  if (!row) return null;
  return {
    id: row.id,
    email: String(row.fields.Email ?? ""),
    name: (row.fields.Name as string | undefined) ?? null,
  };
}

export async function createEntry(input: {
  email: string;
  name?: string;
  source: string;
}): Promise<WaitlistRecord> {
  const cfg = readConfig();
  const body = {
    records: [
      {
        fields: {
          Email: input.email,
          ...(input.name ? { Name: input.name } : {}),
          Source: input.source,
        },
      },
    ],
  };
  const res = await fetch(tableUrl(cfg), {
    method: "POST",
    headers: authHeaders(cfg),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Airtable createEntry failed: ${res.status}`);
  }
  const data = (await res.json()) as { records: Array<{ id: string; fields: Record<string, unknown> }> };
  const row = data.records[0];
  return {
    id: row.id,
    email: String(row.fields.Email ?? ""),
    name: (row.fields.Name as string | undefined) ?? null,
  };
}

export async function updateName(recordId: string, name: string): Promise<void> {
  const cfg = readConfig();
  const url = `${tableUrl(cfg)}/${recordId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(cfg),
    body: JSON.stringify({ fields: { Name: name } }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Airtable updateName failed: ${res.status}`);
  }
}
```

Notes for the implementer:
- `filterByFormula` with `LOWER({Email})='...'` makes the lookup case-insensitive. Email is normalized to lowercase before reaching this helper, but `LOWER()` is belt-and-suspenders against a manually-edited Airtable row.
- The `'` escape (`replace(/'/g, "\\'")`) prevents formula injection. We additionally validate email format upstream — but the escape is mandatory in case a future caller skips validation.
- `cache: "no-store"` prevents Next from caching read/write requests to Airtable.
- This module is server-only by virtue of using `process.env` secrets — never import from a `"use client"` file.

- [ ] **Step 2: Type-check the file**

Run:
```bash
npx tsc --noEmit
```

Expected: exit 0, no new errors involving `lib/airtable.ts`. (Pre-existing errors in other files may exist — confirm by diffing against a baseline `npx tsc --noEmit` run on the prior commit if needed.)

- [ ] **Step 3: Commit**

```bash
git add lib/airtable.ts
git commit -m "$(cat <<'EOF'
feat(waitlist): add Airtable server client

Three functions: findByEmail (case-insensitive), createEntry, updateName.
Reads AIRTABLE_TOKEN / AIRTABLE_BASE_ID / AIRTABLE_TABLE_NAME from env,
throws if missing. No SDK dependency — uses fetch directly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `app/api/waitlist/route.ts` POST handler

**Files:**
- Create: `app/api/waitlist/route.ts`

- [ ] **Step 1: Write the file**

Create `/Users/parhamsepasgozar/Documents/GitHub/Sirius-Landing-Page/app/api/waitlist/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

import { createEntry, findByEmail, updateName } from "@/lib/airtable";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LEN = 120;
const MIN_ELAPSED_MS = 800;

type EmailStageBody = {
  stage: "email";
  email: unknown;
  company?: unknown;
  elapsedMs?: unknown;
};

type NameStageBody = {
  stage: "name";
  email: unknown;
  name: unknown;
};

type Body = EmailStageBody | NameStageBody | { stage?: unknown };

function ok() {
  return NextResponse.json({ ok: true });
}

function bad(reason: "invalid" | "server", status: number) {
  return NextResponse.json({ ok: false, error: reason }, { status });
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad("invalid", 400);
  }

  if (body.stage === "email") {
    const { email, company, elapsedMs } = body;

    if (isString(company) && company.length > 0) return ok();
    if (typeof elapsedMs === "number" && elapsedMs < MIN_ELAPSED_MS) return ok();

    if (!isString(email)) return bad("invalid", 400);
    const normalized = normalizeEmail(email);
    if (!EMAIL_REGEX.test(normalized)) return bad("invalid", 400);

    try {
      const existing = await findByEmail(normalized);
      if (!existing) {
        await createEntry({ email: normalized, source: "landing" });
      }
      return ok();
    } catch (error) {
      console.error("[waitlist] stage=email failed", error);
      return bad("server", 502);
    }
  }

  if (body.stage === "name") {
    const { email, name } = body;

    if (!isString(email) || !isString(name)) return bad("invalid", 400);
    const normalizedEmail = normalizeEmail(email);
    const trimmedName = name.trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) return bad("invalid", 400);
    if (trimmedName.length === 0 || trimmedName.length > NAME_MAX_LEN) {
      return bad("invalid", 400);
    }

    try {
      const existing = await findByEmail(normalizedEmail);
      if (existing) {
        await updateName(existing.id, trimmedName);
      } else {
        await createEntry({ email: normalizedEmail, name: trimmedName, source: "landing" });
      }
      return ok();
    } catch (error) {
      console.error("[waitlist] stage=name failed", error);
      return bad("server", 502);
    }
  }

  return bad("invalid", 400);
}
```

Notes:
- `runtime = "nodejs"` (not edge) to keep `fetch` semantics straightforward and avoid edge-runtime env-var surprises during dev.
- Honeypot and min-time return 200 silently — the bot proceeds through the UI but no Airtable write happens.
- The stage-2 upsert (`if (existing) update else create-with-name`) matches the spec's "always advance" decision and handles the edge case of stage 1 being skipped.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: exit 0 (or no new errors in the new file).

- [ ] **Step 3: Start the dev server**

Run in a separate terminal (or background):
```bash
npm run dev
```

Wait for `Ready in` log line. Server runs at `http://localhost:3000`.

- [ ] **Step 4: Curl-test stage 1 — happy path**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"plan-test-1@example.com","company":"","elapsedMs":5000}'
```

Expected: `{"ok":true}`. Check Airtable — a new row should exist with `Email=plan-test-1@example.com`, `Source=landing`, `Name` empty.

- [ ] **Step 5: Curl-test stage 1 — duplicate**

Repeat the same curl. Expected: `{"ok":true}`, **no second row** in Airtable.

- [ ] **Step 6: Curl-test stage 2 — patch name**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"name","email":"plan-test-1@example.com","name":"Plan Tester"}'
```

Expected: `{"ok":true}`. The Airtable row's `Name` column should now read `Plan Tester`.

- [ ] **Step 7: Curl-test invalid email**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"not-an-email","elapsedMs":5000}'
```

Expected: `400`.

- [ ] **Step 8: Curl-test honeypot**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"bot@example.com","company":"AcmeBot","elapsedMs":5000}'
```

Expected: `{"ok":true}`, **no Airtable row** for `bot@example.com`.

- [ ] **Step 9: Curl-test min-time**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"fast@example.com","elapsedMs":300}'
```

Expected: `{"ok":true}`, **no Airtable row** for `fast@example.com`.

- [ ] **Step 10: Delete the Airtable test rows manually**

In the Airtable UI, delete `plan-test-1@example.com` so it doesn't appear in the final demo. The bot/fast rows shouldn't exist anyway — confirm.

- [ ] **Step 11: Commit**

```bash
git add app/api/waitlist/route.ts
git commit -m "$(cat <<'EOF'
feat(waitlist): add /api/waitlist route handler

Two-stage POST endpoint dispatched on `stage` field. Stage 1 creates an
Airtable row keyed by email (no-op on dup). Stage 2 upserts the Name field
by email. Honeypot (`company`) and min-elapsed-ms gates silently absorb
likely-bot submissions.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Rewrite `WaitlistForm` with state machine + motion

**Files:**
- Replace: `components/ui/waitlist-form.tsx`

- [ ] **Step 1: Rewrite the component**

Overwrite `/Users/parhamsepasgozar/Documents/GitHub/Sirius-Landing-Page/components/ui/waitlist-form.tsx` with:

```tsx
"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Step = "email" | "submittingEmail" | "name" | "submittingName" | "done" | "errorEmail" | "errorName";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LEN = 120;

type ApiResponse = { ok: boolean; error?: "invalid" | "server" };

async function postWaitlist(payload: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as ApiResponse;
  } catch {
    return { ok: false, error: "server" };
  }
}

export function WaitlistForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errorMessage, setErrorMessage] = useState("");

  const mountTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reducedMotion = useReducedMotion();
  const inputId = useId();
  const statusId = useId();

  useEffect(() => {
    mountTimeRef.current = performance.now();
  }, []);

  // Focus management: when step changes to a step that renders an input, focus it.
  useEffect(() => {
    if (step === "email" || step === "name") {
      // wait one frame so the new input is mounted post-AnimatePresence swap
      const id = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => window.cancelAnimationFrame(id);
    }
  }, [step]);

  const visibleStep: "email" | "name" | "done" =
    step === "done"
      ? "done"
      : step === "name" || step === "submittingName" || step === "errorName"
        ? "name"
        : "email";

  const isSubmitting = step === "submittingEmail" || step === "submittingName";

  const onSubmitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) {
      setErrorMessage("Enter a valid email address.");
      setStep("errorEmail");
      return;
    }
    setErrorMessage("");
    setStep("submittingEmail");
    const elapsedMs = performance.now() - mountTimeRef.current;
    const res = await postWaitlist({
      stage: "email",
      email: normalized,
      company,
      elapsedMs,
    });
    if (!res.ok) {
      setErrorMessage(
        res.error === "invalid" ? "Enter a valid email address." : "Something went wrong. Try again.",
      );
      setStep("errorEmail");
      return;
    }
    setEmail(normalized);
    setStep("name");
  };

  const onSubmitName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0 || trimmed.length > NAME_MAX_LEN) {
      setErrorMessage("Enter your name.");
      setStep("errorName");
      return;
    }
    setErrorMessage("");
    setStep("submittingName");
    const res = await postWaitlist({
      stage: "name",
      email,
      name: trimmed,
    });
    if (!res.ok) {
      setErrorMessage(
        res.error === "invalid" ? "Enter your name." : "Something went wrong. Try again.",
      );
      setStep("errorName");
      return;
    }
    setName(trimmed);
    setStep("done");
  };

  const firstName = name.trim().split(/\s+/)[0] || "you";

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: 24, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -24, opacity: 0 },
        transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
      };

  const showInputRow = visibleStep !== "done";

  return (
    <form
      onSubmit={visibleStep === "email" ? onSubmitEmail : onSubmitName}
      noValidate
      className="w-full"
    >
      {/* honeypot — visually hidden, not announced */}
      <label className="sr-only" aria-hidden="true">
        Company
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </label>

      <div
        className={`relative flex min-h-[44px] items-end gap-4 border-b pb-3 transition-colors duration-200 ${
          showInputRow
            ? "border-[var(--color-border-strong)] focus-within:border-[var(--color-accent)]"
            : "border-transparent"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {visibleStep === "email" && (
            <motion.div key="email" {...motionProps} className="flex w-full items-end gap-4">
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (step === "errorEmail") {
                    setErrorMessage("");
                    setStep("email");
                  }
                }}
                placeholder="you@example.com"
                aria-describedby={statusId}
                aria-invalid={step === "errorEmail"}
                disabled={isSubmitting}
                className="min-w-0 flex-1 bg-transparent text-[18px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSubmitting || !EMAIL_REGEX.test(email.trim())}
                className="shrink-0 text-[14px] font-medium tracking-tight text-[var(--color-text-primary)] underline-offset-4 transition hover:underline decoration-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]"
              >
                {step === "submittingEmail" ? "Sending" : "Request access →"}
              </button>
            </motion.div>
          )}

          {visibleStep === "name" && (
            <motion.div key="name" {...motionProps} className="flex w-full items-end gap-4">
              <label htmlFor={inputId} className="sr-only">
                Your name
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="text"
                autoComplete="given-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (step === "errorName") {
                    setErrorMessage("");
                    setStep("name");
                  }
                }}
                placeholder="Your name"
                aria-describedby={statusId}
                aria-invalid={step === "errorName"}
                disabled={isSubmitting}
                className="min-w-0 flex-1 bg-transparent text-[18px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSubmitting || name.trim().length === 0}
                className="shrink-0 text-[14px] font-medium tracking-tight text-[var(--color-text-primary)] underline-offset-4 transition hover:underline decoration-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-text-disabled)]"
              >
                {step === "submittingName" ? "Sending" : "Join →"}
              </button>
            </motion.div>
          )}

          {visibleStep === "done" && (
            <motion.p
              key="done"
              {...motionProps}
              className="w-full text-[18px] text-[var(--color-text-primary)]"
            >
              <span aria-hidden="true">✓ </span>You&apos;re on the list, {firstName}. We&apos;ll be in touch.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p
        id={statusId}
        aria-live="polite"
        className="mt-4 min-h-[1.25rem] text-[13px] leading-5 text-[var(--color-text-muted)]"
      >
        {errorMessage}
      </p>
    </form>
  );
}
```

Notes:
- `useId` keeps the same input `id` across steps so label/aria associations stay valid as `AnimatePresence` swaps children.
- The same `inputRef` is bound on the email and name inputs — only one is mounted at a time, so the ref always points at the current input. `requestAnimationFrame` ensures focus runs after the mount.
- `useReducedMotion` collapses the slide to a fade so motion-sensitive users still see a clean transition.
- The honeypot field is wrapped in an `sr-only` label and excluded from the accessibility tree via `aria-hidden`. Real users with screen readers won't see it; bots that fill all inputs will trip it.
- Button is disabled both during submission and when the value doesn't validate locally — matches existing UX patterns in the file.

- [ ] **Step 2: Type-check**

Run:
```bash
npx tsc --noEmit
```

Expected: exit 0 (or no new errors from this file).

- [ ] **Step 3: Lint**

Run:
```bash
npm run lint -- components/ui/waitlist-form.tsx
```

Expected: no errors in the new file. Warnings about the rest of the repo are fine.

- [ ] **Step 4: Manual browser test — happy path**

With `npm run dev` running, open `http://localhost:3000` and scroll to the final CTA section.

1. Type `browser-test@example.com` → click `Request access →`.
2. Confirm the email field slides out to the left and the name field slides in.
3. Type `Browser Tester` → click `Join →`.
4. Confirm the bar slides to `✓ You're on the list, Browser. We'll be in touch.`.
5. Check Airtable: row exists with `Email=browser-test@example.com`, `Name=Browser Tester`.

- [ ] **Step 5: Manual browser test — invalid email**

Refresh, type `nope` → button should be disabled. Type `nope@x` → still disabled (no TLD). Type `nope@x.co` → button enables. (Confirms client-side regex matches server regex.)

- [ ] **Step 6: Manual browser test — server error path**

Stop the dev server, open devtools, type a valid email, submit. Expected: status line shows `Something went wrong. Try again.`. Restart dev server, fix.

- [ ] **Step 7: Manual browser test — duplicate email**

Submit `browser-test@example.com` again. Stage 1 should silently succeed (no second row in Airtable). Submit `Different Name`. Stage 2 should patch the row — confirm in Airtable that `Name` is now `Different Name`.

- [ ] **Step 8: Manual browser test — reduced motion**

In Chrome devtools: ⋮ → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce`. Refresh and run the happy path again — slide animation should be replaced with a fade.

- [ ] **Step 9: Delete browser-test rows in Airtable**

Clean up.

- [ ] **Step 10: Commit**

```bash
git add components/ui/waitlist-form.tsx
git commit -m "$(cat <<'EOF'
feat(waitlist): two-stage signup with sliding bar transitions

Replaces the timeout-only mock with a real state machine that POSTs to
/api/waitlist twice — once to capture the email, once to patch the name.
AnimatePresence handles the horizontal slide between email -> name -> done.
useReducedMotion falls back to a fade. Honeypot + same input id across
steps preserve a11y.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: README "Waitlist setup" section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current README to find a sensible insertion point**

Run:
```bash
cat README.md
```

Pick a spot after any "Getting started" / "Development" section. If no obvious section exists, append at the end.

- [ ] **Step 2: Add the section**

Append (or insert) this section:

````markdown
## Waitlist setup

The landing page's signup form posts to `/api/waitlist`, which writes to an
Airtable base.

**One-time Airtable setup**

1. Create an Airtable base. Inside it, create a table named `Waitlist` with
   these fields:
   - `Email` — Single line text (primary field)
   - `Name` — Single line text
   - `Source` — Single line text
   - `Created At` — Created time (Airtable built-in type), UTC
2. At https://airtable.com/create/tokens create a Personal Access Token with
   scopes `data.records:read` and `data.records:write`, restricted to that base.
3. Copy the base ID from the base URL (`https://airtable.com/appXXXXXXXXXXXXXX/...`).

**Local env vars**

Add to `.env.local` (gitignored):

```bash
AIRTABLE_TOKEN=pat_...
AIRTABLE_BASE_ID=app_...
AIRTABLE_TABLE_NAME=Waitlist
```

**Production**

Set the same three vars in your host's environment (e.g. Vercel project
settings → Environment Variables).

**Smoke test**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"smoke@example.com","elapsedMs":5000}'
# expect: {"ok":true}
```
````

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: add Waitlist setup section to README

Documents the Airtable schema, PAT scopes, env vars, and a smoke-test curl
for the new /api/waitlist endpoint.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Full end-to-end verification

This task adds nothing new — it's a single, deliberate pass to confirm the spec's "Test plan (manual)" all works against the final state.

- [ ] **Step 1: Confirm dev server is still running on a clean build**

Stop and restart:
```bash
# Ctrl-C the existing dev server, then:
npm run dev
```

- [ ] **Step 2: Run spec test plan items 1–8**

For each, record pass/fail in your scratchpad:

1. Happy path with a fresh email (`final-test-1@example.com`, name `Final One`).
2. Duplicate stage 1 with the same email — no new row.
3. Invalid email `not-an-email` — button stays disabled; if you bypass with devtools and submit, server returns 400 and status line shows error.
4. Empty name at stage 2 — submit button disabled.
5. Honeypot: in devtools, set the hidden `company` input's value to `Bot`, submit a fresh email `bot-final@example.com`. Status proceeds. Confirm **no row** in Airtable.
6. Sub-800ms: in devtools, evaluate `document.querySelector('form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))` within ~500ms of page load with `submit-fast@example.com` typed. Confirm no row. (Alternatively: temporarily change `MIN_ELAPSED_MS` to 5000, reload, submit quickly, confirm, then revert.)
7. Token missing: temporarily set `AIRTABLE_TOKEN=` (empty) in `.env.local`, restart dev server, submit — expect 502 surfaced as "Something went wrong." Restore the token.
8. Refresh between stages: submit email, then hit reload before name — refill same email, advance to name step (server returns ok), submit name — confirm the original row is patched, not a new row created.

- [ ] **Step 3: Delete all `*-test-*` and `*-final-*` Airtable rows**

Clean state for production.

- [ ] **Step 4: Verify the build passes**

Run:
```bash
npm run build
```

Expected: exit 0. If type or lint errors surface that didn't appear under `npx tsc --noEmit`, fix them.

- [ ] **Step 5: Final commit (if any fix-ups were needed)**

If Step 4 required code changes:
```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(waitlist): resolve build issues found in final verification

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If no changes — no commit.

- [ ] **Step 6: Report completion to the user**

Summarize: which spec test-plan items passed, any deviations from the spec, links to the commits, and a reminder to set the three env vars in the production host before deploying.

---

## Out of scope (do NOT do)

- Adding a test runner / jest / vitest. Spec excludes automated tests.
- Adding a rate limiter. Spec defers it.
- Refactoring `final-cta.tsx` — it consumes `WaitlistForm` as a black box and shouldn't need changes.
- Touching any of the other unstaged files in the working tree (`hero.tsx`, `three-ideas.tsx`, etc.) — they belong to a separate in-flight effort.
- Renaming the existing `WaitlistForm` export. `final-cta.tsx` imports it by name.
