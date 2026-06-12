# Blog Star Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/blog` and `/blog/[slug]` as the "Sirius Star Atlas" — every essay is a numbered plate whose constellation art is generated from the essay's own structure, with scroll-driven ambient charting on the essay page.

**Architecture:** A pure generator (`lib/constellation.ts`) turns parsed post structure (from an extended `lib/blog.ts`) into a deterministic `PlateModel`. One SVG renderer (`components/blog/plate.tsx`) draws it in `card` (draw-on-hover) and `hero` (unlit) variants; a client component (`components/blog/charted-sky.tsx`) renders the same constellation into the page background and ignites stars via IntersectionObserver. Pages are rebuilt server-first; all motion is CSS.

**Tech Stack:** Next.js 16 (App Router, SSG), React 19, MDX via `@mdx-js/mdx` `evaluate`, gray-matter, CSS in `app/blog/blog.css` (no Tailwind plugin changes).

**Verification:** This repo has **no test runner** (per CLAUDE.md). Every task verifies with `npx tsc --noEmit` + `npx eslint <changed files>`; page tasks also run `npm run build` and check that `/`, `/demo`, `/blog`, `/blog/[slug]` prerender. Spec: `docs/superpowers/specs/2026-06-12-blog-star-atlas-design.md`.

---

### Task 1: Extend `lib/blog.ts` — structure parsing, reading time, plate numbers, tags

**Files:**
- Modify: `lib/blog.ts`

- [ ] **Step 1: Replace the full contents of `lib/blog.ts`**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  slug: string;
  author: string;
  tags: string[];
  readingMinutes: number;
  /** 1-based position in chronological order — the oldest post is PLATE 01. */
  plateNumber: number;
}

export interface Post extends PostMeta {
  content: string;
}

/** One H2 section. Words/code blocks include any H3 subsections beneath it. */
export interface MajorSection {
  heading: string;
  words: number;
  codeBlocks: number;
  minorHeadings: string[];
}

export interface PostStructure {
  introWords: number;
  totalWords: number;
  majors: MajorSection[];
}

const postsDirectory = path.join(process.cwd(), "content/posts");
const WORDS_PER_MINUTE = 220;

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) throw new Error(`Invalid date: ${dateStr}`);
  return d;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Mirror of the heading ids generated for H2s so the ambient sky can observe them. */
export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Markdown-level scan: H2/H3 outline, per-section word and fenced-code-block
 * counts. Deliberately line-based — no MDX parse needed for the plate art.
 */
export function getPostStructure(content: string): PostStructure {
  const lines = content.split("\n");
  const majors: MajorSection[] = [];
  let introWords = 0;
  let totalWords = 0;
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      if (!inFence && majors.length > 0) {
        majors[majors.length - 1].codeBlocks += 1;
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      majors.push({ heading: h2[1].trim(), words: 0, codeBlocks: 0, minorHeadings: [] });
      continue;
    }
    if (h3 && majors.length > 0) {
      majors[majors.length - 1].minorHeadings.push(h3[1].trim());
      continue;
    }

    const words = countWords(line);
    totalWords += words;
    if (majors.length === 0) introWords += words;
    else majors[majors.length - 1].words += words;
  }

  return { introWords, totalWords, majors };
}

export function readingMinutesFor(content: string): number {
  return Math.max(1, Math.round(countWords(content) / WORDS_PER_MINUTE));
}

interface RawPost {
  meta: Omit<PostMeta, "plateNumber">;
  content: string;
}

function readRawPosts(): RawPost[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return filenames.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
    const { data, content } = matter(raw);
    return {
      meta: {
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        slug: data.slug as string,
        author: (data.author as string) || "Sirius",
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        readingMinutes: readingMinutesFor(content),
      },
      content,
    };
  });
}

/** Newest first. Plate numbers are chronological: oldest post is PLATE 01. */
export function getAllPosts(): PostMeta[] {
  const sorted = readRawPosts().sort(
    (a, b) => parseDate(b.meta.date).getTime() - parseDate(a.meta.date).getTime(),
  );
  const total = sorted.length;
  return sorted.map((p, i) => ({ ...p.meta, plateNumber: total - i }));
}

