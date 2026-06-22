/**
 * DagMini — faithful static port of the app's Dag.tsx.
 *
 * Uses the EXACT same constants: COL_W=260, ROW_H=112, NODE_W=210, NODE_H=80,
 * PAD_X=48, PAD_Y=48. Nodes are absolutely positioned. Connectors are cubic
 * Béziers behind the nodes via an SVG overlay.
 *
 * DagStep mirrors the app's type (id, type, title, col, next, state).
 * State drives dot/border colors per the app's palette.
 */

export type DagStep = {
  id: string;
  type: string;
  title: string;
  col: number;
  next: string[];
  state: "done" | "running" | "idle" | "gated";
};

const COL_W = 260;
const ROW_H = 112;
const NODE_W = 210;
const NODE_H = 80;
const PAD_X = 48;
const PAD_Y = 48;

const ACCENT = "var(--color-accent)";

function dotColor(state: DagStep["state"]): string {
  if (state === "gated") return "var(--color-accent)";
  return "var(--color-success)";
}

function borderColor(state: DagStep["state"]): string {
  if (state === "gated") return "rgba(217,185,120,0.4)";
  return "var(--color-border)";
}

function boxShadow(state: DagStep["state"]): string | undefined {
  if (state === "gated") return "0 0 0 1px rgba(217,185,120,0.12)";
  return undefined;
}

function typeColor(state: DagStep["state"]): string {
  if (state === "gated") return "var(--color-accent)";
  return "var(--color-ink-3)";
}

export function DagMini({ steps }: { steps: DagStep[] }) {
  // Group nodes by column
  const colMap: Record<number, DagStep[]> = {};
  for (const s of steps) {
    if (!colMap[s.col]) colMap[s.col] = [];
    colMap[s.col].push(s);
  }
  const colKeys = Object.keys(colMap).map(Number).sort((a, b) => a - b);

  const maxRows = Math.max(1, ...colKeys.map((k) => colMap[k].length));
  const width = PAD_X * 2 + colKeys.length * COL_W;
  const height = PAD_Y * 2 + maxRows * ROW_H;

  // Compute positions
  const positions: Record<string, { x: number; y: number }> = {};
  colKeys.forEach((k, ci) => {
    const items = colMap[k];
    items.forEach((s, ri) => {
      const totalH = items.length * ROW_H;
      const startY = (height - totalH) / 2;
      positions[s.id] = {
        x: PAD_X + ci * COL_W,
        y: startY + ri * ROW_H,
      };
    });
  });

  return (
    <div style={{ position: "relative", width, height, margin: "0 auto" }}>
      {/* SVG connectors behind nodes */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <marker
            id="dag-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} opacity="0.6" />
          </marker>
        </defs>
        {steps.flatMap((s) =>
          (s.next || []).map((nextId) => {
            const from = positions[s.id];
            const to = positions[nextId];
            if (!from || !to) return null;
            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x;
            const y2 = to.y + NODE_H / 2;
            const midX = (x1 + x2) / 2;
            return (
              <path
                key={`${s.id}-${nextId}`}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={ACCENT}
                strokeOpacity="0.45"
                strokeWidth="1.2"
                markerEnd="url(#dag-arrowhead)"
              />
            );
          }),
        )}
      </svg>

      {/* Node cards */}
      {steps.map((s) => {
        const pos = positions[s.id];
        if (!pos) return null;
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: NODE_W,
              height: NODE_H,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--color-surface-1)",
              border: `1px solid ${borderColor(s.state)}`,
              boxShadow: boxShadow(s.state),
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top row: dot + type label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 50,
                  background: dotColor(s.state),
                  flexShrink: 0,
                }}
                aria-hidden
              />
              <span
                style={{
                  fontSize: 10.5,
                  color: typeColor(s.state),
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.type}
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 13,
                color: "var(--color-ink-1)",
                fontWeight: 500,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {s.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}
