import type { CSSProperties, ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "cyan" | "warm";
  /** Gold ordinal for the capability arc (01–05). Omit for trust/conversion sections. */
  index?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * SectionLabel — the page's section-label cadence. The capability sections form
 * a numbered narrative arc (01–05) carried by a gold display ordinal; trust and
 * conversion sections pass no index. Worded, sentence-case, untracked — a
 * chapter in an argument, not a tracked-uppercase SaaS kicker.
 */
export function SectionLabel({
  children,
  tone = "warm",
  index,
  className,
  style,
}: SectionLabelProps) {
  const accent =
    tone === "cyan" ? "var(--color-state-listening)" : "var(--color-accent)";

  return (
    <p
      className={
        "inline-flex items-center gap-3 leading-none text-[var(--color-ink-2)]" +
        (className ? " " + className : "")
      }
      style={style}
    >
      {index && (
        <span
          className="font-display text-[1.1rem] font-normal leading-none tabular-nums"
          style={{ color: accent, fontVariationSettings: '"opsz" 36' }}
        >
          {index}
        </span>
      )}
      <span
        aria-hidden="true"
        className="h-px w-7 shrink-0"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <span className="text-[13px] font-medium tracking-[0.005em]">{children}</span>
    </p>
  );
}
