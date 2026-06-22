// Subtle twinkling starfield. Stars are sparse, small, and mostly cool-white
// with the occasional warm gold one — quiet depth behind the orb, never noise.
(function () {
  "use strict";
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stars = [];
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 9000);
    stars = [];
    for (let i = 0; i < count; i++) {
      const warm = Math.random() < 0.16;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        base: Math.random() * 0.4 + 0.12,
        amp: Math.random() * 0.35 + 0.1,
        sp: Math.random() * 1.6 + 0.4,
        ph: Math.random() * Math.PI * 2,
        warm,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const time = t * 0.001;
    for (const s of stars) {
      const tw = reduce ? s.base : s.base + s.amp * (0.5 + 0.5 * Math.sin(time * s.sp + s.ph));
      const a = Math.max(0, Math.min(1, tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm
        ? `rgba(240, 200, 140, ${a})`
        : `rgba(214, 228, 240, ${a})`;
      ctx.fill();
      if (s.r > 0.95 && a > 0.4) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = s.warm
          ? `rgba(240, 200, 140, ${a * 0.07})`
          : `rgba(180, 214, 240, ${a * 0.07})`;
        ctx.fill();
      }
    }
    if (!reduce) raf = requestAnimationFrame(draw);
  }

  let raf;
  resize();
  window.addEventListener("resize", () => { resize(); if (reduce) draw(0); });
  if (reduce) { draw(0); } else { raf = requestAnimationFrame(draw); }
})();
