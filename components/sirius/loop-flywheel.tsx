// §4 visual — the information↔operation loop. Four labelled nodes on a ring with
// a calm clockwise-travelling arc showing flow. The point isn't the diagram, it's
// the idea that every action feeds back. Honors DESIGN.md (gold + cyan, near-black)
// and prefers-reduced-motion (arc holds still).
const C = 200;
const R = 120;

type Tone = "cyan" | "gold";
const NODES: { key: string; label: string; sub: string; x: number; y: number; tone: Tone; lx: number; ly: number; anchor: "start" | "middle" | "end" }[] = [
  { key: "information", label: "Information", sub: "it learns everything", x: C, y: C - R, tone: "cyan", lx: C, ly: C - R - 30, anchor: "middle" },
  { key: "insight", label: "Insight", sub: "it spots the gaps", x: C + R, y: C, tone: "gold", lx: C + R + 16, ly: C - 4, anchor: "start" },
  { key: "operation", label: "Operation", sub: "it does the work", x: C, y: C + R, tone: "gold", lx: C, ly: C + R + 26, anchor: "middle" },
  { key: "outcome", label: "Outcome", sub: "it feeds back", x: C - R, y: C, tone: "cyan", lx: C - R - 16, ly: C - 4, anchor: "end" },
];

const hex = (t: Tone) => (t === "cyan" ? "#6cd8ff" : "#d9b978");
const halo = (t: Tone) => (t === "cyan" ? "rgba(108,216,255,.30)" : "rgba(217,185,120,.30)");

export function LoopFlywheel({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="A loop: the information layer learns everything, spots the gaps as insight, the operation layer does the work, and every outcome feeds back into what it knows — so it compounds."
    >
      <svg viewBox="0 0 400 400" className="loop-svg" aria-hidden="true">
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(232,224,200,.14)" strokeWidth="1.5" />
        <circle
          className="loop-flow"
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="rgba(108,216,255,.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={100}
        />
        {NODES.map((n) => (
          <g key={n.key}>
            <circle cx={n.x} cy={n.y} r={13} fill="none" stroke={halo(n.tone)} strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r={7} fill={hex(n.tone)} />
            <text x={n.lx} y={n.ly} textAnchor={n.anchor} className="loop-label-k">{n.label}</text>
            <text x={n.lx} y={n.ly + 15} textAnchor={n.anchor} className="loop-label-sub">{n.sub}</text>
          </g>
        ))}
        <text x={C} y={C - 4} textAnchor="middle" className="loop-center-k">the loop</text>
        <text x={C} y={C + 15} textAnchor="middle" className="loop-center-sub">it compounds</text>
      </svg>
    </div>
  );
}
