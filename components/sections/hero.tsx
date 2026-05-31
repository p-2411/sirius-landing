"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { SocialPostsDemo } from "@/components/sirius/social-posts-demo";
import { useMicSignal } from "@/lib/use-mic-signal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection() {
  const reduce = useReducedMotion();
  const { title, titleAccent, description, betaPill, micHint, micPrivacy, tapFallback } =
    landingContent.hero;
  const { downloadCta } = landingContent;

  const [running, setRunning] = useState(false);
  const trigger = useCallback(() => setRunning(true), []);

  const { state: micState, start: startMic } = useMicSignal({ onVoiceDetected: trigger });
  const listening = micState === "listening";
  const micUnavailable = micState === "unsupported";

  const onOrbClick = useCallback(() => {
    // Tap always works as a trigger; also try to open the mic so speech reacts.
    if (!micUnavailable && !listening) startMic();
    trigger();
  }, [micUnavailable, listening, startMic, trigger]);

  const motionState = reduce
    ? { initial: undefined, animate: undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <Container className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-[clamp(2rem,6vh,5rem)] text-center">
        <motion.h1
          {...motionState}
          variants={fade}
          className="font-display text-balance font-normal text-[var(--color-ink-1)]"
          style={{ fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: "0.98", letterSpacing: "-0.03em" }}
        >
          <span className="block">{title}</span>
          <span className="block" style={{ color: "var(--color-accent)" }}>
            {titleAccent}
          </span>
        </motion.h1>

        <motion.p
          {...motionState}
          variants={fade}
          className="mx-auto mt-7 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[var(--color-ink-2)]"
        >
          {description}
        </motion.p>

        <motion.div {...motionState} variants={fade} className="mt-9 flex items-center justify-center gap-5">
          <ButtonLink href={downloadCta.href} variant="primary">
            {downloadCta.label}
          </ButtonLink>
          <span className="rounded-full border border-[rgba(108,216,255,0.4)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-state-listening-strong)]">
            {betaPill}
          </span>
        </motion.div>

        {/* Orb = voice on-ramp / trigger */}
        <div className="mt-12 flex flex-col items-center">
          <button
            type="button"
            onClick={onOrbClick}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="Speak to Sirius and watch it work"
            className="relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[rgba(108,216,255,0.55)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--color-bg)]"
            style={{ width: "clamp(120px,16vh,180px)", height: "clamp(120px,16vh,180px)" }}
          >
            <Orb className="!h-full !w-full" pulse />
          </button>
          {!running && (
            <>
              <p className="mt-4 text-[13px] text-[var(--color-state-listening-strong)]" aria-live="polite">
                {listening ? "listening…" : micUnavailable ? tapFallback : micHint}
              </p>
              <button
                type="button"
                onClick={trigger}
                className="btn btn-quiet mt-1 text-[12px]"
              >
                {tapFallback} ↓
              </button>
            </>
          )}
        </div>

        {!running && (
          <p className="mt-6 text-[11px] text-[var(--color-ink-4)]">{micPrivacy}</p>
        )}

        <SocialPostsDemo running={running} />
      </Container>
    </section>
  );
}
