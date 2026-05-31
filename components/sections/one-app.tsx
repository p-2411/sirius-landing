import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { landingContent } from "@/content/landing";

export function OneAppSection() {
  const { eyebrow, title, replaces, becomes } = landingContent.oneApp;
  return (
    <section id="one-app" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionLabel tone="warm">{eyebrow}</SectionLabel>
          <h2 className="font-display mt-7 max-w-[22ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
            {title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 flex flex-wrap items-center gap-3" stagger={0.07}>
          {replaces.map((t) => (
            <RevealItem key={t}>
              <span className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-[13px] text-[var(--color-ink-3)] line-through decoration-[var(--color-ink-4)]">
                {t}
              </span>
            </RevealItem>
          ))}
          <RevealItem>
            <span className="text-[18px] text-[var(--color-accent)]" aria-hidden>→</span>
          </RevealItem>
          <RevealItem>
            <span className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3.5 py-2 text-[13px] font-semibold text-[#1b1712]">
              {becomes}
            </span>
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
