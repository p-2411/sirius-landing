import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionDivider } from "@/components/ui/section-divider";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { default: MDXContent } = await evaluate(post.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  });

  const d = new Date(post.date);
  const formatted = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <SiteHeader />

      <article className="section" style={{ paddingBlockStart: "clamp(120px, 16vh, 180px)" }}>
        <Container>
          <div className="max-w-[720px] mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[0.875rem] text-[var(--color-ink-3)] hover:text-[var(--color-ink-1)] transition-colors duration-200 mb-10"
            >
              <span aria-hidden="true">&larr;</span> All posts
            </Link>

            <SectionLabel tone="cyan">{formatted}</SectionLabel>

            <h1 className="section-title" style={{ marginTop: "12px" }}>
              {post.title}
            </h1>

            <p className="section-lead" style={{ maxWidth: "100%" }}>
              {post.description}
            </p>

            <p className="text-[0.875rem] text-[var(--color-ink-4)] mt-5">
              By {post.author}
            </p>
          </div>
        </Container>
      </article>

      <section className="section" style={{ paddingBlockStart: "clamp(20px, 3vh, 40px)", paddingBlockEnd: "clamp(60px, 10vh, 120px)" }}>
        <Container>
          <Surface level={1} className="max-w-[720px] mx-auto p-8 md:p-12">
            <div className="prose-custom">
              <MDXContent />
            </div>
          </Surface>
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
