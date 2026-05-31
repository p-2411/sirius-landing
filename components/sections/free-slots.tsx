"use client";

import { useEffect, useState } from "react";

// The countdown begins at this moment; before it, all slots show as available.
// The counter is a deterministic function of (now − LAUNCH).
const LAUNCH = Date.parse("2026-06-02T11:00:00");

/**
 * Slots consumed since launch, on a decelerating schedule:
 *   • 2 per 10 min for the first 30 min      (→ 6)
 *   • 1 per 10 min for the next hour         (→ 6)
 *   • 1 per 5 hours thereafter
 */
function consumed(elapsedMin: number): number {
  if (elapsedMin <= 0) return 0;
  let used = 0;
  used += Math.floor(Math.min(elapsedMin, 30) / 10) * 2;
  if (elapsedMin > 30) used += Math.floor((Math.min(elapsedMin, 90) - 30) / 10);
  if (elapsedMin > 90) used += Math.floor((elapsedMin - 90) / 300);
  return used;
}

function slotsLeft(now: number, limit: number): number {
  const min = (now - LAUNCH) / 60000;
  return Math.max(1, limit - consumed(min));
}

export function FreeSlots({ limit = 20 }: { limit?: number }) {
  // Client-only (depends on the current time) — render nothing until mounted
  // so server and client markup match.
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(slotsLeft(Date.now(), limit));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [limit]);

  if (left == null) return null;
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
