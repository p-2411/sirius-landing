"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { SocialPostsDemo } from "@/components/sirius/social-posts-demo";
import { ButtonLink } from "@/components/ui/button";

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroSection() {
  const reduce = useReducedMotion();
  const { title, titleAccent, description, betaPill } = landingContent.hero;
  const { downloadCta } = landingContent;

  const motionState = reduce
    ? { initial: undefined, animate: undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-6 py-[clamp(1.5rem,4vh,3rem)] md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Left — words */}
        <motion.div {...motionState} variants={fade} className="text-center lg:text-left">
          <h1
            className="font-display text-balance font-normal text-[var(--color-ink-1)]"
            style={{ fontSize: "clamp(2.3rem,5vw,4.4rem)", lineHeight: "1.0", letterSpacing: "-0.03em" }}
          >
            <span className="block">{title}</span>
            <span className="block" style={{ color: "var(--color-accent)" }}>
              {titleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[480px] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-[var(--color-ink-2)] lg:mx-0">
            {description}
          </p>

          <div className="mt-9 flex items-center justify-center gap-4 lg:justify-start">
            <ButtonLink href={downloadCta.href} variant="primary">
              {downloadCta.label}
            </ButtonLink>
            <span className="rounded-full border border-[rgba(108,216,255,0.4)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-state-listening-strong)]">
              {betaPill}
            </span>
          </div>
        </motion.div>

        {/* Right — the live app, playing */}
        <motion.div {...motionState} variants={rise}>
          <SocialPostsDemo />
        </motion.div>
      </div>
    </section>
  );
}
