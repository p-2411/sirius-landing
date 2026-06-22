// Renders a static snapshot of the Sirius orb onto a solid-black background
// and writes app/icon.png. Mirrors the pixel math in components/sirius/orb.tsx
// (frozen static render at t=0, no audio, default non-tripartite ramp).

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const SIZE = 512;
const SEED = 1337;
const OUT = resolve(fileURLToPath(import.meta.url), "../../app/icon.png");

const FREQ = 1.6;
const THRESHOLD = 0.62;
const CONTRAST = 2.2;
const SHELL_POWER = 2.6;
const WISP_GAIN = 0.78;
const RIM_GAIN = 1.1;

const perm = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let seed = SEED;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];
}

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + t * (b - a);
function grad(hash, x, y, z) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}

function pnoise(x, y, z) {
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

function ridgedFBM(x, y, z) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let total = 0;
  for (let o = 0; o < 2; o += 1) {
    value += (1 - Math.abs(pnoise(x * freq, y * freq, z * freq))) * amp;
    total += amp;
    amp *= 0.45;
    freq *= 2;
  }
  return value / total;
}

function renderRGBA(w, h) {
  const data = new Uint8ClampedArray(w * h * 4);
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.4;

  // Static frozen render: time=0, yaw=0, pitch=0, breathe=1, no audio.
  const warm = 0.5; // audioCent default

  let i = 0;
  for (let py = 0; py < h; py += 1) {
    const v = (py - cy) / radius;
    for (let px = 0; px < w; px += 1, i += 4) {
      const u = (px - cx) / radius;
      const r2 = u * u + v * v;

      if (r2 > 1.06 * 1.06) {
        // outside the orb's disc: fully transparent so the icon is a circle
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }

      const r = Math.sqrt(r2);
      const sz = Math.sqrt(Math.max(0, 1 - Math.min(1, r2)));
      // yaw=0, pitch=0 ⇒ rotated coords identical to (u, v, sz).
      const x3 = u;
      const y3 = v;
      const z3 = sz;

      const warpScale = 0.5;
      const warpAmp = 0.55;
      const wx = pnoise(x3 * warpScale, y3 * warpScale, z3 * warpScale) * warpAmp;
      const wy = pnoise(x3 * warpScale + 11.3, y3 * warpScale + 11.3, z3 * warpScale + 5.1) * warpAmp;

      const ridge = ridgedFBM((x3 + wx) * FREQ, (y3 + wy) * FREQ, z3 * FREQ);
      const wisp = Math.pow(Math.max(0, ridge - THRESHOLD) * 3, CONTRAST);
      const shell = Math.pow(r, SHELL_POWER);
      const edge = Math.max(0, (r - 0.84) / 0.16);
      const rim = Math.pow(edge, 1.55) * RIM_GAIN;

      let aa = 1;
      if (r > 0.92) {
        let s = (1.06 - r) / (1.06 - 0.92);
        if (s < 0) s = 0;
        else if (s > 1) s = 1;
        aa = s * s * (3 - 2 * s);
      }

      const plasma = wisp * shell;
      const intensity = plasma * WISP_GAIN + rim; // breathe=1
      const k = Math.min(1.2, intensity);

      let red;
      let green;
      let blue;
      if (k < 0.5) {
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

      red = red * (1 + warm * 0.25);
      green = green * (1 + warm * 0.1);
      blue = blue * (1 - warm * 0.2);

      const alpha = aa * Math.min(1, intensity * 1.05);

      // Disc mask: opaque inside r ≤ 0.99, smooth falloff to 0 at r = 1.06.
      let disc = 1;
      if (r > 0.99) {
        let s = (1.06 - r) / (1.06 - 0.99);
        if (s < 0) s = 0;
        else if (s > 1) s = 1;
        disc = s * s * (3 - 2 * s);
      }

      // Orb premultiplied over a black disc, masked into a circle.
      data[i] = Math.min(255, red * alpha) | 0;
      data[i + 1] = Math.min(255, green * alpha) | 0;
      data[i + 2] = Math.min(255, blue * alpha) | 0;
      data[i + 3] = (disc * 255) | 0;
    }
  }

  return data;
}

// Minimal PNG writer (8-bit RGBA, no filtering).
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n += 1) c = crcTable[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crcBuf]);
}
function encodePng(rgba, w, h) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y += 1) {
    raw[y * (stride + 1)] = 0; // None filter
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1,
    );
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const pixels = renderRGBA(SIZE, SIZE);
const png = encodePng(pixels, SIZE, SIZE);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, png);
console.log(`wrote ${OUT} (${png.length} bytes)`);
