import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function OneAppSection() {
  const { eyebrow, title, body, replaces, becomes } = landingContent.oneApp;
  return (
    <section id="one-app" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionLabel tone="warm">{eyebrow}</SectionLabel>
        <h2 className="font-display mt-7 max-w-[22ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
          {title}
        </h2>
        <p className="mt-7 max-w-[56ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
          {body}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {replaces.map((t) => (
            <span
              key={t}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-[13px] text-[var(--color-ink-3)] line-through decoration-[var(--color-ink-4)]"
            >
              {t}
            </span>
          ))}
          <span className="text-[var(--color-accent)] text-[18px]" aria-hidden>→</span>
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3.5 py-2 text-[13px] font-semibold text-[#1b1712]">
            {becomes}
          </span>
        </div>
      </Container>
    </section>
  );
}
