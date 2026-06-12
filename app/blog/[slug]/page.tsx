import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
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

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
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
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .replace(",", "")
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

      {/* Full-bleed hero banner — escapes the content column on purpose. */}
      <article className="section px-6 md:px-12" style={{ paddingBlockStart: "clamp(20px, 3vh, 36px)" }}>
        <p className="plate-meta">
          <Link href="/blog" className="hover:text-[var(--color-ink-1)] transition-colors">
            ← ALL PLATES
          </Link>
          {"  ·  "}
          {plateNo} · {plateDate(post.date)} · {post.readingMinutes} MIN
          {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
        </p>

        <PlateFrame className="mt-5 p-5 md:p-7">
          <Plate model={model} variant="hero" />
          <h1 className="font-display text-[clamp(1.5rem,3.2vw,2.1rem)] leading-[1.05] text-[var(--color-ink-1)] mt-4">
            {post.title}
          </h1>
          <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-3)] mt-3 max-w-[600px]">
            {post.description}
          </p>
          <p className="plate-meta mt-4" style={{ fontSize: "0.62rem" }}>
            UNCHARTED · SCROLL TO BEGIN
          </p>
        </PlateFrame>
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
