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

type Body = EmailStageBody | NameStageBody;

function ok() {
  return NextResponse.json({ ok: true });
}

function bad(reason: "invalid" | "server", status: 400 | 502) {
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
