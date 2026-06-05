import { Container } from "@/components/ui/container";
import { DownloadButton } from "@/components/ui/download-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AppIcon } from "@/components/sirius/appui";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

export function PricingSection() {
  const { eyebrow, title, note, tiers } = landingContent.pricing;
  return (
    <section id="pricing" className="scroll-mt-24 py-24 md:py-32">
      <Container className="flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <SectionLabel tone="warm">{eyebrow}</SectionLabel>
          <h2 className="font-display mt-7 max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
            {title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid w-full max-w-[980px] items-stretch gap-4 sm:grid-cols-3" stagger={0.1}>
          {tiers.map((t) => (
            <RevealItem key={t.name} className="h-full">
              <div
                className="flex h-full flex-col rounded-[var(--radius-lg)] border bg-[var(--color-surface-1)] p-7 text-left"
                style={{
                  borderColor: t.featured ? "rgba(240,179,90,0.45)" : "var(--color-border)",
                  boxShadow: t.featured ? "0 24px 60px -34px rgba(240,179,90,0.5)" : "none",
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
                  {t.name}
                </span>
                <div className="mt-4 flex items-baseline gap-2 font-display leading-none text-[var(--color-ink-1)]">
                  {t.was && <span className="text-[22px] font-normal text-[var(--color-ink-4)] line-through">{t.was}</span>}
                  <span className="text-[44px] font-normal">{t.price}</span>
                  {t.priceSuffix && <span className="text-[16px] text-[var(--color-ink-3)]">{t.priceSuffix}</span>}
                </div>
                {t.was && (
                  <span className="mt-1.5 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    Launch price
                  </span>
                )}
                <p className="mt-3 text-[14px] leading-[1.5] text-[var(--color-ink-2)]">{t.tagline}</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-[1.45] text-[var(--color-ink-2)]">
                      <span className="mt-0.5 shrink-0 text-[var(--color-success)]">
                        <AppIcon name="check" size={14} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-10 flex flex-col items-center">
          <DownloadButton />
          <p className="mt-6 max-w-[40ch] text-[13px] leading-[1.55] text-[var(--color-ink-3)]">{note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
