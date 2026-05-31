import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { AppIcon } from "@/components/sirius/appui";
import { landingContent } from "@/content/landing";

export function LearnsOnceSection() {
  const { eyebrow, title, body } = landingContent.learnsOnce;
  return (
    <section id="learns-once" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionLabel tone="warm">{eyebrow}</SectionLabel>
            <h2 className="font-display mt-7 max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
              {body}
            </p>
          </div>

          {/* Two runs: guide it once, then just ask. */}
          <div className="relative">
            {/* First run — you guide it */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
                First run · you guide it
              </span>
              <div className="mt-3 flex flex-col gap-2">
                <Bubble who="you">
                  Pull this week&rsquo;s client update — here&rsquo;s the format, the thread, and the
                  figure to double-check.
                </Bubble>
                <Bubble who="sirius">
                  Done. Drafted it in your format, flagged the revenue figure that changed, and paused
                  for your ok.
                </Bubble>
              </div>
            </div>

            {/* saved divider — centred between the two cards */}
            <div className="my-3 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(240,179,90,0.4)] bg-[rgba(240,179,90,0.06)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent)]">
                <AppIcon name="flows" size={12} />
                saved as a workflow
              </span>
            </div>

            {/* Every run after — just ask */}
            <div className="rounded-[var(--radius-lg)] border border-[rgba(167,219,178,0.35)] bg-[var(--color-surface-1)] p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
                Every run after · just ask
              </span>
              <div className="mt-3 flex flex-col gap-2">
                <Bubble who="you">Do this week&rsquo;s client update.</Bubble>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Bubble({ who, children }: { who: "you" | "sirius"; children: React.ReactNode }) {
  const you = who === "you";
  return (
    <div className={you ? "flex justify-end" : "flex justify-start"}>
      <div
        className="max-w-[88%] rounded-[12px] px-3.5 py-2.5 text-[12.5px] leading-[1.5]"
        style={{
          background: you ? "var(--color-bubble-user)" : "var(--color-bubble-assistant)",
          color: you ? "var(--color-ink-1)" : "var(--color-ink-2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
