// §1 visual — "your world," the relationship map Sirus builds on its own.
// YOU sit at a glowing core; around you are the real people, companies, deals
// and commitments it has connected. Shown as an outcome, never as machinery —
// labels are always real-world things, never tech terms. Deterministic layout
// (no random/time at module scope) so it prerenders statically; the assembling
// pulse is CSS-only and disabled under prefers-reduced-motion.

const CX = 190;
const CY = 124;

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  meta: string;
  // relationship strength → node size, label weight, edge weight.
  strength: 1 | 2 | 3;
  // where the label sits relative to the dot.
  side: "left" | "right";
  anchor: "start" | "end";
  // staggered reveal order
  order: number;
};

// Organic, slightly off-grid placement around the core, loosely clustered:
// Acme sits with its champion (Dana) and the deal (Series A); Globex sits with
// its renewal and the warm intro. Positions are hand-tuned, not on a circle.
const NODES: Node[] = [
  { id: "dana", x: 104, y: 56, label: "Dana", meta: "Acme · champion", strength: 3, side: "left", anchor: "end", order: 1 },
  { id: "acme", x: 80, y: 130, label: "Acme Corp", meta: "active deal", strength: 2, side: "left", anchor: "end", order: 2 },
  { id: "seriesa", x: 118, y: 204, label: "Series A", meta: "term sheet · Fri", strength: 1, side: "left", anchor: "end", order: 4 },
  { id: "q3", x: 198, y: 226, label: "Q3 numbers", meta: "you promised · Tue", strength: 1, side: "right", anchor: "start", order: 6 },
  { id: "priya", x: 292, y: 200, label: "Intro from Priya", meta: "warm · 2d ago", strength: 2, side: "right", anchor: "start", order: 5 },
  { id: "globex", x: 314, y: 122, label: "Globex", meta: "renewal · 30d", strength: 2, side: "right", anchor: "start", order: 3 },
  { id: "standup", x: 280, y: 46, label: "Mon standup", meta: "recurring", strength: 1, side: "right", anchor: "start", order: 7 },
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Edges: most fan out from YOU; a couple connect siblings to show real
// relationships (Dana↔Acme, Acme↔Series A, Globex↔Priya). Hubness varies.
type Edge = { from: string | "you"; to: string; order: number };
const EDGES: Edge[] = [
  { from: "you", to: "dana", order: 1 },
  { from: "you", to: "acme", order: 2 },
  { from: "you", to: "globex", order: 3 },
  { from: "you", to: "q3", order: 6 },
  { from: "you", to: "standup", order: 7 },
  { from: "dana", to: "acme", order: 2 },
  { from: "acme", to: "seriesa", order: 4 },
  { from: "globex", to: "priya", order: 5 },
];

const STRENGTH = {
  1: { r: 2.6, dotOpacity: 0.55, edge: 0.16, edgeW: 0.8, label: 0.6, dot: "#d9b978" },
  2: { r: 3.4, dotOpacity: 0.85, edge: 0.26, edgeW: 1.05, label: 0.82, dot: "#e6c98c" },
  3: { r: 4.4, dotOpacity: 1, edge: 0.4, edgeW: 1.35, label: 1, dot: "#f0d59b" },
} as const;

function point(id: string | "you") {
  if (id === "you") return { x: CX, y: CY };
  const n = NODE_BY_ID[id];
  return { x: n.x, y: n.y };
}

// A gentle quadratic curve between two points: control point pushed
// perpendicular to the chord so lines bow softly outward instead of running
// dead straight. Deterministic — based purely on geometry.
function curve(ax: number, ay: number, bx: number, by: number, bow: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular unit vector; sign of bow chooses which way it bows.
  const px = -dy / len;
  const py = dx / len;
  const cxp = mx + px * bow;
  const cyp = my + py * bow;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cxp.toFixed(1)} ${cyp.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

export function WorldGraph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 380 250"
      className={`wg ${className}`.trim()}
      role="img"
      aria-label="A map of your world that Sirus builds itself — Dana at Acme, the Acme Series A, your Q3 numbers due Tuesday, the Globex renewal, a warm intro from Priya, and your Monday standup, all connected to you at the centre."
    >
      <defs>
        {/* Soft cyan glow for the YOU core — echoes the hero orb. */}
        <radialGradient id="wg-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bdeeff" />
          <stop offset="42%" stopColor="#6cd8ff" />
          <stop offset="100%" stopColor="#2a87c0" />
        </radialGradient>
        <radialGradient id="wg-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(108,216,255,0.34)" />
          <stop offset="55%" stopColor="rgba(108,216,255,0.10)" />
          <stop offset="100%" stopColor="rgba(108,216,255,0)" />
        </radialGradient>
        {/* Edge gradient: radial from the YOU core so cyan always sits at the
            centre and gold always sits at the periphery, regardless of the
            edge's direction (left-side edges were inverted with a linear
            gradient because objectBoundingBox runs per-edge). */}
        <radialGradient id="wg-edge" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={175}>
          <stop offset="0%" stopColor="rgba(108,216,255,0.55)" />
          <stop offset="100%" stopColor="rgba(217,185,120,0.55)" />
        </radialGradient>
        <filter id="wg-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Faint concentric guide rings — sense of orbit / closeness to you. */}
      <g className="wg-rings" stroke="rgba(217,185,120,0.12)" fill="none">
        <circle cx={CX} cy={CY} r={56} />
        <circle cx={CX} cy={CY} r={98} strokeDasharray="2 6" />
      </g>

      {/* Connecting relationships. Hub edges (from YOU) carry the cyan→gold
          gradient; sibling edges are quieter gold. */}
      <g fill="none" strokeLinecap="round">
        {EDGES.map((e) => {
          const a = point(e.from);
          const b = point(e.to);
          const tgt = STRENGTH[NODE_BY_ID[e.to].strength];
          const isHub = e.from === "you";
          // bow alternates a touch with order so the web doesn't look rigid.
          const bow = (e.order % 2 === 0 ? 1 : -1) * (isHub ? 10 : 6);
          return (
            <path
              key={`${e.from}-${e.to}`}
              className="wg-edge"
              style={{ ["--o" as string]: e.order }}
              d={curve(a.x, a.y, b.x, b.y, bow)}
              stroke={isHub ? "url(#wg-edge)" : "rgba(217,185,120,0.30)"}
              strokeWidth={isHub ? tgt.edgeW + 0.2 : tgt.edgeW}
              strokeOpacity={isHub ? 0.85 : 0.7}
            />
          );
        })}
      </g>

      {/* The YOU core. */}
      <g className="wg-core">
        <circle cx={CX} cy={CY} r={34} fill="url(#wg-halo)" />
        <circle cx={CX} cy={CY} r={11} fill="url(#wg-core)" />
        <circle cx={CX} cy={CY} r={11} fill="none" stroke="rgba(189,238,255,0.55)" strokeWidth={0.75} />
        <circle className="wg-pulse" cx={CX} cy={CY} r={11} fill="none" stroke="rgba(108,216,255,0.5)" strokeWidth={1} />
        <text
          x={CX}
          y={CY + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono, ui-monospace), monospace"
          fontSize={7.5}
          letterSpacing="0.14em"
          fontWeight={600}
          fill="#06222e"
        >
          YOU
        </text>
      </g>

      {/* Nodes — refined dots with two-line labels (name + quiet mono meta). */}
      {NODES.map((n) => {
        const s = STRENGTH[n.strength];
        const lx = n.side === "left" ? n.x - 9 : n.x + 9;
        return (
          <g key={n.id} className="wg-node" style={{ ["--o" as string]: n.order }}>
            <circle cx={n.x} cy={n.y} r={s.r + 2.6} fill={s.dot} opacity={0.12} filter="url(#wg-soft)" />
            <circle cx={n.x} cy={n.y} r={s.r} fill={s.dot} opacity={s.dotOpacity} />
            <text
              x={lx}
              y={n.y - 1.5}
              textAnchor={n.anchor}
              fontFamily="var(--font-body), system-ui, sans-serif"
              fontSize={9.5}
              fontWeight={500}
              fill="#f6efdf"
              opacity={0.55 + s.label * 0.45}
            >
              {n.label}
            </text>
            <text
              x={lx}
              y={n.y + 9}
              textAnchor={n.anchor}
              fontFamily="var(--font-mono, ui-monospace), monospace"
              fontSize={6.8}
              letterSpacing="0.02em"
              fill="rgba(206,208,197,0.62)"
            >
              {n.meta}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
