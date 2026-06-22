"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { useOrbAudio } from "./orb-audio-context";
import type { OrbAudioSignal } from "./orb-audio-context";

type SiriusOrbOptions = {
  freq: number;
  threshold: number;
  contrast: number;
  shellPower: number;
  wispGain: number;
  rimGain: number;
  yawSpeed: number;
  flowSpeed: number;
  breatheAmp: number;
  mouseEnabled: boolean;
  mouseTarget: HTMLElement | null;
  seed: number;
  audioRef: React.MutableRefObject<OrbAudioSignal> | null;
  tripartite: boolean;
  listenTone: boolean;
};

export function Orb({
  className,
  staticRender = false,
  glowless = false,
  tripartite = false,
  interactive = false,
  pulse = false,
  listening = false,
}: {
  className?: string;
  staticRender?: boolean;
  glowless?: boolean;
  tripartite?: boolean;
  interactive?: boolean;
  pulse?: boolean;
  listening?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { signalRef } = useOrbAudio();
  const frozen = staticRender || !!shouldReduceMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const orb = new SiriusOrbRenderer(canvas, {
      mouseEnabled: !frozen && interactive,
      flowSpeed: frozen ? 0 : 1,
      yawSpeed: frozen ? 0 : 0.13,
      breatheAmp: frozen ? 0 : 0.012,
      audioRef: frozen ? null : signalRef,
      tripartite,
      listenTone: listening,
    });

    if (frozen) {
      orb.stop();
      orb.renderStatic();
    }

    return () => orb.destroy();
  }, [frozen, signalRef, tripartite, interactive, listening]);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || frozen || !pulse) {
      if (node) {
        node.style.transform = "scale(1)";
      }
      return;
    }

    let smoothAmp = 0;
    let activeMix = 0;
    let raf: number;

    const tick = () => {
      const signal = signalRef.current;
      const target = Math.max(0, Math.min(1, signal.amplitude));

      // Envelope follower: responsive attack, slow release. It tracks the
      // *shape* of speech (rising/falling energy) rather than snapping on
      // every syllable — amplitude-driven without the buggy per-word twitch.
      const k = target > smoothAmp ? 0.22 : 0.06;
      smoothAmp += (target - smoothAmp) * k;
      activeMix += ((signal.active ? 1 : 0) - activeMix) * 0.12;

      const t = performance.now() * 0.001;

      // Idle: slow, subtle breath so the orb is alive before a tap.
      const idleBreath = Math.sin(t * 0.85) * 0.014 + Math.sin(t * 1.55 + 1.2) * 0.007;

      // Listening: a small steady base pulse so it never freezes between
      // words, plus an amplitude swell that rides voice energy (soft curve
      // so loud speech reads strong without spiking). Peaks ~+17%.
      const basePulse = 0.022 + Math.sin(t * 2.2) * 0.016;
      const voiceSwell = Math.pow(smoothAmp, 0.7) * 0.13;
      const listenPulse = basePulse + voiceSwell;

      const breath = idleBreath * (1 - activeMix) + listenPulse * activeMix;
      const scale = 1 + breath;
      node.style.transform = `scale(${scale.toFixed(4)})`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      node.style.transform = "scale(1)";
    };
  }, [frozen, pulse, signalRef]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "pointer-events-none relative h-[clamp(280px,70vw,360px)] w-[clamp(280px,70vw,360px)] will-change-transform",
        className,
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} width={320} height={320} className="absolute inset-0 z-10 block h-full w-full blur-[0.45px]" />
    </div>
  );
}

class SiriusOrbRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: SiriusOrbOptions;
  private perm = new Uint8Array(512);
  private img: ImageData;
  private w: number;
  private h: number;
  private cx: number;
  private cy: number;
  private radius: number;
  private running = false;
  private raf: number | null = null;
  private mouseTarget: HTMLElement | null = null;
  private onMouseMove: ((event: MouseEvent) => void) | null = null;
  private onMouseLeave: (() => void) | null = null;
  private mouseInside = false;
  private mouseLocalX = 0;
  private mouseLocalY = 0;
  private mouseLocalSmoothX = 0;
  private mouseLocalSmoothY = 0;
  private mouseVelX = 0;
  private mouseVelY = 0;
  private mouseLastX = 0;
  private mouseLastY = 0;
  private listenMix = 0;

  constructor(canvas: HTMLCanvasElement, options: Partial<SiriusOrbOptions> = {}) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("SiriusOrb: canvas 2D context is unavailable");
    }

    this.canvas = canvas;
    this.ctx = ctx;
    this.opts = {
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
      audioRef: null,
      tripartite: false,
      listenTone: false,
      ...options,
    };

    this.listenMix = this.opts.listenTone ? 1 : 0;
    this.initPerlin();
    this.w = canvas.width;
    this.h = canvas.height;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.radius = Math.min(this.w, this.h) * 0.4;
    this.img = this.ctx.createImageData(this.w, this.h);
    this.initMouse();
    this.start();
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    const tick = (time: number) => {
      if (!this.running) {
        return;
      }

      this.frame(time);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    this.raf = null;
  }

  destroy() {
    this.stop();
    this.removeMouse();
  }

  renderStatic() {
    this.frame(0);
  }

  private initPerlin() {
    const p: number[] = [];
    for (let index = 0; index < 256; index += 1) {
      p.push(index);
    }

    let seed = this.opts.seed;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    for (let index = 255; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [p[index], p[swapIndex]] = [p[swapIndex], p[index]];
    }

    for (let index = 0; index < 512; index += 1) {
      this.perm[index] = p[index & 255];
    }
  }

  private initMouse() {
    if (!this.opts.mouseEnabled) {
      return;
    }

    const target = this.opts.mouseTarget || this.canvas;
    this.mouseTarget = target;
    this.onMouseMove = (event: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      const localX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const localY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      const localRadius = Math.sqrt(localX * localX + localY * localY);

      if (localRadius < 0.95) {
        this.mouseInside = true;
        this.mouseVelX = localX - this.mouseLastX;
        this.mouseVelY = localY - this.mouseLastY;
        this.mouseLastX = localX;
        this.mouseLastY = localY;
        this.mouseLocalX = localX;
        this.mouseLocalY = localY;
      } else {
        this.mouseInside = false;
        this.mouseLocalX = 0;
        this.mouseLocalY = 0;
      }
    };
    this.onMouseLeave = () => {
      this.mouseInside = false;
      this.mouseLocalX = 0;
      this.mouseLocalY = 0;
    };

    target.addEventListener("mousemove", this.onMouseMove);
    target.addEventListener("mouseleave", this.onMouseLeave);
  }

  private removeMouse() {
    if (this.mouseTarget && this.onMouseMove && this.onMouseLeave) {
      this.mouseTarget.removeEventListener("mousemove", this.onMouseMove);
      this.mouseTarget.removeEventListener("mouseleave", this.onMouseLeave);
    }

    this.mouseTarget = null;
    this.onMouseMove = null;
    this.onMouseLeave = null;
  }

  private frame(time: number) {
    const opts = this.opts;
    const tt = (time / 1000) * opts.flowSpeed;

    this.mouseLocalSmoothX += (this.mouseLocalX - this.mouseLocalSmoothX) * 0.1;
    this.mouseLocalSmoothY += (this.mouseLocalY - this.mouseLocalSmoothY) * 0.1;
    this.mouseVelX *= 0.9;
    this.mouseVelY *= 0.9;

    const yaw = tt * opts.yawSpeed + this.mouseLocalSmoothX * 0.4;
    const pitch = this.mouseLocalSmoothY * 0.28 + Math.sin(tt * 0.07) * 0.04;
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const tx = tt * 0.05;
    const ty = tt * 0.04;
    const tz = tt * 0.07;
    const wt = tt * 0.045;
    const baseBreathe = 1 + Math.sin(tt * 0.55) * opts.breatheAmp;

    // Listening mode is smoothed on the existing renderer instance. The
    // Perlin tables and time field stay alive; no React rebuild is involved.
    const audio = opts.audioRef?.current;
    const audioActive = !!audio?.active;
    const audioCent = audio?.centroid ?? 0.5;
    this.listenMix += ((opts.listenTone || audioActive ? 1 : 0) - this.listenMix) * 0.06;

    const listenPulse = (0.5 + 0.5 * Math.sin(tt * 2.4)) * this.listenMix;
    const breathe = baseBreathe + listenPulse * 0.18;
    const wispGain = opts.wispGain;

    const stirX = -this.mouseLocalSmoothX * 0.55 + this.mouseVelX * 1.6;
    const stirY = -this.mouseLocalSmoothY * 0.55 + this.mouseVelY * 1.6;
    const data = this.img.data;

    let dataIndex = 0;
    for (let py = 0; py < this.h; py += 1) {
      const v = (py - this.cy) / this.radius;
      for (let px = 0; px < this.w; px += 1, dataIndex += 4) {
        const u = (px - this.cx) / this.radius;
        const r2 = u * u + v * v;

        if (r2 > 1.06 * 1.06) {
          data[dataIndex] = 0;
          data[dataIndex + 1] = 0;
          data[dataIndex + 2] = 0;
          data[dataIndex + 3] = 0;
          continue;
        }

        const r = Math.sqrt(r2);
        const sz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
        const x3 = u * cosYaw + sz * sinYaw;
        let y3 = v;
        let z3 = -u * sinYaw + sz * cosYaw;
        const y3p = y3 * cosPitch - z3 * sinPitch;
        const z3p = y3 * sinPitch + z3 * cosPitch;
        y3 = y3p;
        z3 = z3p;

        const warpScale = 0.5;
        const warpAmp = 0.55;
        const wx = this.pnoise(x3 * warpScale, y3 * warpScale, z3 * warpScale + wt) * warpAmp + stirX;
        const wy =
          this.pnoise(x3 * warpScale + 11.3, y3 * warpScale + 11.3, z3 * warpScale + wt + 5.1) * warpAmp +
          stirY;

        const ridge = this.ridgedFBM((x3 + wx) * opts.freq + tx, (y3 + wy) * opts.freq + ty, z3 * opts.freq + tz);
        const wisp = Math.pow(Math.max(0, ridge - opts.threshold) * 3, opts.contrast);
        const shell = Math.pow(r, opts.shellPower);
        const edge = Math.max(0, (r - 0.84) / 0.16);
        const rim = Math.pow(edge, 1.55) * opts.rimGain;

        let aa = 1;
        if (r > 0.92) {
          let s = (1.06 - r) / (1.06 - 0.92);
          if (s < 0) {
            s = 0;
          } else if (s > 1) {
            s = 1;
          }
          aa = s * s * (3 - 2 * s);
        }

        const plasma = wisp * shell;
        const intensity = (plasma * wispGain + rim) * breathe;
        const k = Math.min(1.2, intensity);
        let red: number;
        let green: number;
        let blue: number;

        if (opts.tripartite) {
          // Clockwise from top: 0=gold/memory, 1=green/actions, 2=cyan/workflows
          const ang = Math.atan2(u, -v);
          const norm = ((ang + TAU) % TAU) / SECTOR_ARC;
          const sector = Math.floor(norm) % 3;
          const sf = norm - Math.floor(norm);
          let feather = 0;
          if (sf > 1 - SECTOR_FEATHER) {
            const fs = (sf - (1 - SECTOR_FEATHER)) / SECTOR_FEATHER;
            feather = fs * fs * (3 - 2 * fs);
          }
          const [r0, g0, b0] = sectorRamp(sector, k);
          if (feather > 0) {
            const [r1, g1, b1] = sectorRamp((sector + 1) % 3, k);
            red = r0 + (r1 - r0) * feather;
            green = g0 + (g1 - g0) * feather;
            blue = b0 + (b1 - b0) * feather;
          } else {
            red = r0;
            green = g0;
            blue = b0;
          }
        } else if (k < 0.5) {
          const t = k / 0.5;
          red = 4 + t * 30;
          green = 12 + t * 120;
          blue = 32 + t * 200;
        } else if (k < 0.95) {
          const t = (k - 0.5) / 0.45;
          red = 34 + t * 90;
          green = 132 + t * 80;
          blue = 232 + t * 18;
        } else {
          const t = Math.min(1, (k - 0.95) / 0.3);
          red = 124 + t * 60;
          green = 212 + t * 30;
          blue = 250 + t * 5;
        }

        // Ambient centroid colour bias: warm (treble) pulls toward cream,
        // cool (bass) toward cyan.
        const warm = audioCent; // 0 = cool/bass, 1 = warm/treble
        red = red * (1 + warm * 0.25);
        green = green * (1 + warm * 0.1);
        blue = blue * (1 - warm * 0.2);

        if (this.listenMix > 0.001) {
          // Match the shipped app's listening state: slow violet/purple/pink
          // sweep toward warm orange. Blend gradually so the mode switch is
          // a colour crossfade, not a visual reset.
          const listenHue = 295 + Math.sin(tt * 0.42) * 75;
          const [loR, loG, loB] = hsl(listenHue, 0.7, 0.1);
          const [midR, midG, midB] = hsl(listenHue, 0.85, 0.45);
          const [hiR, hiG, hiB] = hsl(listenHue + 20, 0.9, 0.78);
          let listenRed: number;
          let listenGreen: number;
          let listenBlue: number;

          if (k < 0.5) {
            const t = k / 0.5;
            listenRed = loR + t * (midR - loR);
            listenGreen = loG + t * (midG - loG);
            listenBlue = loB + t * (midB - loB);
          } else if (k < 0.95) {
            const t = (k - 0.5) / 0.45;
            listenRed = midR + t * (hiR - midR);
            listenGreen = midG + t * (hiG - midG);
            listenBlue = midB + t * (hiB - midB);
          } else {
            const t = Math.min(1, (k - 0.95) / 0.3);
            listenRed = hiR + t * 30;
            listenGreen = hiG + t * 30;
            listenBlue = hiB + t * 30;
          }

          const mix = this.listenMix;
          const inv = 1 - mix;
          red = red * inv + listenRed * mix;
          green = green * inv + listenGreen * mix;
          blue = blue * inv + listenBlue * mix;
        }

        const alpha = aa * Math.min(1, intensity * 1.05);
        data[dataIndex] = Math.min(255, red) | 0;
        data[dataIndex + 1] = Math.min(255, green) | 0;
        data[dataIndex + 2] = Math.min(255, blue) | 0;
        data[dataIndex + 3] = (alpha * 255) | 0;
      }
    }

    this.ctx.putImageData(this.img, 0, 0);
  }

  private ridgedFBM(x: number, y: number, z: number) {
    let value = 0;
    let amp = 1;
    let freq = 1;
    let total = 0;

    for (let octave = 0; octave < 2; octave += 1) {
      value += (1 - Math.abs(this.pnoise(x * freq, y * freq, z * freq))) * amp;
      total += amp;
      amp *= 0.45;
      freq *= 2;
    }

    return value / total;
  }

  private pnoise(x: number, y: number, z: number) {
    const perm = this.perm;
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;

    return lerp(
      lerp(
        lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  }
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}

function hsl(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = hue / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp < 1) {
    r1 = c;
    g1 = x;
  } else if (hp < 2) {
    r1 = x;
    g1 = c;
  } else if (hp < 3) {
    g1 = c;
    b1 = x;
  } else if (hp < 4) {
    g1 = x;
    b1 = c;
  } else if (hp < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  const m = l - c / 2;
  return [(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255];
}

const TAU = Math.PI * 2;
const SECTOR_ARC = TAU / 3;
const SECTOR_FEATHER = 0.08;

// Three intensity-driven color ramps, one per sector.
// Sector 0 = gold/memory (217,185,120), 1 = green/actions (167,219,178), 2 = cyan/workflows (108,216,255).
function sectorRamp(sector: number, k: number): [number, number, number] {
  let r: number;
  let g: number;
  let b: number;
  if (sector === 1) {
    // Zone 1 — green / Actions, anchored at 167,219,178
    if (k < 0.5) {
      const t = k / 0.5;
      r = 10 + t * 90;
      g = 20 + t * 147;
      b = 15 + t * 75;
    } else if (k < 0.95) {
      const t = (k - 0.5) / 0.45;
      r = 100 + t * 67;
      g = 167 + t * 53;
      b = 90 + t * 88;
    } else {
      const t = Math.min(1, (k - 0.95) / 0.3);
      r = 167 + t * 33;
      g = 220 + t * 15;
      b = 178 + t * 27;
    }
  } else if (sector === 2) {
    // Zone 2 — cyan / Workflows, anchored at 108,216,255
    if (k < 0.5) {
      const t = k / 0.5;
      r = 4 + t * 104;
      g = 8 + t * 208;
      b = 16 + t * 239;
    } else if (k < 0.95) {
      const t = (k - 0.5) / 0.45;
      r = 108 + t * 47;
      g = 216 - t * 2;
      b = 255 - t * 26;
    } else {
      const t = Math.min(1, (k - 0.95) / 0.3);
      r = 155 - t * 75;
      g = 214 - t * 54;
      b = 229 + t * 11;
    }
  } else {
    // Zone 0 — gold / Memory, anchored at 217,185,120
    if (k < 0.5) {
      const t = k / 0.5;
      r = 8 + t * 209;
      g = 7 + t * 178;
      b = 4 + t * 116;
    } else if (k < 0.95) {
      const t = (k - 0.5) / 0.45;
      r = 217 + t * 23;
      g = 185 + t * 15;
      b = 120 + t * 1;
    } else {
      const t = Math.min(1, (k - 0.95) / 0.3);
      r = 240 + t * 15;
      g = 200 + t * 25;
      b = 121 + t * 49;
    }
  }
  return [r, g, b];
}
