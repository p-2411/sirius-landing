"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ScaledShot — renders children at a fixed design size and uniformly scales
 * the whole thing to "contain"-fit its parent box (like object-fit: contain).
 *
 * The parent (ScreenshotFrame) reserves a stable aspect-ratio box, so there
 * is no layout shift. A ResizeObserver measures the box and sets the scale to
 * min(boxW/designW, boxH/designH) so the UI can never overflow or get cut off,
 * regardless of the box's real rendered aspect ratio.
 */
export function ScaledShot({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setScale(Math.min(r.width / width, r.height / height));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div
      ref={boxRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div
        className="shrink-0"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
