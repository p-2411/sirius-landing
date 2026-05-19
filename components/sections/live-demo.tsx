import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { StartupAnalystDemo } from "@/components/sirius/startup-analyst-demo";
import type { StartupAnalystDemoFile } from "@/lib/startup-analyst-demo";

export function LiveDemoSection({
  startupAnalystFiles,
}: {
  startupAnalystFiles: StartupAnalystDemoFile[];
}) {
  return (
    <section id="live-demo" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        {/* Un-numbered interlude — not part of the 01–06 section sequence */}
        <SectionLabel tone="warm">See it run</SectionLabel>

        <h2 className="font-display mt-7 max-w-[24ch] text-[clamp(2.4rem,5.2vw,4rem)] leading-[0.92] tracking-[-0.028em] font-normal text-[var(--color-ink-1)]">
          Don&rsquo;t take our word for it.{" "}
          <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
            Run it.
          </em>
        </h2>

        <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
          This is the real Sirius app, not a recording. Trigger the startup-analyst
          pipeline and watch it discover, score, and package this week&rsquo;s
          dealflow &mdash; then open the files it produced.
        </p>

        <div className="mt-16 border-t border-[var(--color-border-strong)] pt-6 md:pt-8">
          <StartupAnalystDemo files={startupAnalystFiles} />
        </div>
      </Container>
    </section>
  );
}
