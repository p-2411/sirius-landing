import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "inbox" | "finder" | "briefing";
type Accent = "warm" | "cyan";

type ProductMockProps = {
  children: ReactNode;
  /** Optional thin top rail caption — small mono uppercase text, e.g., "Workflow · cold outreach". */
  label?: string;
  /** Optional small status pill rendered to the right of the label, e.g., "Active", "06:42". */
  status?: string;
  /** Variant — "raised" gets a slightly more elevated panel; "flush" sits flatter. Default "raised". */
  tone?: "raised" | "flush";
  /** Frame metaphor for the header rail. */
  variant?: Variant;
  /** Domain accent. Renders a faint colored strip above the rail. */
  accent?: Accent;
  className?: string;
};

const ACCENT_GRADIENT: Record<Accent, string> = {
  warm: "rgba(var(--color-accent-rgb), 0.55)",
  cyan: "rgba(var(--color-accent-rgb), 0.6)",
};

function WindowDots() {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5"
      aria-hidden="true"
    >
      <span className="h-[9px] w-[9px] rounded-full" style={{ background: "#ff5f57" }} />
      <span className="h-[9px] w-[9px] rounded-full" style={{ background: "#febc2e" }} />
      <span className="h-[9px] w-[9px] rounded-full" style={{ background: "#28c840" }} />
    </div>
  );
}

export function ProductMock({
  children,
  label,
  status,
  tone = "raised",
  variant = "default",
  accent,
  className,
}: ProductMockProps) {
  const isInbox = variant === "inbox";
  const isFinder = variant === "finder";
  const isBriefing = variant === "briefing";
  const hasRail = !!(label || status);

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]",
        tone === "raised"
          ? "bg-[var(--color-surface-deep)] shadow-[0 24px 64px rgba(0,0,0,0.45)]"
          : "bg-[rgba(0,0,0,0.2)]",
        isBriefing && "bg-[var(--color-surface-deep)]",
        className,
      )}
    >
      {accent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${ACCENT_GRADIENT[accent]} 35%, ${ACCENT_GRADIENT[accent]} 65%, transparent 100%)`,
          }}
        />
      )}

      {hasRail && (
        <div
          className={cn(
            "flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5",
            isFinder && "bg-[rgba(var(--color-accent-rgb),0.025)]",
            isInbox && "bg-[rgba(var(--color-accent-rgb),0.03)]",
            isBriefing && "bg-[rgba(var(--color-accent-rgb),0.02)]",
          )}
        >
          <WindowDots />

          {isFinder && (
            <span
              className="shrink-0 font-mono text-[12px] leading-none text-[var(--color-accent)] opacity-70"
              aria-hidden="true"
            >
              ▸
            </span>
          )}

          {label && (
            <span
              className={cn(
                "flex-1 truncate",
                isBriefing
                  ? "text-center font-display-italic text-[12.5px] tracking-[0.01em] text-[var(--color-ink-1)]"
                  : "font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]",
              )}
            >
              {label}
            </span>
          )}

          {status && (
            <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-2)]">
              {status}
            </span>
          )}
        </div>
      )}

      <div className="p-5 md:p-6">{children}</div>
    </figure>
  );
}
