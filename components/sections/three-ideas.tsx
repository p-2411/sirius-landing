import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Orb } from "@/components/sirius/orb";

const NODE_DEFS = [
  { index: "01", accent: "Memory",    color: "var(--color-accent)" },
  { index: "02", accent: "Actions",   color: "var(--color-success)" },
  { index: "03", accent: "Workflows", color: "var(--color-state-listening-strong)" },
] as const;

export function ThreeIdeasSection() {
  const { sectionLabel, items, body } = landingContent.threeIdeas;

  return (
    <section
      id="three-ideas"
      className="relative scroll-mt-24 py-24 md:py-32"
    >
      <Container>
        <SectionLabel index="04" tone="warm">{sectionLabel}</SectionLabel>

        <h2 className="font-display text-balance mt-7 max-w-[24ch] text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.92] tracking-[-0.028em] text-[var(--color-ink-1)] font-normal">
          One assistant that{" "}
          <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
            remembers, acts, and automates.
          </em>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-8">
          <div className="relative flex h-full w-full items-center justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[190%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 34%, transparent 72%)",
              }}
            />
            <Orb
              tripartite
              interactive={false}
              className="pointer-events-none relative h-[clamp(240px,30vw,400px)] w-[clamp(240px,30vw,400px)]"
            />
          </div>

          <div>
            <ul className="divide-y divide-[var(--color-border)]">
              {items.map((item, i) => {
                const node = NODE_DEFS[i];
                const accent = node?.accent ?? "";
                const splitAt = accent ? item.role.indexOf(accent) : -1;
                const head = splitAt >= 0 ? item.role.slice(0, splitAt) : item.role;
                const tail = splitAt >= 0 ? item.role.slice(splitAt + accent.length) : "";
                return (
                  <li
                    key={item.index}
                    className="py-5 text-[clamp(1.1rem,1.6vw,1.3rem)] leading-[1.45] text-[var(--color-ink-1)]"
                  >
                    {head}
                    <span
                      className="font-display-italic"
                      style={{ color: node?.color ?? "var(--color-accent)" }}
                    >
                      {accent}
                    </span>
                    {tail}
                  </li>
                );
              })}
            </ul>

            <p className="mt-8 max-w-[54ch] text-[15.5px] leading-[1.72] text-[var(--color-ink-2)]">
              {body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
