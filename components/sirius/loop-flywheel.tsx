// §4 visual — the information↔operation loop. Four labelled nodes on a ring with
// a calm clockwise-travelling arc showing flow. The point isn't the diagram, it's
// the idea that every action feeds back. Honors DESIGN.md (gold + cyan, near-black)
// and prefers-reduced-motion (arc holds still).
const C = 200;
const R = 120;

// Top + right belong to the information layer (gold — what it knows); bottom +
// left belong to the operation layer (cyan — what it does). The two halves meet
// to close the loop, so the colour split IS the two-layer model.
type Tone = "cyan" | "gold";
const NODES: { key: string; label: string; sub: string; x: number; y: number; tone: Tone; lx: number; ly: number; anchor: "start" | "middle" | "end" }[] = [
  { key: "information", label: "Information", sub: "it learns everything", x: C, y: C - R, tone: "gold", lx: C, ly: C - R - 30, anchor: "middle" },
  { key: "insight", label: "Insight", sub: "it spots the gaps", x: C + R, y: C, tone: "gold", lx: C + R + 16, ly: C - 4, anchor: "start" },
  { key: "operation", label: "Operation", sub: "it does the work", x: C, y: C + R, tone: "cyan", lx: C, ly: C + R + 26, anchor: "middle" },
  { key: "outcome", label: "Outcome", sub: "it feeds back", x: C - R, y: C, tone: "cyan", lx: C - R - 16, ly: C - 4, anchor: "end" },
];

const hex = (t: Tone) => (t === "cyan" ? "#6cd8ff" : "#f0b35a");
const halo = (t: Tone) => (t === "cyan" ? "rgba(108,216,255,.30)" : "rgba(240,179,90,.30)");

export function LoopFlywheel({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="A loop: the information layer learns everything, spots the gaps as insight, the operation layer does the work, and every outcome feeds back into what it knows — so it compounds."
    >
      <svg viewBox="0 0 400 400" className="loop-svg" aria-hidden="true">
        <defs>
          <linearGradient id="loop-flow-grad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#f0b35a" />
            <stop offset="100%" stopColor="#6cd8ff" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(232,224,200,.14)" strokeWidth="1.5" />
        <circle
          className="loop-flow"
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="url(#loop-flow-grad)"
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
