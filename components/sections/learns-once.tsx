import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function LearnsOnceSection() {
  const { eyebrow, title, body, before, after } = landingContent.learnsOnce;
  return (
    <section id="learns-once" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionLabel tone="warm">{eyebrow}</SectionLabel>
            <h2 className="font-display mt-7 max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
              {body}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-full rounded-[var(--radius-md)] border border-[rgba(108,216,255,0.4)] bg-[var(--color-surface-1)] p-4 text-[13px] text-[var(--color-ink-1)]">
              {before}
            </div>
            <span className="text-[var(--color-accent)]" aria-hidden>↓ saved</span>
            <div className="w-full rounded-[var(--radius-md)] border border-[rgba(167,219,178,0.4)] bg-[var(--color-surface-1)] p-4 text-[13px] text-[var(--color-ink-1)]">
              {after}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
