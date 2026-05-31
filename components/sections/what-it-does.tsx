import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { landingContent } from "@/content/landing";

export function WhatItDoesSection() {
  const { eyebrow, title, cards } = landingContent.whatItDoes;
  return (
    <section id="what-it-does" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionLabel tone="warm">{eyebrow}</SectionLabel>
          <h2 className="font-display mt-7 max-w-[20ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
            {title}
          </h2>
        </Reveal>
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <RevealItem key={c.id} className="h-full">
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition-colors duration-200 hover:border-[var(--color-border-strong)]">
                <h3 className="font-display text-[18px] font-normal leading-tight text-[var(--color-ink-1)]">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.6] text-[var(--color-ink-2)]">{c.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
