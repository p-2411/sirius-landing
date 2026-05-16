import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = {
  children: ReactNode;
  level?: 1 | 2;
  interactive?: boolean;
  className?: string;
};

export function Surface({ children, level = 1, interactive = false, className }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-border)] transition-colors duration-150",
        level === 1 ? "bg-[var(--color-surface-1)]" : "bg-[var(--color-surface-2)]",
        interactive && "hover:bg-[var(--color-surface-2)] cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
