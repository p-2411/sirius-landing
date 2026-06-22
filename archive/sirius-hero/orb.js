// Sirius orb — CPU plasma renderer ported to vanilla JS.
// The orb is the Dog Star: a blue-white plasma core that breathes, drifts,
// and reacts to the cursor. A `tint` option warms it toward gold.
(function () {
  "use strict";

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  }

  class SiriusOrbRenderer {
    constructor(canvas, options = {}) {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("SiriusOrb: canvas 2D context unavailable");
      this.canvas = canvas;
      this.ctx = ctx;
      this.opts = Object.assign({
        freq: 1.6,
        threshold: 0.62,
        contrast: 2.2,
        shellPower: 2.6,
        wispGain: 0.78,
        rimGain: 1.1,
        yawSpeed: 0.13,
        flowSpeed: 1,
        breatheAmp: 0.012,
        mouseEnabled: true,
        mouseTarget: null,
        seed: 1337,
        tint: 0,        // 0 = blue-white star, 1 = warm gold
        frozen: false,
      }, options);

      this.perm = new Uint8Array(512);
      this.running = false;
      this.raf = null;
      this.mouseInside = false;
      this.mouseLocalX = 0; this.mouseLocalY = 0;
      this.mouseLocalSmoothX = 0; this.mouseLocalSmoothY = 0;
      this.mouseVelX = 0; this.mouseVelY = 0;
      this.mouseLastX = 0; this.mouseLastY = 0;

      this.initPerlin();
      this.w = canvas.width; this.h = canvas.height;
      this.cx = this.w / 2; this.cy = this.h / 2;
      this.radius = Math.min(this.w, this.h) * 0.4;
      this.img = this.ctx.createImageData(this.w, this.h);
      this.initMouse();
      if (this.opts.frozen) { this.renderStatic(); } else { this.start(); }
    }

    setTint(t) { this.targetTint = t; }

    start() {
      if (this.running) return;
      this.running = true;
      const tick = (time) => {
        if (!this.running) return;
        this.frame(time);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
    stop() { this.running = false; if (this.raf) cancelAnimationFrame(this.raf); this.raf = null; }
    destroy() { this.stop(); this.removeMouse(); }
    renderStatic() { this.frame(0); }

    initPerlin() {
      const p = [];
      for (let i = 0; i < 256; i++) p.push(i);
      let seed = this.opts.seed;
      const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
      for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
      for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    }

    initMouse() {
      if (!this.opts.mouseEnabled) return;
      const target = this.opts.mouseTarget || this.canvas;
      this.mouseTarget = target;
      this.onMouseMove = (event) => {
        const rect = target.getBoundingClientRect();
        const localX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const localY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        const r = Math.sqrt(localX * localX + localY * localY);
        if (r < 1.25) {
          this.mouseInside = true;
          this.mouseVelX = localX - this.mouseLastX;
          this.mouseVelY = localY - this.mouseLastY;
          this.mouseLastX = localX; this.mouseLastY = localY;
          this.mouseLocalX = localX; this.mouseLocalY = localY;
        } else {
          this.mouseInside = false; this.mouseLocalX = 0; this.mouseLocalY = 0;
        }
      };
      this.onMouseLeave = () => { this.mouseInside = false; this.mouseLocalX = 0; this.mouseLocalY = 0; };
      target.addEventListener("mousemove", this.onMouseMove);
      target.addEventListener("mouseleave", this.onMouseLeave);
    }
    removeMouse() {
      if (this.mouseTarget && this.onMouseMove) {
        this.mouseTarget.removeEventListener("mousemove", this.onMouseMove);
        this.mouseTarget.removeEventListener("mouseleave", this.onMouseLeave);
      }
      this.mouseTarget = null; this.onMouseMove = null; this.onMouseLeave = null;
    }

    frame(time) {
      const opts = this.opts;
      const tt = (time / 1000) * opts.flowSpeed;

      // smooth tint toward target
      if (this.targetTint == null) this.targetTint = opts.tint;
      opts.tint += (this.targetTint - opts.tint) * 0.08;
      const tint = opts.tint;

      this.mouseLocalSmoothX += (this.mouseLocalX - this.mouseLocalSmoothX) * 0.1;
      this.mouseLocalSmoothY += (this.mouseLocalY - this.mouseLocalSmoothY) * 0.1;
      this.mouseVelX *= 0.9; this.mouseVelY *= 0.9;

      const yaw = tt * opts.yawSpeed + this.mouseLocalSmoothX * 0.4;
      const pitch = this.mouseLocalSmoothY * 0.28 + Math.sin(tt * 0.07) * 0.04;
      const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch), sinPitch = Math.sin(pitch);

      const tx = tt * 0.05, ty = tt * 0.04, tz = tt * 0.07, wt = tt * 0.045;
      const breathe = 1 + Math.sin(tt * 0.55) * opts.breatheAmp;
      const wispGain = opts.wispGain;

      const stirX = -this.mouseLocalSmoothX * 0.55 + this.mouseVelX * 1.6;
      const stirY = -this.mouseLocalSmoothY * 0.55 + this.mouseVelY * 1.6;
      const data = this.img.data;

      let di = 0;
      for (let py = 0; py < this.h; py++) {
        const v = (py - this.cy) / this.radius;
        for (let px = 0; px < this.w; px++, di += 4) {
          const u = (px - this.cx) / this.radius;
          const r2 = u * u + v * v;
          if (r2 > 1.06 * 1.06) { data[di] = 0; data[di + 1] = 0; data[di + 2] = 0; data[di + 3] = 0; continue; }

          const r = Math.sqrt(r2);
          const sz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
          const x3 = u * cosYaw + sz * sinYaw;
          let y3 = v;
          let z3 = -u * sinYaw + sz * cosYaw;
          const y3p = y3 * cosPitch - z3 * sinPitch;
          const z3p = y3 * sinPitch + z3 * cosPitch;
          y3 = y3p; z3 = z3p;

          const warpScale = 0.5, warpAmp = 0.55;
          const wx = this.pnoise(x3 * warpScale, y3 * warpScale, z3 * warpScale + wt) * warpAmp + stirX;
          const wy = this.pnoise(x3 * warpScale + 11.3, y3 * warpScale + 11.3, z3 * warpScale + wt + 5.1) * warpAmp + stirY;

          const ridge = this.ridgedFBM((x3 + wx) * opts.freq + tx, (y3 + wy) * opts.freq + ty, z3 * opts.freq + tz);
          const wisp = Math.pow(Math.max(0, ridge - opts.threshold) * 3, opts.contrast);
          const shell = Math.pow(r, opts.shellPower);
          const edge = Math.max(0, (r - 0.84) / 0.16);
          const rim = Math.pow(edge, 1.55) * opts.rimGain;

          let aa = 1;
          if (r > 0.92) {
            let s = (1.06 - r) / (1.06 - 0.92);
            if (s < 0) s = 0; else if (s > 1) s = 1;
            aa = s * s * (3 - 2 * s);
          }

          const plasma = wisp * shell;
          const intensity = (plasma * wispGain + rim) * breathe;
          const k = Math.min(1.2, intensity);

          // Blue-white star ramp (default)
          let red, green, blue;
          if (k < 0.5) { const t = k / 0.5; red = 4 + t * 30; green = 12 + t * 120; blue = 32 + t * 200; }
          else if (k < 0.95) { const t = (k - 0.5) / 0.45; red = 34 + t * 90; green = 132 + t * 80; blue = 232 + t * 18; }
          else { const t = Math.min(1, (k - 0.95) / 0.3); red = 124 + t * 60; green = 212 + t * 30; blue = 250 + t * 5; }

          if (tint > 0.001) {
            // Gold ramp, anchored at 240,179,90
            let gr, gg, gb;
            if (k < 0.5) { const t = k / 0.5; gr = 8 + t * 209; gg = 7 + t * 172; gb = 4 + t * 86; }
            else if (k < 0.95) { const t = (k - 0.5) / 0.45; gr = 217 + t * 23; gg = 179 + t * 21; gb = 90 + t * 31; }
            else { const t = Math.min(1, (k - 0.95) / 0.3); gr = 240 + t * 15; gg = 200 + t * 25; gb = 121 + t * 49; }
            red = red * (1 - tint) + gr * tint;
            green = green * (1 - tint) + gg * tint;
            blue = blue * (1 - tint) + gb * tint;
          }

          const alpha = aa * Math.min(1, intensity * 1.05);
          data[di] = Math.min(255, red) | 0;
          data[di + 1] = Math.min(255, green) | 0;
          data[di + 2] = Math.min(255, blue) | 0;
          data[di + 3] = (alpha * 255) | 0;
        }
      }
      this.ctx.putImageData(this.img, 0, 0);
    }

    ridgedFBM(x, y, z) {
      let value = 0, amp = 1, freq = 1, total = 0;
      for (let o = 0; o < 2; o++) {
        value += (1 - Math.abs(this.pnoise(x * freq, y * freq, z * freq))) * amp;
        total += amp; amp *= 0.45; freq *= 2;
      }
      return value / total;
    }

    pnoise(x, y, z) {
      const perm = this.perm;
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z);
      const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
      const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      return lerp(
        lerp(
          lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
          lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
        lerp(
          lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
          lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
        w);
    }
  }

  window.SiriusOrbRenderer = SiriusOrbRenderer;
})();