export function getPostBySlug(slug: string): Post | null {
  const all = getAllPosts();
  const meta = all.find((p) => p.slug === slug);
  if (!meta) return null;

  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const actualPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!actualPath) return null;

  const { content } = matter(fs.readFileSync(actualPath, "utf-8"));
  return { ...meta, content };
}
```

Note: `getPostBySlug` now resolves metadata through `getAllPosts()` so `plateNumber` is consistent everywhere; the file is still read once for content. Build-time cost is negligible at this scale.

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npx eslint lib/blog.ts`
Expected: tsc fails ONLY in `app/blog/page.tsx` / `app/blog/[slug]/page.tsx` if they reference removed shapes — they don't (they use `title/description/date/slug/author`, all still present). Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/blog.ts
git commit -m "feat(blog): structure parsing, reading time, plate numbers, tags in lib/blog"
```

---

### Task 2: `lib/constellation.ts` — the plate generator

**Files:**
- Create: `lib/constellation.ts`

- [ ] **Step 1: Create `lib/constellation.ts`**

```ts
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
  /** Fraction of total words at which each major section starts — drives ambient star placement. */
  sectionStarts: number[];
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

  // X: left→right, segment widths proportional to section length (min gap keeps labels apart).
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

  // Y: seeded within a band, re-rolled so consecutive stars never sit on a flat line.
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

  // Where each major section starts as a fraction of all words (intro included).
  const sectionStarts: number[] = [];
  let before = structure.introWords;
  const total = structure.totalWords || 1;
  for (const m of majors) {
    sectionStarts.push(Math.min(0.98, before / total));
    before += m.words;
  }

  return { stars, minors, satellites, dust, sectionStarts };
}
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npx eslint lib/constellation.ts`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/constellation.ts
git commit -m "feat(blog): deterministic constellation generator (PlateModel)"
```

---

### Task 3: Plate renderer — `plate-frame.tsx` + `plate.tsx` + plate CSS

**Files:**
- Create: `components/blog/plate-frame.tsx`
- Create: `components/blog/plate.tsx`
- Modify: `app/blog/blog.css` (append)

- [ ] **Step 1: Create `components/blog/plate-frame.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Astronomical-chart frame: gold hairline, engraved corner ticks. */
export function PlateFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("plate-frame", className)}>
      <span className="plate-corner plate-corner-tl" aria-hidden="true" />
      <span className="plate-corner plate-corner-tr" aria-hidden="true" />
      <span className="plate-corner plate-corner-bl" aria-hidden="true" />
      <span className="plate-corner plate-corner-br" aria-hidden="true" />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/blog/plate.tsx`**

