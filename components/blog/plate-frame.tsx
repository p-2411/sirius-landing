import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Astronomical-chart frame: gold hairline, engraved corner ticks. */
export function PlateFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("plate-frame", className)}>
      <span className="plate-corner plate-corner-tl" aria-hidden="true" />
      <span className="plate-corner plate-corner-tr" aria-hidden="true" />
      <span className="plate-corner plate-corner-bl" aria-hidden="true" />
      <span className="plate-corner plate-corner-br" aria-hidden="true" />
      {children}
    </div>
  );
}
