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
    <Link href={`/blog/${post.slug}`} className="plate-card block group outline-none focus-ring">
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
    <Link href={`/blog/${post.slug}`} className="plate-card block group outline-none focus-ring">
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
