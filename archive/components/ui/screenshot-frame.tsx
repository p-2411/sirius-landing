import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScreenshotFrameProps = {
  /** path under /public, e.g. "/screenshots/workflow-detail.png" — omit for placeholder/children */
  src?: string;
  /** accessible description of the app screen */
  alt: string;
  /** muted caption shown in the placeholder state */
  caption: string;
  /** intrinsic size of the real asset; also drives the reserved aspect ratio */
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  /** recreated app UI rendered inside the bezel; takes precedence over src/placeholder */
  children?: ReactNode;
};

export function ScreenshotFrame({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
  priority = false,
  className,
  children,
}: ScreenshotFrameProps) {
  return (
    <figure
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] shadow-[0_14px_40px_rgba(0,0,0,0.28)]",
        className,
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {children ? (
        <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg)]">
          {children}
        </div>
      ) : src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-surface-2)]"
        >
          <span
            className="h-10 w-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(240,200,121,0.55), rgba(217,185,120,0.18) 60%, transparent 75%)",
            }}
          />
          <span className="px-6 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
            {caption}
          </span>
        </div>
      )}
    </figure>
  );
}
