import { NextRequest, NextResponse } from "next/server";

import { countDownloads, createDownload, downloadExists } from "@/lib/airtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 120;
const MOBILE_MAX = 40;

function isString(v: unknown): v is string {
  return typeof v === "string";
}

// GET — how many free slots remain.
export async function GET() {
  try {
    const count = await countDownloads();
    const remaining = Math.max(0, LIMIT - count);
    return NextResponse.json({ remaining, limit: LIMIT, soldOut: remaining <= 0 });
  } catch (error) {
    // Backend unavailable → don't block the page; report full availability.
    console.error("[free-download] GET failed", error);
    return NextResponse.json({ remaining: LIMIT, limit: LIMIT, soldOut: false, degraded: true });
  }
}

// POST — claim a free download slot.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const name = isString(body.name) ? body.name.trim() : "";
  const email = isString(body.email) ? body.email.trim().toLowerCase() : "";
  const mobile = isString(body.mobile) ? body.mobile.trim() : "";
  const consent = body.consent === true;

  if (name.length === 0 || name.length > NAME_MAX) {
    return NextResponse.json({ ok: false, error: "name" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 400 });
  }
  if (mobile.length > MOBILE_MAX) {
    return NextResponse.json({ ok: false, error: "mobile" }, { status: 400 });
  }

  try {
    // Already claimed with this email → idempotent success, don't take a 2nd slot.
    if (await downloadExists(email)) {
      const count = await countDownloads();
      return NextResponse.json({ ok: true, already: true, remaining: Math.max(0, LIMIT - count) });
    }

    const count = await countDownloads();
    if (count >= LIMIT) {
      return NextResponse.json({ ok: false, soldOut: true, remaining: 0 }, { status: 409 });
    }

    await createDownload({ name, email, mobile: mobile || undefined, consent });
    return NextResponse.json({ ok: true, remaining: Math.max(0, LIMIT - (count + 1)) });
  } catch (error) {
    console.error("[free-download] POST failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 502 });
  }
}
