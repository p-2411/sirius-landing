import { AppEyebrow } from "./app-eyebrow";
import { AppPill } from "./app-pill";
import type { AppPillTone } from "./app-pill";

/**
 * RecentRuns — faithful static port of app's recent-runs footer strip.
 *
 * Matches workflows/[name]/page.tsx footer exactly:
 * - padding: "14px 48px 20px", borderTop
 * - header row: AppEyebrow "Recent runs" + "See all →" link text
 * - chips: flex gap-2 flex-wrap mt-2, each p-[8px_12px] rounded-[8px]
 *   surface-1 border, Pill + when (12.5px ink-2 tabular) + dur (11.5px ink-4 tabular ml-auto)
 */
export function RecentRuns({
  runs,
}: {
  runs: { tone: AppPillTone; label: string; when: string; dur: string }[];
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: "14px 48px 20px",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <AppEyebrow accent="dim">Recent runs</AppEyebrow>
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink-3)",
            fontWeight: 500,
          }}
        >
          See all →
        </span>
      </div>

      {/* Run chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {runs.map((run, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-sans)",
              minWidth: 200,
            }}
          >
            <AppPill tone={run.tone} label={run.label} />
            <span
              style={{
                fontSize: 12.5,
                color: "var(--color-ink-2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {run.when}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11.5,
                color: "var(--color-ink-4)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {run.dur}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
