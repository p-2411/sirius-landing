import { AppPill } from "./app-pill";
import type { AppPillTone } from "./app-pill";
import { AppIcon } from "./app-icon";

/**
 * TopBar — faithful static port of the app's workflow-detail top bar.
 *
 * Matches app workflows/[name]/page.tsx header section exactly:
 * - padding: "24px 48px 20px", borderBottom
 * - breadcrumb: gap 8, fontSize 12.5, mb 12
 * - h1: font-title 38px letterSpacing -0.005em lineHeight 1.1
 * - meta row: mt 10, gap 14, Pill + trigger (clock icon + label) + runsMeta
 * - Run now button: primary md h-9 px-3 rounded-[8px] 13px
 */
export function TopBar({
  breadcrumb,
  title,
  tone,
  statusLabel,
  trigger,
  runsMeta,
}: {
  breadcrumb: string;
  title: string;
  tone: AppPillTone;
  statusLabel: string;
  trigger: string;
  runsMeta: string;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "24px 48px 20px",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Breadcrumb row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          fontSize: 12.5,
          fontFamily: "var(--font-sans)",
        }}
      >
        <span style={{ color: "var(--color-ink-3)", fontWeight: 500 }}>Workflows</span>
        <span style={{ color: "var(--color-ink-4)" }}>/</span>
        <span style={{ color: "var(--color-ink-2)", fontWeight: 500 }}>{breadcrumb}</span>
      </div>

      {/* Title + actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Title — Fraunces 38, matches app h1 exactly */}
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-title)",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: 38,
              color: "var(--color-ink-1)",
              letterSpacing: "-0.005em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <AppPill tone={tone} label={statusLabel} />
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                fontFamily: "var(--font-sans)",
                color: "var(--color-ink-3)",
                fontWeight: 500,
              }}
            >
              <AppIcon name="arrow" size={12} />
              {trigger}
            </span>
            <span
              style={{
                fontSize: 12.5,
                fontFamily: "var(--font-sans)",
                color: "var(--color-ink-3)",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {runsMeta}
            </span>
          </div>
        </div>

        {/* Run now button — app primary md: h-11 px-4 rounded-[8px] text-[13px] */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 44,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            flexShrink: 0,
          }}
        >
          <AppIcon name="play" size={12} stroke="currentColor" />
          Run now
        </div>
      </div>
    </div>
  );
}