```tsx
import type { PlateModel } from "@/lib/constellation";
import { cn } from "@/lib/utils";

const VIEW_W = 600;
const VIEW_H = 220;
// Normalized [0,1] radii/orbits are expressed in viewBox units via this scale.
const UNIT = 3;

/**
 * Renders a PlateModel as SVG.
 * - "card": index plates — constellation line draws on hover (CSS).
 * - "hero": essay header — unlit grey state, no line.
 */
export function Plate({
  model,
  variant,
  className,
}: {
  model: PlateModel;
  variant: "card" | "hero";
  className?: string;
}) {
  const px = (x: number) => x * VIEW_W;
  const py = (y: number) => y * VIEW_H;
  const points = model.stars.map((s) => `${px(s.x)},${py(s.y)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={cn("plate-art", variant === "hero" && "plate-art--unlit", className)}
      aria-hidden="true"
    >
      <g className="plate-dust">
        {model.dust.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r={d.r * UNIT} />
        ))}
      </g>

      {model.stars.length > 1 && (
        <polyline className="plate-path" points={points} pathLength={1} fill="none" />
      )}

      {model.minors.map((m, i) => (
        <circle key={i} className="plate-minor" cx={px(m.x)} cy={py(m.y)} r={m.r * UNIT} />
      ))}

      {model.stars.map((s, i) => (
        <g key={i}>
          <circle
            className="plate-star"
            cx={px(s.x)}
            cy={py(s.y)}
            r={s.r * UNIT}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
          <text
            className="plate-label"
            x={px(s.x) - 8}
            y={py(s.y) + (s.y > 0.5 ? -14 : 22)}
          >
            {s.greek} {s.label}
          </text>
        </g>
      ))}

      {model.satellites.map((s, i) => (
        <circle
          key={i}
          className="plate-satellite"
          cx={px(s.x) + s.orbitR * VIEW_W}
          cy={py(s.y)}
          r={1.4}
          style={{
            transformOrigin: `${px(s.x)}px ${py(s.y)}px`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 3: Append plate styles to `app/blog/blog.css`**

```css
/* ── Star Atlas plates ─────────────────────────────────────────────── */

.plate-frame {
  position: relative;
  border: 1px solid rgba(217, 185, 120, 0.28);
  border-radius: 6px;
  background: var(--color-surface-deep);
  transition: border-color 0.4s ease;
}

.plate-corner {
  position: absolute;
  width: 7px;
  height: 7px;
  border: 0 solid rgba(217, 185, 120, 0.8);
}
.plate-corner-tl { top: 5px; left: 5px; border-top-width: 1px; border-left-width: 1px; }
.plate-corner-tr { top: 5px; right: 5px; border-top-width: 1px; border-right-width: 1px; }
.plate-corner-bl { bottom: 5px; left: 5px; border-bottom-width: 1px; border-left-width: 1px; }
.plate-corner-br { bottom: 5px; right: 5px; border-bottom-width: 1px; border-right-width: 1px; }

.plate-art { display: block; width: 100%; }

.plate-dust circle { fill: rgba(232, 228, 220, 0.3); }

.plate-path {
  stroke: rgba(217, 185, 120, 0.55);
  stroke-width: 0.8;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.1s ease;
}

.plate-star {
  fill: #d9b978;
  animation: plate-twinkle 3.4s ease-in-out infinite;
}

.plate-minor { fill: rgba(217, 185, 120, 0.5); }

.plate-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  fill: rgba(154, 148, 138, 0.85);
}

.plate-satellite {
  fill: #6cd8ff;
  animation: plate-orbit linear infinite;
}

@keyframes plate-twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

@keyframes plate-orbit {
  to { transform: rotate(360deg); }
}

/* Card variant: line draws on hover; pre-drawn where hover doesn't exist. */
.plate-card:hover .plate-frame { border-color: rgba(217, 185, 120, 0.65); }
.plate-card:hover .plate-path { stroke-dashoffset: 0; }
@media (hover: none) {
  .plate-path { stroke-dashoffset: 0; }
}

/* Hero variant: unlit — grey stars, hidden line, dim labels. */
.plate-art--unlit .plate-star { fill: rgba(232, 228, 220, 0.3); animation: none; }
.plate-art--unlit .plate-minor { fill: rgba(232, 228, 220, 0.2); }
.plate-art--unlit .plate-path { stroke: rgba(232, 228, 220, 0.12); stroke-dashoffset: 0; transition: none; }
.plate-art--unlit .plate-label { fill: rgba(154, 148, 138, 0.45); }
.plate-art--unlit .plate-satellite { fill: rgba(108, 216, 255, 0.35); animation: none; }

/* Mono metadata line used across atlas surfaces. */
.plate-meta {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink-4);
}

/* Film grain — one overlay per page. */
.atlas-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .plate-star, .plate-satellite { animation: none; }
  .plate-path { stroke-dashoffset: 0; transition: none; }
}
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit && npx eslint components/blog/plate.tsx components/blog/plate-frame.tsx`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add components/blog/plate-frame.tsx components/blog/plate.tsx app/blog/blog.css
git commit -m "feat(blog): plate frame + SVG plate renderer (card/hero variants)"
```

---

### Task 4: Rebuild the Atlas index — `app/blog/page.tsx`

**Files:**
- Modify: `app/blog/page.tsx` (full rewrite)
- Modify: `app/blog/blog.css` (append index styles)

- [ ] **Step 1: Replace `app/blog/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { SectionDivider } from "@/components/ui/section-divider";
import { PlateFrame } from "@/components/blog/plate-frame";
import { Plate } from "@/components/blog/plate";
import { buildPlateModel } from "@/lib/constellation";
import { getAllPosts, getPostBySlug, getPostStructure, type PostMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Sirius",
  description:
    "The Sirius Star Atlas: AI explained for founders and operators. Real mental models, no hype.",
};

function plateDate(date: string): string {
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function plateNo(n: number): string {
  return `PLATE ${String(n).padStart(2, "0")}`;
}

function modelFor(post: PostMeta) {
  const full = getPostBySlug(post.slug);
  const structure = getPostStructure(full?.content ?? "");
  return buildPlateModel(structure, post.slug, post.readingMinutes);
}

function FeaturedPlate({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="plate-card block group outline-none">
      <PlateFrame className="p-6 md:p-8">
        <Plate model={modelFor(post)} variant="card" />
        <div className="mt-4">
          <p className="plate-meta">
            {plateNo(post.plateNumber)} · {plateDate(post.date)} · {post.readingMinutes} MIN
            {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
          </p>
          <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.05] text-[var(--color-ink-1)] mt-3 group-hover:text-[var(--color-accent)] transition-colors duration-300">
            {post.title}
          </h2>
          <p className="text-[0.95rem] leading-relaxed text-[var(--color-ink-3)] mt-3 max-w-[560px]">
            {post.description}
          </p>
        </div>
      </PlateFrame>
    </Link>
  );
}

function SmallPlate({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="plate-card block group outline-none">
      <PlateFrame className="p-5 h-full">
        <Plate model={modelFor(post)} variant="card" className="plate-art--small" />
        <p className="plate-meta mt-3">
          {plateNo(post.plateNumber)} · {plateDate(post.date)} · {post.readingMinutes} MIN
        </p>
        <h2 className="font-display text-[1.25rem] leading-[1.12] text-[var(--color-ink-1)] mt-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
          {post.title}
        </h2>
      </PlateFrame>
    </Link>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <div className="atlas-grain" aria-hidden="true" />
      <SiteHeader />

      <section className="section">
        <Container>
          <div className="section-head is-center">
            <p className="plate-meta" style={{ color: "#6cd8ff" }}>
              SIRIUS — STAR ATLAS
            </p>
            <h1 className="section-title" style={{ marginTop: "14px" }}>
              Charts for the territory <span className="accent-italic">ahead</span>
            </h1>
            <p className="section-lead">
              AI explained for founders and operators. Every essay is a plate —
              its constellation drawn from the ideas inside.
            </p>
          </div>
        </Container>
      </section>

      <section className="section" style={{ paddingBlockStart: "clamp(20px, 3vh, 40px)" }}>
        <Container>
          {posts.length === 0 ? (
            <p className="text-[var(--color-ink-3)] text-center py-16">
              No plates charted yet. Check back soon.
            </p>
          ) : (
            <div className="max-w-[860px] mx-auto flex flex-col gap-6">
              {featured && <FeaturedPlate post={featured} />}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {rest.map((post) => (
                    <SmallPlate key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <SectionDivider />

      <footer className="footer">
        <div className="footer-base">
          <span>Sirius</span>
          <span className="text-[var(--color-ink-4)]">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Append index-specific styles to `app/blog/blog.css`**

```css
/* Smaller plates crop the art shorter so the grid stays compact. */
.plate-art--small { max-height: 120px; }
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint app/blog/page.tsx && npm run build 2>&1 | tail -14`
Expected: build passes; route list includes `○ /blog`.

- [ ] **Step 4: Visual check**

Run: `(PORT=3457 npx next dev > /tmp/atlas-dev.log 2>&1 &) ; sleep 5; curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3457/blog`
Expected: `200`. Then open http://localhost:3457/blog and confirm: featured plate with constellation + labels, hover draws the line, frame warms. Kill the dev server after.

- [ ] **Step 5: Commit**

```bash
git add app/blog/page.tsx app/blog/blog.css
git commit -m "feat(blog): rebuild index as the Star Atlas (featured + grid plates)"
```

---

### Task 5: Ambient charting — `charted-sky.tsx` + `charted-finale.tsx`

**Files:**
- Create: `components/blog/charted-sky.tsx`
- Create: `components/blog/charted-finale.tsx`
- Modify: `app/blog/blog.css` (append)

- [ ] **Step 1: Create `components/blog/charted-sky.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SkyStar {
  /** Normalized x from the PlateModel — used to seed a margin-band position. */
  x: number;
  /** Vertical fraction of the article where this section starts. */
  start: number;
}

/**
 * The post's constellation laid into the page background across the full
 * article height. Stars ignite and the line extends as the reader passes
 * each H2 (observed by heading id). Decorative only: aria-hidden, no pointer.
 */
export function ChartedSky({
  stars,
  headingIds,
}: {
  stars: SkyStar[];
  headingIds: string[];
}) {
  const [lit, setLit] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduced.current = true;
      setLit(stars.length);
      return;
    }
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = headings.indexOf(entry.target as HTMLElement);
          if (idx >= 0) setLit((prev) => Math.max(prev, idx + 1));
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [headingIds, stars.length]);

  if (stars.length === 0) return null;

  // Alternate stars between left/right margin bands so they sit beside the
  // prose column, not under it; the model's x seeds position within the band.
  const placed = stars.map((s, i) => {
    const band = i % 2 === 0 ? { lo: 4, w: 18 } : { lo: 78, w: 18 };
    return {
      x: band.lo + s.x * band.w,
      y: 6 + s.start * 86,
    };
  });
  const points = placed.map((p) => `${p.x},${p.y}`).join(" ");
  const progress = lit <= 1 || placed.length < 2 ? 0 : (lit - 1) / (placed.length - 1);

  return (
    <svg
      className="charted-sky"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {placed.length > 1 && (
        <polyline
          className="charted-sky-path"
          points={points}
          pathLength={1}
          fill="none"
          style={{ strokeDashoffset: 1 - progress }}
        />
      )}
      {placed.map((p, i) => (
        <circle
          key={i}
          className={i < lit ? "charted-sky-star is-lit" : "charted-sky-star"}
          cx={p.x}
          cy={p.y}
          r={0.45}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Create `components/blog/charted-finale.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

/** The whispered end-of-essay line — fades in when scrolled into view. */
export function ChartedFinale({ minutes }: { minutes: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
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
      ★ CONSTELLATION CHARTED · {minutes} MIN WELL SPENT
    </p>
  );
}
```

- [ ] **Step 3: Append ambient styles to `app/blog/blog.css`**

```css
/* ── Ambient sky charting (essay background) ───────────────────────── */

.charted-sky {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.charted-sky-path {
  stroke: rgba(217, 185, 120, 0.45);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  transition: stroke-dashoffset 0.8s ease;
}

.charted-sky-star {
  fill: rgba(232, 228, 220, 0.25);
  transition: fill 0.6s ease;
}

.charted-sky-star.is-lit {
  fill: #d9b978;
  animation: plate-twinkle 3.4s ease-in-out infinite;
}

/* On narrow screens the margins vanish — sink the sky further back. */
@media (max-width: 900px) {
  .charted-sky { opacity: 0.45; }
}

.charted-finale {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-align: center;
  color: var(--color-accent);
  opacity: 0;
  transition: opacity 1.2s ease;
  margin: 0 0 24px;
}

.charted-finale.is-shown { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .charted-sky-path { transition: none; }
  .charted-sky-star { transition: none; animation: none; }
  .charted-finale { transition: none; }
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint components/blog/charted-sky.tsx components/blog/charted-finale.tsx`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add components/blog/charted-sky.tsx components/blog/charted-finale.tsx app/blog/blog.css
git commit -m "feat(blog): ambient sky charting + finale components"
```

---

### Task 6: Rebuild the essay page — `app/blog/[slug]/page.tsx`

**Files:**
- Modify: `app/blog/[slug]/page.tsx` (full rewrite)
- Modify: `app/blog/blog.css` (append)

- [ ] **Step 1: Replace `app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { DownloadButton } from "@/components/ui/download-button";
import { PlateFrame } from "@/components/blog/plate-frame";
import { Plate } from "@/components/blog/plate";
import { ChartedSky } from "@/components/blog/charted-sky";
import { ChartedFinale } from "@/components/blog/charted-finale";
import { buildPlateModel, GREEK } from "@/lib/constellation";
import { getAllPosts, getPostBySlug, getPostStructure, slugifyHeading } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Sirius Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function textOf(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.filter((c): c is string => typeof c === "string").join("");
  }
  return "";
}

/** H2s get an id (for the ambient sky observer) and their star's Greek letter. */
function mdxComponents(majorHeadings: string[]) {
  return {
    h2: ({ children }: { children?: ReactNode }) => {
      const text = textOf(children);
      const idx = majorHeadings.indexOf(text);
      return (
        <h2 id={text ? slugifyHeading(text) : undefined}>
          {idx >= 0 && (
            <span className="plate-greek" aria-hidden="true">
              {GREEK[Math.min(idx, GREEK.length - 1)]}
            </span>
          )}
          {children}
        </h2>
      );
    },
  };
}

function plateDate(date: string): string {
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const structure = getPostStructure(post.content);
  const model = buildPlateModel(structure, post.slug, post.readingMinutes);
  const majorHeadings = structure.majors.map((m) => m.heading);
  const headingIds = majorHeadings.map(slugifyHeading);

  const { default: MDXContent } = await evaluate(post.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  });

  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const next = all.length > 1 ? (all[i + 1] ?? all[0]) : null;
  const plateNo = `PLATE ${String(post.plateNumber).padStart(2, "0")}`;

  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <div className="atlas-grain" aria-hidden="true" />
      <SiteHeader />

      <article className="section" style={{ paddingBlockStart: "clamp(110px, 14vh, 160px)" }}>
        <Container>
          <div className="max-w-[820px] mx-auto">
            <p className="plate-meta">
              <Link href="/blog" className="hover:text-[var(--color-ink-1)] transition-colors">
                ← ALL PLATES
              </Link>
              {"  ·  "}
              {plateNo} · {plateDate(post.date)} · {post.readingMinutes} MIN
              {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
            </p>

            <PlateFrame className="mt-5 p-6 md:p-8">
              <Plate model={model} variant="hero" />
              <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-1)] mt-5">
                {post.title}
              </h1>
              <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-3)] mt-3 max-w-[600px]">
                {post.description}
              </p>
              <p className="plate-meta mt-4" style={{ fontSize: "0.62rem" }}>
                UNCHARTED · SCROLL TO BEGIN
              </p>
            </PlateFrame>
          </div>
        </Container>
      </article>

      <section
        className="section relative"
        style={{ paddingBlockStart: "clamp(28px, 4vh, 56px)", paddingBlockEnd: "clamp(60px, 10vh, 120px)" }}
      >
        <ChartedSky
          stars={model.stars.map((s, idx) => ({ x: s.x, start: model.sectionStarts[idx] }))}
          headingIds={headingIds}
        />
        <Container className="relative">
          <div className="prose-custom max-w-[680px] mx-auto">
            <MDXContent components={mdxComponents(majorHeadings)} />
          </div>

          <div className="max-w-[680px] mx-auto mt-16">
            <ChartedFinale minutes={post.readingMinutes} />

            <div className="atlas-cta">
              <div>
                <p className="font-display text-[1.3rem] leading-snug text-[var(--color-ink-1)] m-0">
                  Reading about AI is the slow way.{" "}
                  <span className="accent-italic">Having one is faster.</span>
                </p>
                <p className="text-[0.88rem] text-[var(--color-ink-3)] mt-2 mb-0">
                  Sirius does your briefings, outreach, and research — done before you&rsquo;re in.
                </p>
              </div>
              <DownloadButton className="shrink-0" />
            </div>

            {next && (
              <Link href={`/blog/${next.slug}`} className="atlas-next group">
                <span className="plate-meta">NEXT PLATE →</span>
                <span className="font-display text-[1.05rem] text-[var(--color-ink-1)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </section>

      <footer className="footer">
        <div className="footer-base">
          <span>Sirius</span>
          <span className="text-[var(--color-ink-4)]">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Append essay-page styles to `app/blog/blog.css`**

```css
/* ── Essay page ────────────────────────────────────────────────────── */

.plate-greek {
  font-family: var(--font-mono);
  font-size: 0.62em;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin-right: 0.7em;
  vertical-align: 0.15em;
}

.atlas-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(217, 185, 120, 0.4);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(217, 185, 120, 0.08), rgba(217, 185, 120, 0.02));
  padding: 22px 24px;
}

@media (max-width: 640px) {
  .atlas-cta { flex-direction: column; align-items: flex-start; }
}

.atlas-next {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
  text-decoration: none;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npx eslint app/blog/[slug]/page.tsx && npm run build 2>&1 | tail -14`
Expected: build passes; `● /blog/[slug]` prerenders with `what-ai-actually-is`.

- [ ] **Step 4: Visual check**

Run dev server on :3457, open `/blog/what-ai-actually-is`. Confirm: unlit hero plate; Greek prefixes on H2s; margin stars ignite while scrolling (line follows); finale fades in; CTA opens the download modal; NEXT PLATE row absent (only one post) — then kill the server.

- [ ] **Step 5: Commit**

```bash
git add "app/blog/[slug]/page.tsx" app/blog/blog.css
git commit -m "feat(blog): rebuild essay page — unlit hero plate, ambient charting, soft-sell CTA"
```

---

### Task 7: Header integration — Blog into `HeaderNav`

**Files:**
- Modify: `components/layout/header-nav.tsx`
- Modify: `components/layout/site-header.tsx:42-50`
- Modify: `content/landing.ts:13-17`

- [ ] **Step 1: Support route links in `components/layout/header-nav.tsx`** (replace file)

```tsx
"use client";

import Link from "next/link";

type NavItem = { id?: string; href?: string; label: string };

const linkClass =
  "text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-3)] transition hover:text-[var(--color-ink-1)]";

export function HeaderNav({ items }: { items: readonly NavItem[] }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return; // let the default hash jump handle it
    e.preventDefault();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="hidden items-center gap-6 sm:flex">
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        ) : (
          <a
            key={item.label}
            href={`#${item.id}`}
            onClick={(e) => onClick(e, item.id!)}
            className={linkClass}
          >
            {item.label}
          </a>
        ),
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Add Blog to the nav array in `content/landing.ts`**

Replace lines 13–17:

```ts
  nav: [
    { id: "what-it-does", label: "What it does" },
    { id: "learns-once", label: "How it works" },
    { id: "pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ],
```

Note: scroll-id links only resolve on `/` — on blog pages the `onClick` guard (`if (!el) return`) falls through to a hash jump to `/#...`? No: the `href` is `#id`, which on `/blog` does nothing visible. This matches current behavior (the existing nav already renders on blog pages today) — not a regression, leave as is.

- [ ] **Step 3: Remove the hardcoded Blog link from `components/layout/site-header.tsx`**

Replace lines 42–50 (the `div` wrapping `HeaderNav` + the hardcoded `Link`):

```tsx
        <HeaderNav items={nav} />
```

(Keep the surrounding header structure; only the wrapper `div.flex.items-center.gap-6` and the `<Link href="/blog">` block collapse into the bare `<HeaderNav ...>` since the nav now owns the Blog item.)

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint components/layout/header-nav.tsx components/layout/site-header.tsx content/landing.ts`
Expected: clean. (`item.id!` is safe: items without `href` always have `id` in our data; if eslint complains about non-null assertion, change the guard to `onClick={(e) => item.id && onClick(e, item.id)}`.)

- [ ] **Step 5: Commit**

```bash
git add components/layout/header-nav.tsx components/layout/site-header.tsx content/landing.ts
git commit -m "feat(nav): Blog as a first-class nav item (route links in HeaderNav)"
```

---

### Task 8: Tag the sample post + full verification pass

**Files:**
- Modify: `content/posts/what-ai-actually-is.mdx:1-7` (frontmatter only)

- [ ] **Step 1: Add tags to the sample post frontmatter**

```yaml
---
title: "What AI Actually Is (No, It's Not Magic)"
description: "A plain-English breakdown of how large language models work under the hood — embeddings, attention, and why your ChatGPT isn't thinking."
date: "2026-06-10"
slug: "what-ai-actually-is"
author: "Sirius"
tags: ["fundamentals"]
---
```

- [ ] **Step 2: Full verification per CLAUDE.md**

Run: `npx tsc --noEmit && npx eslint app/blog lib/blog.ts lib/constellation.ts components/blog && npm run build 2>&1 | tail -14`
Expected: clean; routes `○ /`, `○ /demo`, `○ /blog`, `● /blog/[slug]` all prerender.

- [ ] **Step 3: Determinism check**

Run:

```bash
npm run build > /dev/null 2>&1 && shasum .next/server/app/blog/what-ai-actually-is.html
npm run build > /dev/null 2>&1 && shasum .next/server/app/blog/what-ai-actually-is.html
```

Expected: identical hashes from both builds (constellations are deterministic).

- [ ] **Step 4: Final visual pass**

Dev server on :3457: check `/blog` and `/blog/what-ai-actually-is` at desktop + ~390px width, plus once with "Reduce motion" enabled in macOS settings (constellations render fully lit/static). Kill the server.

- [ ] **Step 5: Commit**

```bash
git add content/posts/what-ai-actually-is.mdx
git commit -m "chore(blog): tag sample post; Star Atlas verification pass"
```
