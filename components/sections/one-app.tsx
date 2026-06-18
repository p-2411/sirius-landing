import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ToolOrbit } from "@/components/sirius/tool-orbit";
import { landingContent } from "@/content/landing";

export function OneAppSection() {
  const { eyebrow, title, body } = landingContent.stack;
  return (
    <section id="stack" className="section scroll-mt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionLabel index="03" tone="warm">
              {eyebrow}
            </SectionLabel>
            <h2 className="font-display mt-7 max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-[var(--color-ink-3)]">
              {body}
            </p>
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
