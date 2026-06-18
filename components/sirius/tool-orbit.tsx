"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { Orb } from "@/components/sirius/orb";
import { BrandLogo, BRAND_COLORS } from "@/components/sirius/brand-logos";

// The founder stack Sirus operates inside. Names must match keys in
// brand-logos.tsx. Mixed native/aspirational — the "+ anything with an API"
// hedge in the hero/footer covers it.
const APPS = ["Gmail", "Notion", "Slack", "Superhuman", "Granola", "HubSpot", "Stripe", "Zapier"];

// Tilted ring viewed slightly from above. Near logos (front) sit lower, larger,
// brighter and in front of the orb; far logos sit higher, smaller, dimmer and
// pass behind it. Pure transform/opacity, so it stays smooth.
const R = 180; // horizontal radius (px)
const Y = 0.34; // vertical squash → the tilt of the ring
const PERIOD = 40; // seconds per revolution

export function ToolOrbit() {
  const reduce = useReducedMotion();
  const els = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const place = (seconds: number) => {
      const n = APPS.length;
      for (let i = 0; i < n; i++) {
        const el = els.current[i];
        if (!el) continue;
        const a = (i / n) * Math.PI * 2 + (seconds / PERIOD) * Math.PI * 2;
        const x = Math.cos(a) * R;
        const y = Math.sin(a) * R * Y;
        const near = (Math.sin(a) + 1) / 2; // 0 (back) → 1 (front)
        const scale = 0.64 + near * 0.54;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(0.42 + near * 0.58);
        el.style.zIndex = String(Math.sin(a) > 0 ? 20 : 5);
      }
    };

    if (reduce) {
      place(0);
      return;
    }

    let raf = 0;
    let start = 0;
    const loop = (t: number) => {
      if (!start) start = t;
      place((t - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div className="relative mx-auto h-[404px] w-[480px] max-w-full">
      {/* orbiting tools */}
      {APPS.map((app, i) => (
        <span
          key={app}
          ref={(node) => {
            els.current[i] = node;
          }}
          title={app}
          className="absolute left-1/2 top-1/2 will-change-transform"
        >
          <BrandLogo name={app} color={BRAND_COLORS[app]} className="h-[46px] w-auto" />
        </span>
      ))}

      {/* black backdrop behind the orb — also hides logos passing behind it */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[8] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.22) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Sirius at the center */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <Orb className="!h-[182px] !w-[182px]" />
      </div>
    </div>
  );
}
