import type { CSSProperties, ReactNode } from "react";

/**
 * Reveal — slides its children up into place on load via the shared `.reveal`
 * CSS animation (app/sirius-design.css). The animation is TRANSFORM-ONLY:
 * opacity stays at 1, so content is always visible — with JS disabled, in
 * headless/prerender renderers, before hydration, and without scrolling. It
 * honors prefers-reduced-motion (the stylesheet disables the animation there).
 * `delay` staggers the entrance via the `--d` custom property.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={"reveal" + (className ? " " + className : "")}
      style={{ "--d": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
