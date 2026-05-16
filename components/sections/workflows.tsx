import { landingContent } from "@/content/landing";
import { WorkflowsIndexShot, ScaledShot } from "@/components/sirius/appui";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";

export function WorkflowsSection() {
  const { sectionLabel, intro, coda, notes } = landingContent.workflows;

  return (
    <section id="workflows" className="relative scroll-mt-24 py-24 md:py-36">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:items-start">
          {/* Left: framing */}
          <div className="md:pt-2">
            <SectionLabel index="02" tone="warm">{sectionLabel}</SectionLabel>

            <h2 className="font-display text-balance mt-7 max-w-[18ch] text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[0.92] tracking-[-0.028em] text-[var(--color-ink-1)] font-normal">
              The work you already do,{" "}
              <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
                saved for next time.
              </em>
            </h2>

            <p className="mt-8 max-w-[50ch] text-[16px] leading-[1.72] text-[var(--color-ink-2)]">
              {intro}
            </p>

            <p className="mt-5 max-w-[50ch] text-[16px] leading-[1.72] text-[var(--color-ink-2)]">
              {coda}
            </p>
          </div>

          <div className="relative md:pt-4">
            <ScreenshotFrame
              alt="Sirius workflows index with filters, statuses, triggers, and run counts"
              caption="Workflows index"
              className="w-full"
            >
              <ScaledShot width={1360} height={850}>
                <WorkflowsIndexShot />
              </ScaledShot>
            </ScreenshotFrame>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {notes.map((note, index) => (
                <figure
                  key={note}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5"
                >
                  <figcaption className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-state-listening)]">
                    Sirius suggestion {String(index + 1).padStart(2, "0")}
                  </figcaption>
                  <blockquote className="text-[14.5px] leading-[1.6] text-[var(--color-ink-2)]">
                    &ldquo;{note}&rdquo;
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
