import type { PlateModel } from "@/lib/constellation";
import { cn } from "@/lib/utils";

const VIEW_W = 600;
const VIEW_H = 220;
// Normalized [0,1] radii/orbits are expressed in viewBox units via this scale.
const UNIT = 3;

/**
 * Renders a PlateModel as SVG.
 * - "card": index plates — constellation line draws on hover (CSS).
 * - "hero": essay header — unlit grey state, no line.
 */
export function Plate({
  model,
  variant,
  className,
}: {
  model: PlateModel;
  variant: "card" | "hero";
  className?: string;
}) {
  const px = (x: number) => x * VIEW_W;
  const py = (y: number) => y * VIEW_H;
  const points = model.stars.map((s) => `${px(s.x)},${py(s.y)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
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
            x={px(s.x) - 8}
            y={py(s.y) + (s.y > 0.5 ? -14 : 22)}
          >
            {s.greek} {s.label}
          </text>
        </g>
      ))}

      {model.satellites.map((s, i) => (
        <circle
          key={i}
          className="plate-satellite"
          cx={px(s.x) + s.orbitR * VIEW_W}
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
