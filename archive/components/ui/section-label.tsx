import type { CSSProperties, ReactNode } from "react";

type Tone = "info" | "op" | "neutral";

type SectionLabelProps = {
  children: ReactNode;
  /**
   * "layer" — the system spine. Only the two layers (information / operation)
   * use it: a mono ordinal readout, colored by which layer it names. Numbers
   * are meaningful here (a real two-step system), not section scaffolding.
   * "plain" — every other section: an editorial worded label, sentence-case,
   * untracked, no number. A chapter in an argument, not a tracked SaaS kicker.
   */
  variant?: "layer" | "plain";
  tone?: Tone;
  /** Layer ordinal ("01" / "02"). Only meaningful with variant="layer". */
  ordinal?: string;
  className?: string;
  style?: CSSProperties;
};

const ruleColor: Record<Tone, string> = {
  info: "var(--layer-info)",
  op: "var(--layer-op)",
  neutral: "var(--ink-3)",
};

export function SectionLabel({
  children,
  variant = "plain",
  tone = "neutral",
  ordinal,
  className,
  style,
}: SectionLabelProps) {
  if (variant === "layer") {
    const toneClass = tone === "op" ? " is-op" : tone === "neutral" ? " is-neutral" : " is-info";
    return (
      <p className={"sys-label" + toneClass + (className ? " " + className : "")} style={style}>
        {ordinal && <span className="sys-ord">{ordinal}</span>}
        <span aria-hidden="true" className="sys-rule" />
        <span>{children}</span>
      </p>
    );
  }

  return (
    <p
      className={
        "inline-flex items-center gap-3 leading-none text-[var(--ink-2)]" +
        (className ? " " + className : "")
      }
      style={style}
    >
      <span
        aria-hidden="true"
        className="h-px w-7 shrink-0"
        style={{ background: `linear-gradient(90deg, ${ruleColor[tone]}, transparent)` }}
      />
      <span className="text-[13px] font-medium tracking-[0.005em]">{children}</span>
    </p>
  );
}
