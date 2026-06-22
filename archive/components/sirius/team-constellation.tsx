// components/sirius/team-constellation.tsx
// §5 visual — each person's Sirius (outer cyan nodes) feeds the shared org brain
// (center gold). Lines carry the work inward. Calm and glanceable, secondary to copy.
const C = 200;
const R = 132;
const PEOPLE = [
  { initials: "AR", angle: -90 },
  { initials: "JL", angle: -18 },
  { initials: "MK", angle: 54 },
  { initials: "TC", angle: 126 },
  { initials: "PS", angle: 198 },
];
const rad = (deg: number) => (deg * Math.PI) / 180;

export function TeamConstellation({ className }: { className?: string }) {
  const pts = PEOPLE.map((p) => ({ ...p, x: C + R * Math.cos(rad(p.angle)), y: C + R * Math.sin(rad(p.angle)) }));
  return (
    <div
      className={className}
      role="img"
      aria-label="Five people, each with their own Sirius, all connected to one shared brain at the centre — every person's work feeds the whole company's picture."
    >
      <svg viewBox="0 0 400 400" className="team-svg" aria-hidden="true">
        {pts.map((p) => (
          <line key={`l-${p.initials}`} x1={p.x} y1={p.y} x2={C} y2={C} stroke="rgba(108,216,255,.22)" strokeWidth="1.25" />
        ))}
        {pts.map((p) => (
          <g key={p.initials}>
            <circle cx={p.x} cy={p.y} r={22} fill="rgba(108,216,255,.08)" stroke="rgba(108,216,255,.45)" strokeWidth="1.25" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" className="team-initials">{p.initials}</text>
          </g>
        ))}
        <circle cx={C} cy={C} r={40} fill="rgba(240,179,90,.10)" stroke="rgba(240,179,90,.55)" strokeWidth="1.5" />
        <circle cx={C} cy={C} r={9} fill="#f0b35a" />
        <text x={C} y={C + 60} textAnchor="middle" className="team-center-sub">the shared brain</text>
      </svg>
    </div>
  );
}
