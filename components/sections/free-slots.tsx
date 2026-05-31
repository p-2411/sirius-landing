"use client";

import { useEffect, useState } from "react";

/**
 * FreeSlots — live count of remaining free downloads (capped at `limit`),
 * read from /api/free-download which counts real signups. Shows "sold out"
 * once the cap is reached. Renders nothing until the first fetch resolves.
 */
export function FreeSlots({ limit = 20 }: { limit?: number }) {
  const [state, setState] = useState<{ remaining: number; soldOut: boolean } | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/free-download", { cache: "no-store" });
        const d = (await res.json()) as { remaining?: number; soldOut?: boolean };
        if (alive && typeof d.remaining === "number") {
          setState({ remaining: d.remaining, soldOut: Boolean(d.soldOut) });
        }
      } catch {
        /* leave previous state */
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (!state) return null;

  if (state.soldOut) {
    return (
      <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-deep)] p-3 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
        All {limit} free spots claimed — sold out
      </div>
    );
  }

  const left = state.remaining;
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
