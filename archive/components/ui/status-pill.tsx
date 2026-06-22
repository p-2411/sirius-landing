import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "running" | "done" | "failed" | "gated" | "idle";

const tones: Record<Tone, { text: string; border: string; dot: string; pulse: boolean }> = {
  running: { text: "var(--color-state-listening-strong)", border: "rgba(108,216,255,0.32)", dot: "var(--color-state-listening-strong)", pulse: true },
  done:    { text: "var(--color-success)", border: "rgba(167,219,178,0.32)", dot: "var(--color-success)", pulse: false },
  failed:  { text: "var(--color-danger)",  border: "rgba(240,163,163,0.32)", dot: "var(--color-danger)",  pulse: false },
  gated:   { text: "var(--color-accent)",  border: "rgba(217,185,120,0.32)", dot: "var(--color-accent)",  pulse: false },
  idle:    { text: "var(--color-ink-3)",   border: "var(--color-border-strong)", dot: "transparent",      pulse: false },
};

export function StatusPill({ tone = "idle", children }: { tone?: Tone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium tracking-[0.02em]"
      style={{ color: t.text, border: `1px solid ${t.border}` }}
    >
      {t.dot !== "transparent" && (
        <span
          aria-hidden="true"
          className={cn("inline-block h-1.5 w-1.5 rounded-full", t.pulse && "motion-safe:animate-[sirius-pulse_1.6s_ease-in-out_infinite]")}
          style={{ background: t.dot }}
        />
      )}
      {children}
    </span>
  );
}
