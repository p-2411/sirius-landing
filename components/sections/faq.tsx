import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";

export function FaqSection() {
  const { sectionLabel, items } = landingContent.faq;

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 bg-[var(--color-surface-deep)] py-20 md:py-24"
      style={{
        borderTop: "1px solid var(--color-border-strong)",
        borderBottom: "1px solid var(--color-border-strong)",
      }}
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16 lg:gap-24">
          <div className="md:sticky md:top-24 md:self-start">
            <SectionLabel tone="warm">{sectionLabel}</SectionLabel>
            <h2
              className="font-display mt-5 max-w-[18ch] text-[clamp(1.7rem,2.6vw,2.3rem)] font-normal leading-[1.1] text-[var(--color-ink-1)]"
              style={{ letterSpacing: "-0.005em" }}
            >
              {sectionLabel.toLowerCase() === "questions" ? "What people ask first." : sectionLabel}
            </h2>
          </div>

          <ol className="flex flex-col">
            {items.map((item, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <li key={item.q}>
                  <details
                    className="group border-t border-[var(--color-border)] open:border-[var(--color-border-strong)] last:border-b"
                  >
                    <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-baseline gap-4 py-5 [&::-webkit-details-marker]:hidden">
                      <span
                        className="text-[10.5px] font-medium uppercase tracking-[0.22em] tabular-nums"
                        style={{ color: "var(--color-accent)" }}
                      >
                        Q{num}
                      </span>
                      <span className="text-[15.5px] font-medium leading-[1.45] text-[var(--color-ink-1)]">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center self-center rounded-[var(--radius-md)] transition-transform duration-300 group-open:rotate-180"
                        style={{ color: "var(--color-ink-3)" }}
                      >
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 1 L5 5 L9 1" />
                        </svg>
                      </span>
                    </summary>
                    <div className="grid grid-cols-[auto_1fr_auto] gap-4 pb-6">
                      <span aria-hidden="true" className="text-[10.5px] tracking-[0.22em] opacity-0">Q{num}</span>
                      <p className="max-w-[58ch] text-[14.5px] leading-[1.7] text-[var(--color-ink-2)]">
                        {item.a}
                      </p>
                      <span aria-hidden="true" className="w-4" />
                    </div>
                  </details>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
