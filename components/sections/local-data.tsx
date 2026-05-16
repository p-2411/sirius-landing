import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalDataDiagram } from "@/components/sirius/local-data-diagram";

export function LocalDataSection() {
  const { sectionLabel } = landingContent.localData;

  return (
    <section id="local-data" className="band-deep scroll-mt-24 py-24 md:py-32">
      <Container>
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:items-start">
          <div>
            <SectionLabel index="05" tone="warm">{sectionLabel}</SectionLabel>
            <h2 className="font-display mt-7 text-[clamp(2.3rem,5vw,3.8rem)] leading-[0.92] tracking-[-0.028em] font-normal text-[var(--color-ink-1)] max-w-[18ch]">
              Your data,{" "}
              <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
                your machine.
              </em>
            </h2>
          </div>

          <div>
            <LocalDataDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}
