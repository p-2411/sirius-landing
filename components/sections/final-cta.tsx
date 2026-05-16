"use client";

import { motion, useReducedMotion } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { WaitlistForm } from "@/components/ui/waitlist-form";

export function FinalCtaSection() {
  const reducedMotion = useReducedMotion();
  const { cta } = landingContent;

  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-15%" },
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
        };

  return (
    <section
      id="cta"
      className="relative isolate scroll-mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-24 md:px-10 md:py-32 lg:min-h-[80vh] lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_36%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.45)_32%,transparent_72%)]" />

      <div className="mx-auto flex max-w-[840px] flex-col items-center text-center">
        <div className="mb-12 md:mb-16">
          <Orb className="!h-[clamp(220px,26vw,320px)] !w-[clamp(220px,26vw,320px)]" />
        </div>

        <motion.h2
          {...fadeUp(0.1)}
          className="font-display text-balance font-normal text-[var(--color-ink-1)]"
          style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", lineHeight: "0.9", letterSpacing: "-0.005em" }}
        >
          Meet{" "}
          <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
            Sirius.
          </em>
        </motion.h2>

        <motion.div {...fadeUp(0.2)} className="mt-12 w-full max-w-[480px]">
          <WaitlistForm />
          <p className="mt-4 text-[13px] leading-5 text-[var(--color-ink-3)]">
            {cta.note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
