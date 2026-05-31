import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { landingContent } from "@/content/landing";

export function PricingSection() {
  const { eyebrow, betaBadge, price, priceSuffix, note, cta } = landingContent.pricing;
  const { downloadCta } = landingContent;
  return (
    <section id="pricing" className="scroll-mt-24 py-24 md:py-32">
      <Container className="flex flex-col items-center text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {eyebrow}
        </span>
        <div className="mt-7 w-full max-w-[440px] rounded-[var(--radius-lg)] border border-[rgba(240,179,90,0.35)] bg-[var(--color-surface-1)] p-8">
          <span className="inline-block rounded-full border border-[rgba(108,216,255,0.4)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-state-listening-strong)]">
            {betaBadge}
          </span>
          <div className="mt-6 font-display text-[44px] font-normal leading-none text-[var(--color-ink-1)]">
            {price}
            <span className="text-[16px] text-[var(--color-ink-3)]">{priceSuffix}</span>
          </div>
          <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-[1.55] text-[var(--color-ink-2)]">
            {note}
          </p>
          <div className="mt-7 flex justify-center">
            <ButtonLink href={downloadCta.href} variant="primary">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
