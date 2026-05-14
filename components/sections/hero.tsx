"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const orbVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
};

const line1Variants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const line2Variants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
};

const subheadVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.28, ease: "easeOut" },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.36, ease: "easeOut" },
  },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { description, primaryCta } = landingContent.hero;

  // When reduced motion is preferred, skip animation by omitting initial/animate.
  // The variants are still valid objects; the motion elements render in final state.
  const motionState = shouldReduceMotion
    ? { initial: undefined as undefined, animate: undefined as undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 overflow-hidden pt-16 pb-20 md:pt-20 md:pb-24 lg:min-h-[calc(100svh-56px)] lg:pt-24 lg:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.45) 32%, transparent 72%)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1 md:text-right">
            <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-[var(--color-border-strong)]" />
              <span>An assistant in private beta</span>
            </p>
            <p className="mt-4 font-display-italic text-[clamp(0.95rem,1.2vw,1.05rem)] leading-[1.4] text-[var(--color-text-muted)]">
              v1 · sirius
            </p>
          </div>

          <div className="relative order-1 flex flex-col items-center md:order-2">
            <motion.div
              initial={motionState.initial}
              animate={motionState.animate}
              variants={orbVariants}
              className="relative"
              style={{ width: "clamp(240px, 26vw, 340px)", height: "clamp(240px, 26vw, 340px)" }}
            >
              <Orb className="!h-full !w-full" />
            </motion.div>
          </div>

          <div className="order-3 md:order-3 md:text-left">
            <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              <span>private · local · yours</span>
              <span aria-hidden="true" className="inline-block h-px w-8 bg-[var(--color-border-strong)]" />
            </p>
            <p className="mt-4 font-display-italic text-[clamp(0.95rem,1.2vw,1.05rem)] leading-[1.4] text-[var(--color-text-muted)]">
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-20 text-center">
          <h1 className="font-display text-balance font-normal text-[var(--color-text-primary)]" style={{ fontSize: "clamp(3.2rem, 11vw, 9.5rem)", lineHeight: "0.9", letterSpacing: "-0.035em" }}>
            <motion.span
              className="block"
              initial={motionState.initial}
              animate={motionState.animate}
              variants={line1Variants}
            >
              Your AI assistant.
            </motion.span>
            <motion.span
              className="block"
              initial={motionState.initial}
              animate={motionState.animate}
              variants={line2Variants}
              style={{ color: "var(--color-warm)" }}
            >
              <em className="font-display-italic not-italic">rethought.</em>
            </motion.span>
          </h1>

          <motion.p
            className="mx-auto mt-8 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[var(--color-text-secondary)]"
            initial={motionState.initial}
            animate={motionState.animate}
            variants={subheadVariants}
          >
            {description}
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-5"
            initial={motionState.initial}
            animate={motionState.animate}
            variants={ctaVariants}
          >
            <ButtonLink href="#cta" variant="primary">
              <span className="inline-flex items-center gap-2">
                {primaryCta}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </span>
            </ButtonLink>
          </motion.div>
        </div>
      </Container>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          more below
        </span>
        <svg
          width="14"
          height="9"
          viewBox="0 0 16 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="text-[var(--color-text-faint)] motion-safe:animate-bounce"
        >
          <path d="M2 2 L8 8 L14 2" />
        </svg>
      </div>
    </section>
  );
}
