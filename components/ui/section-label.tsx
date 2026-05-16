import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "cyan" | "warm";
  index?: string;
};

export function SectionLabel({ children, tone = "warm", index }: SectionLabelProps) {
  const accent =
    tone === "cyan" ? "var(--color-state-listening)" : "var(--color-accent)";

  return (
    <p className="inline-flex items-center gap-2.5 text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--color-ink-3)]">
      {index && <span style={{ color: accent }}>{index}</span>}
      <span
        aria-hidden="true"
        className="inline-block h-px w-6"
        style={{ background: "var(--color-border-strong)" }}
      />
      <span>{children}</span>
    </p>
  );
}
