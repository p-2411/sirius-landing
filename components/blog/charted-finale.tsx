"use client";

import { useEffect, useRef, useState } from "react";

/** The whispered end-of-essay line — fades in when scrolled into view. */
export function ChartedFinale({ plateNumber, minutes }: { plateNumber: number; minutes: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setShown(true));
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.9 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className={shown ? "charted-finale is-shown" : "charted-finale"}>
      PLATE {String(plateNumber).padStart(2, "0")} CHARTED · {minutes} MIN
    </p>
  );
}
