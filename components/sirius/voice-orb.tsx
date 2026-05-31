"use client";

// Sirius Orb — plasma-noise canvas renderer. Faithful TS port of design/app/shared.jsx.
import { useEffect, useLayoutEffect, useRef } from "react";
import { T } from "@/lib/app-theme";

type Hue = "warm" | "cool";

type OrbOptions = {
  freq?: number;
  threshold?: number;
  contrast?: number;
  shellPower?: number;
  wispGain?: number;
  rimGain?: number;
  yawSpeed?: number;
  flowSpeed?: number;
  breatheAmp?: number;
  mouseEnabled?: boolean;
  seed?: number;
  hue?: Hue;
};

type ResolvedOptions = Required<OrbOptions>;

class SiriusOrb {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: ResolvedOptions;
  private perm = new Uint8Array(512);
  private w: number;
  private h: number;
  private cx: number;
  private cy: number;
  private radius: number;
  private img: ImageData;
  private mouseInside = false;
  private mX = 0;
  private mY = 0;
  private mSX = 0;
  private mSY = 0;
  private mVX = 0;
  private mVY = 0;
  private mLX = 0;
  private mLY = 0;
  // Cursor presence: 0 when the pointer is outside the orb, 1 when inside.
  // Smoothed in _frame so wisps can fade gracefully at the last cursor
  // position when the pointer leaves (instead of snapping to centre).
  private mPresence = 0;
  private mPTarget = 0;
  // Listening mode (the user is talking): the orb cycles through violet/
  // purple/pink/orange and pulses harder. Smoothed so transitions fade.
  private listenTarget = 0;
  private listenMix = 0;
  // Speaking mode (Sirius is talking): stable warm yellow/orange palette
  // with amplitude-driven pulse. Same smoothing.
  private siriusTarget = 0;
  private siriusMix = 0;
  private running = true;
  private _raf: number | null = null;
  private _mm?: (e: MouseEvent) => void;
  private _ml?: () => void;

