"use client";

import { useEffect, useState } from "react";

// Decay begins at this instant — 11:30am AEST (UTC+10). Before it, decay = full.
const LAUNCH = Date.parse("2026-06-02T11:30:00+10:00");

/**
 * Time-based "slots consumed" on a decelerating schedule, drops at the START
 * of each interval (first −2 lands at launch → 18):
 *   • 2 per 10 min for the first 30 min   (→ 6)
 *   • 1 per 10 min for the next hour      (→ 6)
 *   • 1 per 5 hours thereafter
 */
function consumed(elapsedMin: number): number {
  if (elapsedMin < 0) return 0;
  let used = Math.min(Math.floor(elapsedMin / 10) + 1, 3) * 2;
  if (elapsedMin >= 30) used += Math.min(Math.floor((elapsedMin - 30) / 10) + 1, 6);
  if (elapsedMin >= 90) used += Math.floor((elapsedMin - 90) / 300) + 1;
  return used;
}

/** Decayed remaining — floored at 1 so the decay alone never "sells out". */
function decayRemaining(limit: number): number {
  const min = (Date.now() - LAUNCH) / 60000;
  return Math.max(1, limit - consumed(min));
}

/**
 * FreeSlots — shows min(time-decay, real remaining). The decay drives urgency
 * (down to 1); only real signups filling all `limit` slots flip it to sold out.
 */
export function FreeSlots({ limit = 20 }: { limit?: number }) {
  const [actual, setActual] = useState<{ remaining: number; soldOut: boolean } | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    let alive = true;
    const loadApi = async () => {
      try {
        const res = await fetch("/api/free-download", { cache: "no-store" });
        const d = (await res.json()) as { remaining?: number; soldOut?: boolean };
        if (alive && typeof d.remaining === "number") {
          setActual({ remaining: d.remaining, soldOut: Boolean(d.soldOut) });
        }
      } catch {
        /* keep previous */
      }
    };
    loadApi();
    const apiId = setInterval(loadApi, 30_000);
    const tickId = setInterval(() => tick((n) => n + 1), 15_000); // re-evaluate decay
    return () => {
      alive = false;
      clearInterval(apiId);
      clearInterval(tickId);
    };
  }, []);

  if (!actual) return null;

  if (actual.soldOut) {
    return (
      <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-deep)] p-3 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
        All {limit} free spots claimed — sold out
      </div>
    );
  }

  const left = Math.min(decayRemaining(limit), actual.remaining);
  const pct = Math.max(4, (left / limit) * 100);
  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-deep)] p-3">
      <div className="flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
        <span>Only the first {limit}</span>
        <span className="text-[var(--color-accent)]">
          <span className="text-[13px] font-semibold tabular-nums">{left}</span> left
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border-strong)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
