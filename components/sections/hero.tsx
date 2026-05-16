"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { useMicSignal } from "@/lib/use-mic-signal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
import { AppIcon, VoiceHomeShot, WorkflowShot, ScaledShot } from "@/components/sirius/appui";

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
  const { state: micState, start: startMic, stop: stopMic } = useMicSignal();
  const { title, description, primaryCta } = landingContent.hero;
  const listening = micState === "listening";
  const micUnavailable = micState === "unsupported";
  const micDenied = micState === "denied";

  // When reduced motion is preferred, skip animation by omitting initial/animate.
  // The variants are still valid objects; the motion elements render in final state.
  const motionState = shouldReduceMotion
    ? { initial: undefined as undefined, animate: undefined as undefined }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.45) 32%, transparent 72%)",
        }}
      />

      <div className="relative flex min-h-[calc(100svh-3.5rem)] flex-col">
        <Container className="relative flex flex-1 flex-col items-center justify-center py-[clamp(1.5rem,5vh,4rem)] text-center">
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={motionState.initial}
              animate={motionState.animate}
              variants={orbVariants}
              className="relative flex flex-col items-center"
              style={{ width: "clamp(240px, 34vh, 440px)", height: "clamp(240px, 34vh, 440px)" }}
            >
              <button
                type="button"
                onClick={listening ? stopMic : startMic}
                onMouseDown={(event) => event.preventDefault()}
                disabled={micUnavailable}
                aria-label={listening ? "Stop listening" : "Activate Sirius orb with microphone"}
                aria-pressed={listening}
                className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-8 focus-visible:ring-offset-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Orb className="!h-full !w-full" pulse />
              </button>

              <div className="pointer-events-none absolute right-full top-1/2 hidden -translate-y-1/2 items-center gap-2 pr-5 text-[var(--color-ink-4)] sm:flex">
                <p className="whitespace-nowrap text-[13px]" aria-live="polite">
                  {listening
                    ? "listening — tap to stop"
                    : micUnavailable
                      ? "mic unavailable in this browser"
                      : micDenied
                        ? "mic blocked — tap to retry"
                        : "try a tap"}
                </p>
                <svg
                  width="34"
                  height="14"
                  viewBox="0 0 34 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="opacity-50"
                >
                  <path d="M1 7h29" />
                  <path d="M25 2l5 5-5 5" />
                </svg>
              </div>
            </motion.div>
          </div>
        <div className="mt-[clamp(1.5rem,4vh,3rem)] text-center">
          <h1 className="font-display text-balance font-normal text-[var(--color-ink-1)]" style={{ fontSize: "clamp(2.5rem, 6.4vw, 5.6rem)", lineHeight: "0.95", letterSpacing: "-0.032em" }}>
            <motion.span
              className="block"
              initial={motionState.initial}
              animate={motionState.animate}
              variants={line1Variants}
            >
              {title}
            </motion.span>
            <motion.span
              className="block"
              initial={motionState.initial}
              animate={motionState.animate}
              variants={line2Variants}
              style={{ color: "var(--color-accent)" }}
            >
              <em className="font-display-italic not-italic">that doesn&apos;t forget.</em>
            </motion.span>
          </h1>

          <motion.p
            className="mx-auto mt-8 max-w-[560px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.55] text-[var(--color-ink-2)]"
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
                <span className="inline-flex motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:translate-x-0.5">
                  <AppIcon name="arrow" size={14} stroke="currentColor" />
                </span>
              </span>
            </ButtonLink>
            <ButtonLink href="#in-practice" variant="quiet">
              see more
            </ButtonLink>
          </motion.div>

        </div>
        </Container>

        <div className="pointer-events-none flex flex-col items-center gap-1.5 pt-[clamp(2rem,5vh,3.5rem)] pb-9">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-ink-3)]">
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
            className="text-[var(--color-ink-4)] motion-safe:animate-bounce"
          >
            <path d="M2 2 L8 8 L14 2" />
          </svg>
        </div>
      </div>

      <Container className="relative pt-16 pb-20 md:pt-20 md:pb-24">
        <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.58fr_0.42fr]">
          <ScreenshotFrame
            alt="Sirius workflow workspace — live DAG on the left, workflow chat on the right"
            caption="Workflow workspace — live DAG + chat"
            priority
            className="lg:min-h-[520px]"
          >
            <ScaledShot width={1360} height={850}>
              <WorkflowShot
                breadcrumb="Weekly client update"
                title="Weekly client update"
                tone="awaiting"
                statusLabel="Awaiting input"
                trigger="Manual trigger"
                runsMeta="12 runs · last 2h ago"
                railActive="workflows"
                steps={[
                  { id: "read",   type: "GMAIL",      title: "Pull this week’s thread", col: 0, next: ["draft"],  state: "done" },
                  { id: "draft",  type: "LLM",        title: "Draft the update",        col: 1, next: ["review"], state: "done" },
                  { id: "review", type: "APPROVAL",   title: "Confirm the figure",      col: 2, next: ["send"],   state: "gated" },
                  { id: "send",   type: "SEND EMAIL", title: "Send to the client",      col: 3, next: [],         state: "idle" },
                ]}
                chatHeader="Chat with this workflow"
                messages={[
                  { role: "user",      text: "Sirius, where's the client update?" },
                  { role: "assistant", text: "Drafted from this week's thread in your usual format. I flagged one revenue figure that changed. Confirm it and I'll send." },
                ]}
                recentRuns={[
                  { tone: "done",   label: "Done",   when: "2h ago", dur: "1m 04s" },
                  { tone: "done",   label: "Done",   when: "1d ago", dur: "58s" },
                  { tone: "failed", label: "Failed", when: "3d ago", dur: "12s" },
                ]}
              />
            </ScaledShot>
          </ScreenshotFrame>
          <ScreenshotFrame
            alt="Sirius voice home surface with orb, transcript, and reply"
            caption="Voice surface"
            className="hidden lg:block"
          >
            <ScaledShot width={1360} height={850}>
              <VoiceHomeShot />
            </ScaledShot>
          </ScreenshotFrame>
        </div>
      </Container>
    </section>
  );
}
