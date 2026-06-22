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

/** Anchor ids for H2 headings (also used to match section marks). */
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

// Build-time singleton cache: getAllPosts/getPostBySlug are called repeatedly
// (once per plate on the index), and posts can't change mid-build.
let rawPostsCache: RawPost[] | null = null;

function readRawPosts(): RawPost[] {
  // Cache only in production builds — in `next dev`, posts must re-read from
  // disk so new/edited MDX files appear without a server restart.
  if (rawPostsCache && process.env.NODE_ENV === "production") return rawPostsCache;
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  rawPostsCache = filenames.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
    const { data, content } = matter(raw);
    return {
      meta: {
        title: data.title as string,
        description: data.description as string,
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date as string),
        slug: data.slug as string,
        author: (data.author as string) || "Sirius",
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        readingMinutes: readingMinutesFor(content),
      },
      content,
    };
  });
  return rawPostsCache;
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
