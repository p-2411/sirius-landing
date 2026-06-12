"use client";

import { useEffect, useState } from "react";

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
 *
 * The polyline lives in a preserveAspectRatio="none" SVG (non-scaling-stroke
 * keeps its width sane); the star dots are spans so they stay perfectly round
 * regardless of how tall the article stretches the sky.
 */
export function ChartedSky({
  stars,
  headingIds,
}: {
  stars: SkyStar[];
  headingIds: string[];
}) {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred to satisfy react-hooks/set-state-in-effect; also keeps the
      // server and first client render identical (no hydration mismatch).
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
    <div className="charted-sky" aria-hidden="true">
      {placed.length > 1 && (
        <svg className="charted-sky-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            className="charted-sky-path"
            points={points}
            pathLength={1}
            fill="none"
            style={{ strokeDashoffset: 1 - progress }}
          />
        </svg>
      )}
      {placed.map((p, i) => (
        <span
          key={i}
          className={i < lit ? "charted-sky-star is-lit" : "charted-sky-star"}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}
    </div>
  );
}
