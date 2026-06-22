export type AppPillTone =
  | "idle"
  | "running"
  | "awaiting"
  | "done"
  | "failed"
  | "gated"
  | "paused"
  | "scheduled";

type PillSpec = {
  fg: string;
  border: string;
  dot: string;
  pulsing?: boolean;
};

const PILL_SPECS: Record<AppPillTone, PillSpec> = {
  idle: {
    fg: "var(--color-ink-3)",
    border: "var(--color-border)",
    dot: "var(--color-ink-4)",
  },
  running: {
    fg: "var(--color-state-listening)",
    border: "var(--color-border-strong)",
    dot: "var(--color-state-listening)",
    pulsing: true,
  },
  awaiting: {
    fg: "var(--color-accent)",
    border: "var(--color-accent-muted)",
    dot: "var(--color-accent)",
  },
  done: {
    fg: "var(--color-success)",
    border: "var(--color-border-strong)",
    dot: "var(--color-success)",
  },
  failed: {
    fg: "var(--color-danger)",
    border: "var(--color-border-strong)",
    dot: "var(--color-danger)",
  },
  gated: {
    fg: "var(--color-accent-muted)",
    border: "var(--color-accent-muted)",
    dot: "var(--color-accent-muted)",
  },
  paused: {
    fg: "var(--color-ink-3)",
    border: "var(--color-border)",
    dot: "var(--color-ink-3)",
  },
  scheduled: {
    fg: "var(--color-ink-2)",
    border: "var(--color-border)",
    dot: "var(--color-ink-3)",
  },
};

export function AppPill({
  tone,
  label,
}: {
  tone: AppPillTone;
  label: string;
}) {
  const spec = PILL_SPECS[tone];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px] font-medium tracking-[0.02em]"
      style={{ color: spec.fg, border: `1px solid ${spec.border}` }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{
          background: spec.dot,
          animation: spec.pulsing
            ? "sirius-pulse 1.6s ease-in-out infinite"
            : undefined,
        }}
        aria-hidden
      />
      {label}
    </span>
  );
}
