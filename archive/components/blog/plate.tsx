import type { PlateModel } from "@/lib/constellation";
import { cn } from "@/lib/utils";

// Fixed aspects keep circles round (uniform scaling): "chart" is the squarer
// card shape, "banner" the wide strip used by full-width plates.
const VIEW = {
  chart: { w: 600, h: 220 },
  banner: { w: 1200, h: 150 },
} as const;
// Normalized [0,1] radii/orbits are expressed in viewBox units via this scale.
const UNIT = 3;

/**
 * Renders a PlateModel as SVG.
 * - "card": index plates — constellation line draws on hover (CSS).
 * - "hero": essay header — unlit grey state, no line.
 * Aspect defaults to banner for heroes and chart for cards.
 */
export function Plate({
  model,
  variant,
  aspect,
  className,
}: {
  model: PlateModel;
  variant: "card" | "hero";
  aspect?: keyof typeof VIEW;
  className?: string;
}) {
  const { w, h } = VIEW[aspect ?? (variant === "hero" ? "banner" : "chart")];
  const px = (x: number) => x * w;
  const py = (y: number) => y * h;
  const points = model.stars.map((s) => `${px(s.x)},${py(s.y)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("plate-art", variant === "hero" && "plate-art--unlit", className)}
      aria-hidden="true"
    >
      <g className="plate-dust">
        {model.dust.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r={d.r * UNIT} />
        ))}
      </g>

      {model.stars.length > 1 && (
        <polyline className="plate-path" points={points} pathLength={1} fill="none" />
      )}

      {model.minors.map((m, i) => (
        <circle key={i} className="plate-minor" cx={px(m.x)} cy={py(m.y)} r={m.r * UNIT} />
      ))}

      {model.stars.map((s, i) => (
        <g key={i}>
          <circle
            className="plate-star"
            cx={px(s.x)}
            cy={py(s.y)}
            r={s.r * UNIT}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
          <text
            className="plate-label"
            x={px(s.x) + (s.x > 0.75 ? 8 : -8)}
            y={py(s.y) + (s.y > 0.5 ? -14 : 22)}
            textAnchor={s.x > 0.75 ? "end" : "start"}
          >
            {s.greek} {s.label}
          </text>
        </g>
      ))}

      {model.satellites.map((s, i) => (
        <circle
          key={i}
          className="plate-satellite"
          cx={px(s.x) + s.orbitR * w}
          cy={py(s.y)}
          r={1.4}
          style={{
            transformOrigin: `${px(s.x)}px ${py(s.y)}px`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </svg>
  );
}
