import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { DownloadButton } from "@/components/ui/download-button";
import { ChartedFinale } from "@/components/blog/charted-finale";
import { GREEK, starLabel } from "@/lib/constellation";
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

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

/** H2s get an anchor id and their centered Greek catalog mark. */
function mdxComponents(majorHeadings: string[]) {
  return {
    h2: ({ children }: { children?: ReactNode }) => {
      const text = textOf(children);
      const idx = majorHeadings.indexOf(text);
      return (
        <h2 id={text ? slugifyHeading(text) : undefined}>
          {idx >= 0 && (
            <span className="prose-section-mark" aria-hidden="true">
              {GREEK[Math.min(idx, GREEK.length - 1)]} · {starLabel(text)}
            </span>
          )}
          {children}
        </h2>
      );
    },
  };
}

function plateNo(n: number): string {
  return `PLATE ${String(n).padStart(2, "0")}`;
}

function plateDate(date: string): string {
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .replace(",", "")
    .toUpperCase();
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const structure = getPostStructure(post.content);
  const majorHeadings = structure.majors.map((m) => m.heading);

  const { default: MDXContent } = await evaluate(post.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  });

  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const next = all.length > 1 ? (all[i + 1] ?? all[0]) : null;

  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <AmbientLayers quiet />
      <SiteHeader />

      {/* The Title Page — pure typography, centered axis (Quiet Folio spec §1). */}
      <header
        className="section"
        style={{ paddingBlock: "clamp(36px, 7vh, 72px) 0" }}
      >
        <Container>
          <div className="mx-auto max-w-[640px] text-center">
            <p className="plate-meta">
              <Link href="/blog" className="hover:text-[var(--color-ink-1)] transition-colors">
                ← ALL PLATES
              </Link>
              {" · "}
              {plateNo(post.plateNumber)} · {plateDate(post.date)} · {post.readingMinutes} MIN
              {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
            </p>
            <h1 className="font-display font-[340] text-[clamp(2.2rem,4.5vw,2.9rem)] leading-[1.06] tracking-[-0.015em] text-[var(--color-ink-1)] mx-auto mt-5 max-w-[560px]">
              {post.title}
            </h1>
            <p className="font-display italic font-[340] text-[1.125rem] leading-[1.55] text-[var(--color-ink-3)] mx-auto mt-4 max-w-[470px]">
              {post.description}
            </p>
            <div className="folio-divider" aria-hidden="true">
              ✦ ✦ ✦
            </div>
          </div>
        </Container>
      </header>

      <section
        className="section relative"
        style={{ paddingBlockStart: "clamp(12px, 2vh, 24px)", paddingBlockEnd: "clamp(60px, 10vh, 120px)" }}
      >
        <Container className="relative">
          <div className="prose-custom max-w-[600px] mx-auto">
            <MDXContent components={mdxComponents(majorHeadings)} />
          </div>

          <div className="max-w-[600px] mx-auto mt-16">
            <ChartedFinale plateNumber={post.plateNumber} minutes={post.readingMinutes} />

            <div className="atlas-cta">
              <p className="font-display text-[1.3rem] leading-snug text-[var(--color-ink-1)] m-0">
                Reading about AI is the slow way.{" "}
                <span className="accent-italic">Having one is faster.</span>
              </p>
              <p className="text-[0.88rem] text-[var(--color-ink-3)] m-0">
                Sirius does your briefings, outreach, and research — done before you&rsquo;re in.
              </p>
              <DownloadButton className="mt-2" />
            </div>

            {next && (
              <Link href={`/blog/${next.slug}`} className="atlas-next group focus-ring">
                <span className="plate-meta">NEXT PLATE →</span>
                <span className="font-display text-[1.05rem] text-[var(--color-ink-1)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </section>

      <footer className="footer" style={{ borderTop: "none", paddingTop: "0px", paddingBottom: "28px" }}>
        <div className="footer-base" style={{ marginTop: 0 }}>
          <span>Sirius</span>
          <span className="text-[var(--color-ink-4)]">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
