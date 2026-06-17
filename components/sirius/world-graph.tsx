// §1 visual — the "your world" connected web. Nodes are real-world things
// (people, companies, deals, promises) linked to each other and to YOU. This
// is the one intentional concept visual; labels are never tech terms.
const NODES: Array<{ x: number; y: number; label: string; anchor?: "start" | "middle" | "end" }> = [
  { x: 100, y: 80, label: "Dana", anchor: "middle" },
  { x: 80, y: 160, label: "Acme Co", anchor: "middle" },
  { x: 150, y: 215, label: "Q3 numbers", anchor: "middle" },
  { x: 285, y: 90, label: "Foundry", anchor: "middle" },
  { x: 320, y: 175, label: "Series A", anchor: "middle" },
  { x: 250, y: 40, label: "Intro · Tue", anchor: "middle" },
];

const EDGES: Array<[number, number, number, number]> = [
  [100, 80, 80, 160],
  [80, 160, 150, 210],
  [100, 80, 190, 120],
  [190, 120, 285, 90],
  [285, 90, 320, 175],
  [285, 90, 250, 40],
  [190, 120, 320, 175],
];

export function WorldGraph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 250" className={className} role="img" aria-label="A map of your world that Sirus builds itself">
      {EDGES.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(217,185,120,0.30)" strokeWidth={1} />
      ))}
      <circle cx={190} cy={120} r={18} fill="rgba(108,216,255,0.18)" />
      <circle cx={190} cy={120} r={7} fill="#6cd8ff" />
      <text x={190} y={148} textAnchor="middle" fontFamily="var(--font-mono, ui-monospace), monospace" fontSize={10} fill="#6cd8ff">YOU</text>
      {NODES.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={4} fill="#d9b978" />
          <text x={n.x} y={n.y - 10} textAnchor={n.anchor ?? "middle"} fontFamily="var(--font-mono, ui-monospace), monospace" fontSize={10} fill="rgba(199,203,212,0.9)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
