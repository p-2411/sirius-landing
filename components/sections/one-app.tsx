import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Orb } from "@/components/sirius/orb";
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

        {/* The collapse is the section: five tools → one Sirius. */}
        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_auto_0.9fr] lg:gap-12">
          <RevealGroup className="flex flex-col gap-2.5" stagger={0.08}>
            {replaces.map((t) => (
              <RevealItem key={t}>
                <span className="block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-deep)] px-4 py-3 text-[15px] text-[var(--color-ink-3)] line-through decoration-[var(--color-ink-4)] decoration-1">
                  {t}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15} className="flex items-center justify-center text-[var(--color-accent)]">
            <span className="hidden text-[30px] leading-none lg:block" aria-hidden>→</span>
            <span className="py-2 text-[30px] leading-none lg:hidden" aria-hidden>↓</span>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-[rgba(240,179,90,0.4)] bg-[var(--color-surface-1)] p-8 text-center shadow-[0_24px_60px_-30px_rgba(240,179,90,0.5)]">
              <Orb className="!h-16 !w-16" />
              <span className="font-display text-[30px] leading-none text-[var(--color-ink-1)]">{becomes}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
                one app · one subscription
              </span>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
