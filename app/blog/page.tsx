import type { Metadata } from "next";
import Link from "next/link";
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { Surface } from "@/components/ui/surface";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionDivider } from "@/components/ui/section-divider";
import { getAllPosts, type PostMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Sirius",
  description:
    "What AI actually is, how to build with it, and where it's going. For founders and technical people who want the real thing, not the hype.",
};

function PostCard({ post }: { post: PostMeta }) {
  const d = new Date(post.date);
  const formatted = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block group outline-none">
      <Surface
        level={1}
        interactive
        className="p-6 md:p-8 flex flex-col gap-4"
      >
        <SectionLabel tone="cyan">{formatted}</SectionLabel>
        <h2 className="font-display text-[clamp(1.15rem,2vw,1.5rem)] leading-tight text-[var(--color-ink-1)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-[0.92rem] leading-relaxed text-[var(--color-ink-3)]">
          {post.description}
        </p>
        <p className="text-[0.82rem] text-[var(--color-ink-4)] mt-1">
          {post.author}
        </p>
      </Surface>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <SiteHeader />

      <section className="section">
        <Container>
          <div className="section-head is-center">
            <SectionLabel tone="cyan" index="01">
              Writing
            </SectionLabel>
            <h1 className="section-title">
              What we&rsquo;re{" "}
              <span className="accent-italic">thinking about</span>
            </h1>
            <p className="section-lead">
              AI, explained. For founders and technical people who want the real
              thing — not the hype, not the fluff, not another &ldquo;prompt
              engineering checklist.&rdquo;
            </p>
          </div>
        </Container>
      </section>

      <section className="section" style={{ paddingBlockStart: "clamp(20px, 3vh, 40px)" }}>
        <Container>
          {posts.length === 0 ? (
            <p className="text-[var(--color-ink-3)] text-center py-16">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 max-w-[720px] mx-auto">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <SectionDivider />

      <footer className="footer">
        <Container className="footer-base" container={false}>
          {/* Footer base line — matches site convention */}
          <span>Sirius</span>
          <span className="text-[var(--color-ink-4)]">
            &copy; {new Date().getFullYear()}
          </span>
        </Container>
      </footer>
    </main>
  );
}
