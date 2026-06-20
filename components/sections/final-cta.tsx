import type { CSSProperties } from "react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { WaitlistForm } from "@/components/ui/waitlist-form";

export function FinalCtaSection() {
  const { cta } = landingContent;

  return (
    <section
      id="cta"
      className="relative isolate scroll-mt-24 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_36%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.45)_32%,transparent_72%)]" />

      <div className="mx-auto flex max-w-[840px] flex-col items-center text-center">
        <div className="mb-7 md:mb-9">
          <Orb className="!h-[clamp(220px,26vw,320px)] !w-[clamp(220px,26vw,320px)]" />
        </div>

        <h2
          className="reveal font-display text-balance font-normal text-[var(--color-ink-1)]"
          style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: "0.9", letterSpacing: "-0.005em", "--d": "0.05s" } as CSSProperties}
        >
          {cta.title}
        </h2>

        <div className="reveal mt-12 flex w-full max-w-[440px] flex-col items-center gap-4" style={{ "--d": "0.12s" } as CSSProperties}>
          <WaitlistForm />
          <p className="text-[13px] leading-5 text-[var(--color-ink-3)]">
            {cta.sub}
          </p>
        </div>
      </div>
    </section>
  );
}
