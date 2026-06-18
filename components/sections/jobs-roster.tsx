import { landingContent } from "@/content/landing";

const T = {
  accent: "#d9b978", cyan: "#6cd8ff", success: "#a7dbb2", ink3: "rgba(206,208,197,.62)", ink4: "rgba(196,199,189,.40)",
};

const GROUP_ORDER = ["Needs you", "Active now", "Standing by"] as const;
const GROUP_COLOR: Record<(typeof GROUP_ORDER)[number], string> = { "Needs you": T.accent, "Active now": T.cyan, "Standing by": T.ink3 };

function StatusDot({ status }: { status: string }) {
  if (status === "running") {
    return <span style={{ width: 12, height: 12, borderRadius: 999, border: `1.5px solid rgba(108,216,255,.25)`, borderTopColor: T.cyan, boxSizing: "border-box", display: "inline-block", animation: "sd-wys-spin 0.8s linear infinite" }} />;
  }
  const color = status === "awaiting" ? T.accent : T.success;
  const halo = status === "awaiting" ? "rgba(217,185,120,.20)" : "rgba(167,219,178,.18)";
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: color, boxShadow: `0 0 0 3px ${halo}`, display: "inline-block" }} />;
}

export function JobsRoster() {
  const { jobs } = landingContent.whileYouSleep;
  return (
    <div className="wys-roster">
      <div className="wys-card">
        {GROUP_ORDER.map((group) => {
          const rows = jobs.filter((j) => j.group === group);
          if (rows.length === 0) return null;
          return (
            <div key={group}>
              <div className="wys-group" style={{ color: GROUP_COLOR[group] }}>{group}</div>
              {rows.map((j, i) => {
                const last = group === "Standing by" && i === rows.length - 1;
                const activityColor = j.status === "awaiting" ? T.accent : j.status === "running" ? T.cyan : T.ink4;
                return (
                  <div key={j.name} className={"wys-row" + (last ? " is-last" : "")}>
                    <span className="wys-dot"><StatusDot status={j.status} /></span>
                    <div className="wys-main">
                      <span className="wys-name">{j.name}</span>
                      <span className="wys-desc">{j.desc}</span>
                    </div>
                    <span className="wys-trigger">{j.trigger}</span>
                    <span className="wys-activity" style={{ color: activityColor }}>{j.activity}</span>
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
