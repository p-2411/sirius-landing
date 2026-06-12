"use client";

import { useEffect, useRef, useState } from "react";

interface SkyStar {
  /** Normalized x from the PlateModel — used to seed a margin-band position. */
  x: number;
  /** Vertical fraction of the article where this section starts. */
  start: number;
}

/**
 * The post's constellation laid into the page background across the full
 * article height. Stars ignite and the line extends as the reader passes
 * each H2 (observed by heading id). Decorative only: aria-hidden, no pointer.
 */
export function ChartedSky({
  stars,
  headingIds,
}: {
  stars: SkyStar[];
  headingIds: string[];
}) {
  const [lit, setLit] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduced.current = true;
      queueMicrotask(() => setLit(stars.length));
      return;
    }
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = headings.indexOf(entry.target as HTMLElement);
          if (idx >= 0) setLit((prev) => Math.max(prev, idx + 1));
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [headingIds, stars.length]);

  if (stars.length === 0) return null;

  // Alternate stars between left/right margin bands so they sit beside the
  // prose column, not under it; the model's x seeds position within the band.
  const placed = stars.map((s, i) => {
    const band = i % 2 === 0 ? { lo: 4, w: 18 } : { lo: 78, w: 18 };
    return {
      x: band.lo + s.x * band.w,
      y: 6 + s.start * 86,
    };
  });
  const points = placed.map((p) => `${p.x},${p.y}`).join(" ");
  const progress = lit <= 1 || placed.length < 2 ? 0 : (lit - 1) / (placed.length - 1);

  return (
    <svg
      className="charted-sky"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {placed.length > 1 && (
        <polyline
          className="charted-sky-path"
          points={points}
          pathLength={1}
          fill="none"
          style={{ strokeDashoffset: 1 - progress }}
        />
      )}
      {placed.map((p, i) => (
        <circle
          key={i}
          className={i < lit ? "charted-sky-star is-lit" : "charted-sky-star"}
          cx={p.x}
          cy={p.y}
          r={0.45}
        />
      ))}
    </svg>
  );
}
