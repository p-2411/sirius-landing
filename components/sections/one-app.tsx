import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ToolOrbit } from "@/components/sirius/tool-orbit";
import { landingContent } from "@/content/landing";

export function OneAppSection() {
  const { eyebrow, title } = landingContent.oneApp;
  return (
    <section id="one-app" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionLabel index="03" tone="warm">
              {eyebrow}
            </SectionLabel>
            <h2 className="font-display mt-7 max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
          </Reveal>

          {/* Tools orbit the Sirius orb in 3D. */}
          <Reveal delay={0.12}>
            <ToolOrbit />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