  constructor(canvas: HTMLCanvasElement, options: OrbOptions = {}) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    this.canvas = canvas;
    this.ctx = ctx;
    this.opts = {
      freq: 1.5,
      threshold: 0.6,
      contrast: 2.1,
      shellPower: 3.4,
      wispGain: 0.78,
      rimGain: 1.05,
      yawSpeed: 0.11,
      flowSpeed: 1,
      breatheAmp: 0.014,
      mouseEnabled: true,
      seed: 1337,
      hue: "warm",
      ...options,
    };
    this._initPerlin();
    this.w = canvas.width;
    this.h = canvas.height;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.radius = Math.min(this.w, this.h) * 0.4;
    this.img = ctx.createImageData(this.w, this.h);
    this._bindMouse();
    const tick = (t: number) => {
      if (!this.running) return;
      this._frame(t);
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  private _bindMouse() {
    if (!this.opts.mouseEnabled) return;
    this._mm = (e: MouseEvent) => {
      const r = this.canvas.getBoundingClientRect();
      const lx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const ly = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      const rad = Math.sqrt(lx * lx + ly * ly);
      if (rad < 1.0) {
        this.mouseInside = true;
        this.mPTarget = 1;
        // Smooth velocity across mousemove events — instantaneous deltas
        // (lx - mLX) are noisy because mousemove fires irregularly. Blend
        // with the previous value so the per-frame velocity used in the
        // render loop changes gradually instead of in spikes.
        this.mVX = this.mVX * 0.55 + (lx - this.mLX) * 0.45;
        this.mVY = this.mVY * 0.55 + (ly - this.mLY) * 0.45;
        this.mLX = lx;
        this.mLY = ly;
        this.mX = lx;
        this.mY = ly;
      } else {
        this.mouseInside = false;
        this.mPTarget = 0;
        // Keep mX/mY at last in-orb position so wisps fade at that spot
        // instead of sliding back to centre.
      }
    };
    this._ml = () => {
      this.mouseInside = false;
      this.mPTarget = 0;
    };
    this.canvas.addEventListener("mousemove", this._mm);
    this.canvas.addEventListener("mouseleave", this._ml);
  }

  destroy() {
    this.running = false;
    if (this._raf !== null) cancelAnimationFrame(this._raf);
    if (this._mm) this.canvas.removeEventListener("mousemove", this._mm);
    if (this._ml) this.canvas.removeEventListener("mouseleave", this._ml);
  }

  setListening(b: boolean): void {
    this.listenTarget = b ? 1 : 0;
  }

  setSpeaking(b: boolean): void {
    this.siriusTarget = b ? 1 : 0;
  }

  // HSL → RGB (channels 0-255). h in [0,360), s/l in [0,1]. Called a few
  // times per frame when speaking — not per pixel — so the cost is
  // negligible.
  private _hsl(h: number, s: number, l: number): [number, number, number] {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp < 1) { r1 = c; g1 = x; }
    else if (hp < 2) { r1 = x; g1 = c; }
    else if (hp < 3) { g1 = c; b1 = x; }
    else if (hp < 4) { g1 = x; b1 = c; }
    else if (hp < 5) { r1 = x; b1 = c; }
    else { r1 = c; b1 = x; }
    const m = l - c / 2;
    return [(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255];
  }

  private _initPerlin() {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) p.push(i);
    let seed = this.opts.seed;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  private _fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private _grad(h: number, x: number, y: number, z: number) {
    const hh = h & 15;
    const u = hh < 8 ? x : y;
    const v = hh < 4 ? y : hh === 12 || hh === 14 ? x : z;
    return (hh & 1 ? -u : u) + (hh & 2 ? -v : v);
  }

  private _pnoise(x: number, y: number, z: number) {
    const p = this.perm;
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this._fade(x);
    const v = this._fade(y);
    const w = this._fade(z);
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    return lerp(
      lerp(
        lerp(this._grad(p[AA], x, y, z), this._grad(p[BA], x - 1, y, z), u),
        lerp(this._grad(p[AB], x, y - 1, z), this._grad(p[BB], x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(this._grad(p[AA + 1], x, y, z - 1), this._grad(p[BA + 1], x - 1, y, z - 1), u),
        lerp(this._grad(p[AB + 1], x, y - 1, z - 1), this._grad(p[BB + 1], x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  }

  private _ridged(x: number, y: number, z: number) {
    let v = 0;
    let a = 1;
    let f = 1;
    let tot = 0;
    for (let o = 0; o < 2; o++) {
      v += (1 - Math.abs(this._pnoise(x * f, y * f, z * f))) * a;
      tot += a;
      a *= 0.45;
      f *= 2;
    }
    return v / tot;
  }

  private _frame(time: number) {
    const o = this.opts;
    const tt = (time / 1000) * o.flowSpeed;
    // Smoothed cursor position lags the real cursor a little, giving the
    // "gas chasing the finger" feel. Velocity decays slowly so the wake
    // persists long after the cursor stops.
    this.mSX += (this.mX - this.mSX) * 0.14;
    this.mSY += (this.mY - this.mSY) * 0.14;
    this.mVX *= 0.96;
    this.mVY *= 0.96;
    // Smooth the presence so wisps fade in/out gradually (~0.4s).
    this.mPresence += (this.mPTarget - this.mPresence) * 0.08;
    // Same lerp for the mode mixes — wisp colour and pulse intensity
    // ease in/out of the listening / speaking palettes over ~0.5s.
    this.listenMix += (this.listenTarget - this.listenMix) * 0.06;
    this.siriusMix += (this.siriusTarget - this.siriusMix) * 0.06;
    // Camera rotation is purely time-based — no cursor coupling. The orb
    // shouldn't feel like it rotates to face the cursor; it should feel
    // like a body of gas the cursor passes through.
    const yaw = tt * o.yawSpeed;
    const pitch = Math.sin(tt * 0.07) * 0.04;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const tx = tt * 0.05;
    const ty = tt * 0.04;
    const tz = tt * 0.07;
    const wt = tt * 0.045;
    // Extra in-canvas pulsing while listening: a fast sine on top of the
    // base breathe, scaled by listenMix so it eases in/out. (Sirius
    // speaking adds its own breath below.)
    const listenPulse = (0.5 + 0.5 * Math.sin(tt * 2.4)) * this.listenMix;
    const siriusPulse = (0.5 + 0.5 * Math.sin(tt * 1.6)) * this.siriusMix;
    const breathe =
      1 +
      Math.sin(tt * 0.55) * o.breatheAmp +
      listenPulse * 0.18 +
      siriusPulse * 0.10;
    // Listening palette: cycle hue from ~220° (violet/indigo) → 295° (purple)
    // → 370° (red-orange) and back. 0.42 rad/s sine = ~15s sweep, slow
    // enough to read as a colour shift rather than a strobe.
    let lisLoR = 0, lisLoG = 0, lisLoB = 0;
    let lisMidR = 0, lisMidG = 0, lisMidB = 0;
    let lisHiR = 0, lisHiG = 0, lisHiB = 0;
    if (this.listenMix > 0.001) {
      const listenHue = 295 + Math.sin(tt * 0.42) * 75; // 220° .. 370°
      const [lr, lg, lb] = this._hsl(listenHue, 0.7, 0.10);
      const [mr, mg, mb] = this._hsl(listenHue, 0.85, 0.45);
      const [hr, hg, hb] = this._hsl(listenHue + 20, 0.9, 0.78);
      lisLoR = lr; lisLoG = lg; lisLoB = lb;
      lisMidR = mr; lisMidG = mg; lisMidB = mb;
      lisHiR = hr; lisHiG = hg; lisHiB = hb;
    }
    // Sirius palette: stable warm yellow/orange. Slight hue drift on a
    // slow sine adds life without distracting (≈ 25°..55°).
    let sirLoR = 0, sirLoG = 0, sirLoB = 0;
    let sirMidR = 0, sirMidG = 0, sirMidB = 0;
    let sirHiR = 0, sirHiG = 0, sirHiB = 0;
    if (this.siriusMix > 0.001) {
      const sirHue = 38 + Math.sin(tt * 0.3) * 12; // 26° .. 50°
      const [lr, lg, lb] = this._hsl(sirHue - 6, 0.75, 0.08);
      const [mr, mg, mb] = this._hsl(sirHue, 0.9, 0.42);
      const [hr, hg, hb] = this._hsl(sirHue + 8, 0.95, 0.72);
      sirLoR = lr; sirLoG = lg; sirLoB = lb;
      sirMidR = mr; sirMidG = mg; sirMidB = mb;
      sirHiR = hr; sirHiG = hg; sirHiB = hb;
    }
    const listenMix = this.listenMix;
    const siriusMix = this.siriusMix;
    // Local cursor influence parameters. σ controls how wide the "gas
    // disturbance" extends from the cursor (in orb-normalized coords where
    // the sphere has radius 1). Wider σ + cubic falloff = soft, gaseous
    // edge.
    const fingerSigma2Inv = 1 / 0.52; // σ ≈ 0.72 — wider, gentler gradient
    // Position pull: drags noise samples TOWARD the cursor. Gentler than
    // before — the wisp-brightness boost below is the main "stuck-to-
    // cursor" effect; the noise warp just gives a subtle flowing motion.
    const positionGain = 0.22;
    // Velocity contribution kept small — its variance is the main source
    // of frame-to-frame jitter near the cursor.
    const velocityGain = 1.2;
    // Wisp brightness boost peaks at the cursor and fades cubically with
    // distance — this is what makes the gas look like it's "stuck to the
    // cursor" and dissipating outward. Scaled by `mPresence` so the
    // effect fades in/out smoothly when the pointer enters/leaves.
    const wispBoostMax = 1.2 * this.mPresence;
    const data = this.img.data;
    let i = 0;
    const warmMode = o.hue === "warm";
    for (let py = 0; py < this.h; py++) {
      const v = (py - this.cy) / this.radius;
      for (let px = 0; px < this.w; px++, i += 4) {
        const u = (px - this.cx) / this.radius;
        const r2 = u * u + v * v;
        if (r2 > 1.06 * 1.06) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }
        const r = Math.sqrt(r2);
        const sz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
        const x3 = u * cy + sz * sy;
        let y3 = v;
        let z3 = -u * sy + sz * cy;
        const y3p = y3 * cp - z3 * sp;
        const z3p = y3 * sp + z3 * cp;
        y3 = y3p;
        z3 = z3p;
        const ws = 0.5;
        const wa = 0.55;
        // Soft cubic-falloff cursor influence: 1.0 at the cursor, smoothly
        // → 0 at radius σ. The cubic taper avoids any visible hard edge.
        const fdx = u - this.mSX;
        const fdy = v - this.mSY;
        const fd = (fdx * fdx + fdy * fdy) * fingerSigma2Inv;
        const finfLin = fd < 1 ? 1 - fd : 0;
        const finf = finfLin * finfLin * finfLin;
        // Position pull (-fdx * positionGain * finf): noise sample shifts
        // toward the cursor near it, creating a gaseous bulge.
        // Velocity term (mVX * velocityGain * finf): the bulge drifts in
        // the direction the cursor moved, so the gas trails behind.
        const cursorX = -fdx * positionGain * finf + this.mVX * velocityGain * finf;
        const cursorY = -fdy * positionGain * finf + this.mVY * velocityGain * finf;
        const wx =
          this._pnoise(x3 * ws, y3 * ws, z3 * ws + wt) * wa + cursorX;
        const wy =
          this._pnoise(x3 * ws + 11.3, y3 * ws + 11.3, z3 * ws + wt + 5.1) * wa +
          cursorY;
        const ridge = this._ridged(
          (x3 + wx) * o.freq + tx,
          (y3 + wy) * o.freq + ty,
          z3 * o.freq + tz,
        );
        const wisp = Math.pow(Math.max(0, ridge - o.threshold) * 3, o.contrast);
        const shell = Math.pow(r, o.shellPower);
        const edge = Math.max(0, (r - 0.84) / 0.16);
        const rim = Math.pow(edge, 1.55) * o.rimGain;
        let aa = 1;
        if (r > 0.92) {
          let s = (1.06 - r) / 0.14;
          if (s < 0) s = 0;
          else if (s > 1) s = 1;
          aa = s * s * (3 - 2 * s);
        }
        // Wisps "stick" to the cursor: multiply wispiness by (1 + boost·finf)
        // so the gas glows brightest under the pointer and fades smoothly
        // back to ambient at radius σ.
        const cursorWispMul = 1 + wispBoostMax * finf;
        const k = Math.min(
          1.2,
          (wisp * shell * o.wispGain * cursorWispMul + rim) * breathe,
        );
        let rr: number;
        let gg: number;
        let bb: number;
        if (warmMode) {
          if (k < 0.5) {
            const t = k / 0.5;
            rr = 14 + t * 70;
            gg = 10 + t * 60;
            bb = 22 + t * 40;
          } else if (k < 0.95) {
            const t = (k - 0.5) / 0.45;
            rr = 84 + t * 135;
            gg = 70 + t * 100;
            bb = 62 + t * 40;
          } else {
            const t = Math.min(1, (k - 0.95) / 0.3);
            rr = 219 + t * 30;
            gg = 170 + t * 40;
            bb = 102 + t * 30;
          }
        } else {
          if (k < 0.5) {
            const t = k / 0.5;
            rr = 4 + t * 30;
            gg = 12 + t * 120;
            bb = 32 + t * 200;
          } else if (k < 0.95) {
            const t = (k - 0.5) / 0.45;
            rr = 34 + t * 90;
            gg = 132 + t * 80;
            bb = 232 + t * 18;
          } else {
            const t = Math.min(1, (k - 0.95) / 0.3);
            rr = 124 + t * 60;
            gg = 212 + t * 30;
            bb = 250 + t * 5;
          }
        }
        // Apply Sirius-speaking palette first (warm orange), then listening
        // palette (violet→orange cycle). Sequential blending: in practice
        // only one is active at a time, but during a state transition both
        // mixes overlap briefly and the result is a smooth crossfade.
        if (siriusMix > 0.001) {
          let sr: number, sg: number, sb: number;
          if (k < 0.5) {
            const t = k / 0.5;
            sr = sirLoR + t * (sirMidR - sirLoR);
            sg = sirLoG + t * (sirMidG - sirLoG);
            sb = sirLoB + t * (sirMidB - sirLoB);
          } else if (k < 0.95) {
            const t = (k - 0.5) / 0.45;
            sr = sirMidR + t * (sirHiR - sirMidR);
            sg = sirMidG + t * (sirHiG - sirMidG);
            sb = sirMidB + t * (sirHiB - sirMidB);
          } else {
            const t = Math.min(1, (k - 0.95) / 0.3);
            sr = sirHiR + t * 30;
            sg = sirHiG + t * 25;
            sb = sirHiB + t * 20;
          }
          const inv = 1 - siriusMix;
          rr = rr * inv + sr * siriusMix;
          gg = gg * inv + sg * siriusMix;
          bb = bb * inv + sb * siriusMix;
        }
        if (listenMix > 0.001) {
          let sr: number, sg: number, sb: number;
          if (k < 0.5) {
            const t = k / 0.5;
            sr = lisLoR + t * (lisMidR - lisLoR);
            sg = lisLoG + t * (lisMidG - lisLoG);
            sb = lisLoB + t * (lisMidB - lisLoB);
          } else if (k < 0.95) {
            const t = (k - 0.5) / 0.45;
            sr = lisMidR + t * (lisHiR - lisMidR);
            sg = lisMidG + t * (lisHiG - lisMidG);
            sb = lisMidB + t * (lisHiB - lisMidB);
          } else {
            const t = Math.min(1, (k - 0.95) / 0.3);
            sr = lisHiR + t * 30;
            sg = lisHiG + t * 30;
            sb = lisHiB + t * 30;
          }
          const inv = 1 - listenMix;
          rr = rr * inv + sr * listenMix;
          gg = gg * inv + sg * listenMix;
          bb = bb * inv + sb * listenMix;
        }
        const alpha = aa * Math.min(1, (wisp * shell * o.wispGain + rim) * breathe * 1.05);
        data[i] = rr | 0;
        data[i + 1] = gg | 0;
        data[i + 2] = bb | 0;
        data[i + 3] = (alpha * 255) | 0;
      }
    }
    this.ctx.putImageData(this.img, 0, 0);
  }
}

type OrbProps = {
  size?: number;
  hue?: Hue;
  glow?: boolean;
  pulse?: boolean;
  amplitude?: number;
  // The user is talking — orb cycles through violet/purple/pink/orange
  // and pulses harder.
  listening?: boolean;
  // Sirius is talking — orb shifts to a steady yellow/orange palette.
  speaking?: boolean;
  className?: string;
};

/**
 * Orb — animated plasma-noise sphere on a <canvas>.
 *
 * Intent: The Sirius brand mark. Appears full-size on the Voice page and
 *   shrinks to a tiny icon in the Rail logo, chat avatars, and Composer.
 *
 * Used in: Composer.tsx, MessageBubble.tsx (assistant avatar), Rail.tsx
 *   (logo), VoiceCenter.tsx (hero).
 *
 * Props:
 *   - size: outer canvas dimension in CSS px (default 320). The internal
 *     render buffer is clamped to [120, 420] to keep per-frame cost bounded
 *     when the orb is shown large.
 *   - hue: "warm" | "cool" — color ramp. Default "cool" (the blue mark).
 *   - glow: when true, an extra radial-gradient halo wraps the canvas.
 *     Disabled for small uses (Composer, MessageBubble, Rail logo).
 *
 * Notes:
 *   - The SiriusOrb class is a CPU plasma renderer (ported from
 *     design/app/shared.jsx). It iterates every pixel each frame using a
 *     Perlin-noise field — keep the buffer small.
 *   - useEffect mounts/destroys a SiriusOrb per (size, hue) change. The
 *     destroy() handler cancels the rAF loop and removes mouse listeners.
 *   - Mouse movement inside the orb subtly stirs the plasma; outside the
 *     unit circle the effect is gated off.
 */
export function VoiceOrb({
  size = 320,
  hue = "cool",
  glow = true,
  pulse = false,
  amplitude = 0,
  listening = false,
  speaking = false,
  className,
}: OrbProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const orbRef = useRef<SiriusOrb | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Mutable refs for the rAF loop. Updating these on every render is
  // cheap and doesn't trigger React re-flow; the animation loop reads
  // them every frame.
  const ampTargetRef = useRef(0);
  const scaleAmpRef = useRef(0.08);
  const enabledRef = useRef(false);
  // Keep the rAF-loop refs in sync after each render (writing refs during
  // render is disallowed by react-hooks/refs in this repo's lint config).
  useLayoutEffect(() => {
    ampTargetRef.current = amplitude;
    scaleAmpRef.current = listening ? 0.16 : speaking ? 0.12 : 0.08;
    enabledRef.current = pulse;
  });

  useEffect(() => {
    if (!ref.current) return;
    // Internal buffer is downsampled vs. the CSS size — the per-frame loop
    // is O(w·h), so a 0.6x linear cut nearly doubles frame rate. The
    // blur(0.8px) filter masks the small loss of sharpness.
    const internal = Math.min(220, Math.max(96, Math.round(size * 0.6)));
    ref.current.width = internal;
    ref.current.height = internal;
    const orb = new SiriusOrb(ref.current, { mouseEnabled: true, hue });
    orbRef.current = orb;
    return () => {
      orb.destroy();
      orbRef.current = null;
    };
  }, [size, hue]);
  // Sync the two mode flags without rebuilding the orb (which would reset
  // its Perlin tables and presence smoothing).
  useEffect(() => {
    orbRef.current?.setListening(listening);
  }, [listening]);
  useEffect(() => {
    orbRef.current?.setSpeaking(speaking);
  }, [speaking]);
  // rAF-driven wrapper-scale animation. Smooths the amplitude prop and
  // adds a continuous low-amplitude breathing so the orb is always softly
  // alive even between voice samples. Decoupled from React renders so
  // it stays fluid regardless of how chunky the amplitude updates are.
  useEffect(() => {
    let smooth = 0;
    let raf: number;
    const tick = () => {
      // Critically damped-feeling lerp: 0.18 per frame ≈ 100ms time
      // constant. Adjust if you want it snappier or laggier.
      const target = Math.max(0, Math.min(1, ampTargetRef.current));
      smooth += (target - smooth) * 0.18;
      const node = wrapperRef.current;
      if (node) {
        if (enabledRef.current) {
          const t = performance.now() * 0.001;
          // Two slow sines on different frequencies + the smoothed
          // amplitude. Multi-frequency breath looks more organic than a
          // single sine and never sits perfectly still.
          const breath =
            1 + Math.sin(t * 0.9) * 0.012 + Math.sin(t * 1.7 + 1.2) * 0.006;
          const dynamic = 1 + smooth * scaleAmpRef.current;
          node.style.transform = `scale(${(dynamic * breath).toFixed(4)})`;
        } else {
          node.style.transform = "scale(1)";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
        // Initial transform; the rAF loop takes over and overrides this
        // every frame.
        transform: "scale(1)",
      }}
    >
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.3,
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              hue === "warm"
                ? `radial-gradient(circle, rgba(${T.warmRGB},0.18) 0%, rgba(${T.warmRGB},0.04) 35%, transparent 65%)`
                : `radial-gradient(circle, rgba(${T.cyanStrongRGB},0.22) 0%, rgba(${T.cyanStrongRGB},0.05) 35%, transparent 65%)`,
          }}
        />
      )}
      <canvas
        ref={ref}
        style={{
          width: size,
          height: size,
          display: "block",
          filter: "blur(0.8px)",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
