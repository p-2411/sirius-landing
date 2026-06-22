// Pure generator: post structure → deterministic constellation geometry.
// All coordinates are normalized to [0,1]; renderers scale to their viewBox.
// Seeded by slug so every essay's sky is unique but stable across builds.
import type { PostStructure } from "@/lib/blog";

export interface PlateStar {
  x: number;
  y: number;
  r: number;
  greek: string;
  label: string;
}

export interface PlateMinorStar {
  x: number;
  y: number;
  r: number;
}

export interface PlateSatellite {
  /** Center of the orbit = the parent star's position. */
  x: number;
  y: number;
  orbitR: number;
  /** Orbit duration in seconds. */
  dur: number;
}

export interface PlateDust {
  x: number;
  y: number;
  r: number;
}

export interface PlateModel {
  stars: PlateStar[];
  minors: PlateMinorStar[];
  satellites: PlateSatellite[];
  dust: PlateDust[];
}

export const GREEK = [
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ",
  "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π",
] as const;

const STOPWORDS = new Set([
  "the", "a", "an", "of", "to", "and", "or", "in", "on", "for", "is", "are",
  "it", "its", "your", "you", "how", "why", "what", "no", "not", "that", "this",
  "real", "actually",
]);

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** "Attention: the secret sauce" → "ATTENTION" */
export function starLabel(heading: string): string {
  const words = heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const word = words.find((w) => !STOPWORDS.has(w)) ?? words[0] ?? "";
  return word.toUpperCase().slice(0, 12);
}

export function buildPlateModel(
  structure: PostStructure,
  slug: string,
  readingMinutes: number,
): PlateModel {
  const rand = mulberry32(hashSeed(slug));

  // Posts with no H2s still get a one-star plate.
  const majors =
    structure.majors.length > 0
      ? structure.majors
      : [{ heading: slug.replace(/-/g, " "), words: structure.totalWords, codeBlocks: 0, minorHeadings: [] }];

  const majorWords = majors.reduce((sum, m) => sum + m.words, 0) || 1;

  // X: left→right, segment widths proportional to section length. minGap is half
  // the average equal-segment width — prevents overlap while compression stays proportional.
  const PAD_X = 0.08;
  const SPAN_X = 1 - 2 * PAD_X;
  const minGap = majors.length > 1 ? Math.min(0.1, SPAN_X / (majors.length * 2)) : 0;
  const xs: number[] = [];
  let cum = 0;
  for (let i = 0; i < majors.length; i++) {
    const x = PAD_X + SPAN_X * (cum / majorWords);
    xs.push(i === 0 ? x : Math.max(x, xs[i - 1] + minGap));
    cum += majors[i].words;
  }

  // Remap proportionally if min-gap pushes ran past the right edge
  // (e.g. a dominant first section followed by short closers).
  const MAX_X = 1 - PAD_X;
  const rawMax = xs[xs.length - 1];
  if (rawMax > MAX_X) {
    const scale = (MAX_X - PAD_X) / (rawMax - PAD_X);
    for (let i = 1; i < xs.length; i++) {
      xs[i] = PAD_X + (xs[i] - PAD_X) * scale;
    }
  }

  // Y: seeded within a band, re-rolled to reduce flat-line clustering
  // (best-effort: 8 attempts, then the last roll stands).
  const ys: number[] = [];
  for (let i = 0; i < majors.length; i++) {
    let y = 0.2 + 0.6 * rand();
    let tries = 0;
    while (i > 0 && Math.abs(y - ys[i - 1]) < 0.18 && tries < 8) {
      y = 0.2 + 0.6 * rand();
      tries++;
    }
    ys.push(y);
  }

  const stars: PlateStar[] = majors.map((m, i) => ({
    x: xs[i],
    y: ys[i],
    r: i === 0 ? 1.15 : 1,
    greek: GREEK[Math.min(i, GREEK.length - 1)],
    label: starLabel(m.heading),
  }));

  const minors: PlateMinorStar[] = majors.flatMap((m, i) =>
    m.minorHeadings.map(() => ({
      x: Math.min(0.96, Math.max(0.04, xs[i] + (rand() - 0.5) * 0.12)),
      y: Math.min(0.92, Math.max(0.08, ys[i] + (rand() - 0.5) * 0.24)),
      r: 0.45,
    })),
  );

  const satellites: PlateSatellite[] = majors.flatMap((m, i) =>
    m.codeBlocks > 0
      ? [{ x: xs[i], y: ys[i], orbitR: 0.045, dur: 8 + rand() * 4 }]
      : [],
  );

  const dustCount = Math.min(40, Math.max(8, readingMinutes * 4));
  const dust: PlateDust[] = Array.from({ length: dustCount }, () => ({
    x: rand(),
    y: rand(),
    r: 0.18 + rand() * 0.22,
  }));

  return { stars, minors, satellites, dust };
}
