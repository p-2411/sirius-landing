"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { SocialPostsDemo } from "@/components/sirius/social-posts-demo";
import { DownloadButton } from "@/components/ui/download-button";

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
  const { title, titleAccent, description } = landingContent.hero;

  const motionState = reduce
    ? { initial: undefined, animate: undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-6 py-[clamp(3rem,7vh,5.5rem)] md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Left — words */}
        <motion.div {...motionState} variants={fade} className="text-center">
          <h1
            className="font-display text-balance font-normal text-[var(--color-ink-1)]"
            style={{ fontSize: "clamp(2.3rem,5vw,4.4rem)", lineHeight: "1.0", letterSpacing: "-0.03em" }}
          >
            <span className="block">{title}</span>
            <span className="block" style={{ color: "var(--color-accent)" }}>
              {titleAccent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[480px] text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.55] text-[var(--color-ink-2)]">
            {description}
          </p>

          <div className="mt-9 flex items-center justify-center">
            <DownloadButton />
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
