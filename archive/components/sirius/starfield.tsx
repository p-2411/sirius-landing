"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Ported from the design's starfield.js: a sparse, twinkling field of mostly
// cool-white stars (occasional warm gold), drawn on a fixed full-viewport
// canvas behind all page content — quiet celestial depth, never noise.
type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  amp: number;
  sp: number;
  ph: number;
  warm: boolean;
};

export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.1 + 0.25,
          base: Math.random() * 0.4 + 0.12,
          amp: Math.random() * 0.35 + 0.1,
          sp: Math.random() * 1.6 + 0.4,
          ph: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.16,
        });
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      const time = t * 0.001;
      for (const s of stars) {
        const tw = reduce ? s.base : s.base + s.amp * (0.5 + 0.5 * Math.sin(time * s.sp + s.ph));
        const a = Math.max(0, Math.min(1, tw));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.warm ? `rgba(240, 200, 140, ${a})` : `rgba(214, 228, 240, ${a})`;
        ctx!.fill();
        if (s.r > 0.95 && a > 0.4) {
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
          ctx!.fillStyle = s.warm ? `rgba(240, 200, 140, ${a * 0.07})` : `rgba(180, 214, 240, ${a * 0.07})`;
          ctx!.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      if (reduce) draw(0);
    };

    resize();
    window.addEventListener("resize", onResize);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
    />
  );
}
