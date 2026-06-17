import { landingContent } from "@/content/landing";

const T = {
  bg: "#1B1712", s1: "#2C261D", s2: "#342D23",
  ink1: "#F6EFDF", ink3: "rgba(206,208,197,.62)", ink4: "rgba(196,199,189,.40)",
  border: "rgba(232,224,200,.14)", accent: "#d9b978", cyan: "#6cd8ff", success: "#a7dbb2",
};

const GROUP_ORDER = ["Needs you", "Active now", "Standing by"] as const;
const GROUP_COLOR: Record<string, string> = { "Needs you": T.accent, "Active now": T.cyan, "Standing by": T.ink3 };

function StatusDot({ status }: { status: string }) {
  if (status === "running") {
    return <span style={{ width: 12, height: 12, borderRadius: 999, border: `1.5px solid rgba(108,216,255,.25)`, borderTopColor: T.cyan, boxSizing: "border-box", display: "inline-block" }} />;
  }
  const color = status === "awaiting" ? T.accent : T.success;
  const halo = status === "awaiting" ? "rgba(217,185,120,.20)" : "rgba(167,219,178,.18)";
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: `0 0 0 3px ${halo}`, display: "inline-block" }} />;
}

export function JobsRoster() {
  const { jobs } = landingContent.whileYouSleep;
  return (
    <div style={{ background: T.bg, borderRadius: 18, padding: "20px 18px", maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
      <div style={{ background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        {GROUP_ORDER.map((group) => {
          const rows = jobs.filter((j) => j.group === group);
          if (rows.length === 0) return null;
          return (
            <div key={group}>
              <div style={{ padding: "12px 16px 6px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: GROUP_COLOR[group] }}>{group}</div>
              {rows.map((j, i) => {
                const last = group === "Standing by" && i === rows.length - 1;
                const activityColor = j.activity === "awaiting you" ? T.accent : j.activity === "3 running" ? T.cyan : T.ink4;
                return (
                  <div key={j.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: last ? "none" : `1px solid ${T.border}`, minHeight: 46 }}>
                    <span style={{ flexShrink: 0, width: 16, display: "inline-flex", justifyContent: "center" }}><StatusDot status={j.status} /></span>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ flexShrink: 0, maxWidth: "48%", fontFamily: "var(--font-display), Georgia, serif", fontSize: 15, letterSpacing: "-.01em", color: T.ink1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.name}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: T.ink3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.desc}</span>
                    </div>
                    <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: T.s2, border: `1px solid ${T.border}`, fontSize: 11, color: T.ink3, whiteSpace: "nowrap" }}>{j.trigger}</span>
                    <span style={{ flexShrink: 0, width: 96, textAlign: "right", fontSize: 12, color: activityColor, whiteSpace: "nowrap" }}>{j.activity}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
