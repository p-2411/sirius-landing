"use client";

import { useEffect, useRef, useState } from "react";

import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
import { WorkflowShot, ScaledShot } from "@/components/sirius/appui";
import type { WorkflowShotProps } from "@/components/sirius/appui";

// ─── Per-vignette screenshot metadata ────────────────────────────────────────

const SCREENSHOT_META: Record<string, { alt: string; caption: string }> = {
  design:      { alt: "Sirius — client feedback triaged in the app",   caption: "Feedback, sorted in Sirius" },
  engineering: { alt: "Sirius — standup assembled in the app",          caption: "Standup, ready in Sirius" },
  meeting:     { alt: "Sirius — meeting brief in the app",              caption: "Meeting brief in Sirius" },
  research:    { alt: "Sirius — research digest in the app",            caption: "Research desk in Sirius" },
};

// ─── Per-vignette WorkflowShot props ─────────────────────────────────────────

const SHOT_BY_ID: Record<string, WorkflowShotProps> = {
  design: {
    breadcrumb: "Client feedback",
    title: "Client feedback",
    tone: "running",
    statusLabel: "Running",
    trigger: "Per inbound",
    runsMeta: "23 runs",
    steps: [
      { id: "read",  type: "GMAIL", title: "Read the comments",        col: 0, next: ["sort"],  state: "done" },
      { id: "sort",  type: "LLM",   title: "Sort by section",          col: 1, next: ["draft"], state: "done" },
      { id: "draft", type: "LLM",   title: "Draft the routine replies", col: 2, next: ["flag"],  state: "done" },
      { id: "flag",  type: "SLACK", title: "Flag scope changes",       col: 3, next: [],         state: "running" },
    ],
    messages: [
      { role: "user",      text: "Sirius, what came in from the client?" },
      { role: "assistant", text: "Sorted 6 comments by section. Drafted replies to the 4 routine ones; 2 change scope — flagged for you." },
    ],
    recentRuns: [
      { tone: "done",    label: "Done",    when: "1h ago",  dur: "42s" },
      { tone: "done",    label: "Done",    when: "3h ago",  dur: "38s" },
      { tone: "running", label: "Running", when: "5m ago",  dur: "—" },
    ],
  },
  engineering: {
    breadcrumb: "Standup digest",
    title: "Standup digest",
    tone: "running",
    statusLabel: "Running",
    trigger: "Mon 09:00",
    runsMeta: "48 runs",
    steps: [
      { id: "pull",      type: "GITHUB",     title: "Pull PRs + threads",  col: 0, next: ["merge"],     state: "done" },
      { id: "merge",     type: "RUN PYTHON", title: "Merge by area",       col: 1, next: ["summarise"], state: "done" },
      { id: "summarise", type: "LLM",        title: "Summarise blockers",  col: 2, next: ["post"],      state: "done" },
      { id: "post",      type: "SLACK",      title: "Post the digest",     col: 3, next: [],             state: "running" },
    ],
    messages: [
      { role: "user",      text: "Sirius, what's standup looking like?" },
      { role: "assistant", text: "Pulled 9 PRs and 3 threads. Digest is posted — two blockers are pinned at the top." },
    ],
    recentRuns: [
      { tone: "done", label: "Done", when: "Mon 09:01", dur: "1m 12s" },
      { tone: "done", label: "Done", when: "Fri 09:01", dur: "58s" },
    ],
  },
  meeting: {
    breadcrumb: "Meeting brief",
    title: "Meeting brief",
    tone: "done",
    statusLabel: "Done",
    trigger: "Per meeting",
    runsMeta: "96 runs",
    steps: [
      { id: "watch",  type: "CALENDAR",     title: "Watch the calendar",   col: 0, next: ["gather"], state: "done" },
      { id: "gather", type: "HTTP REQUEST", title: "Gather the thread",    col: 1, next: ["brief"],  state: "done" },
      { id: "brief",  type: "LLM",          title: "Write the brief",      col: 2, next: ["land"],   state: "done" },
      { id: "land",   type: "GMAIL",        title: "Land it in your inbox", col: 3, next: [],         state: "done" },
    ],
    messages: [
      { role: "user",      text: "Sirius, what's the 14:00?" },
      { role: "assistant", text: "Brief's in your inbox: latest thread, open tasks, and the last three decisions with this account." },
    ],
    recentRuns: [
      { tone: "done", label: "Done", when: "1h ago",  dur: "28s" },
      { tone: "done", label: "Done", when: "3h ago",  dur: "31s" },
      { tone: "done", label: "Done", when: "1d ago",  dur: "25s" },
    ],
  },
  research: {
    breadcrumb: "Research digest",
    title: "Research digest",
    tone: "running",
    statusLabel: "Running",
    trigger: "Daily 07:00",
    runsMeta: "140 runs",
    steps: [
      { id: "subscribe", type: "HTTP REQUEST", title: "Pull the sources",      col: 0, next: ["filter"],  state: "done" },
      { id: "filter",    type: "RUN PYTHON",   title: "Filter to signal",      col: 1, next: ["compare"], state: "done" },
      { id: "compare",   type: "LLM",          title: "Compare the conflicts", col: 2, next: ["digest"],  state: "running" },
      { id: "digest",    type: "LLM",          title: "Write the digest",      col: 3, next: [],           state: "idle" },
    ],
    messages: [
      { role: "user",      text: "Sirius, what's worth knowing this morning?" },
      { role: "assistant", text: "Filtered 40 items to 6. Two contradict last week's read — comparing now, digest lands in ~2 min." },
    ],
    recentRuns: [
      { tone: "done", label: "Done", when: "07:01 today", dur: "1m 48s" },
      { tone: "done", label: "Done", when: "07:01 yday",  dur: "1m 52s" },
    ],
  },
};

const TITLE_HIGHLIGHTS: Record<string, string> = {
  design: "sorted before you read it.",
  engineering: "ready before you are.",
  meeting: "already briefed.",
  research: "for one.",
};

// Match the site's body font (Geist) — tracking + caps carry the "technical
// readout" tone without the visual jolt of true monospace.
const MONO_STACK = `"Geist", "Inter", ui-sans-serif, system-ui, sans-serif`;

// ─── Voice glyph ─────────────────────────────────────────────────────────────

function VoiceWaveform({ revealed }: { revealed: boolean }) {
  const bars = [0.35, 0.7, 0.5, 0.95, 0.6, 0.38];
  return (
    <span
      aria-hidden="true"
      data-revealed={revealed ? "true" : "false"}
      className="ip-voice inline-flex h-[18px] shrink-0 items-end gap-[3px]"
    >
      {bars.map((h, i) => (
        <span
          key={i}
          className="ip-voice-bar block w-[2px] rounded-full"
          style={{
            ["--ip-wave-h" as string]: `${Math.round(h * 100)}%`,
            ["--ip-wave-delay" as string]: `${i * 60}ms`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

type CardData = (typeof landingContent.inPractice.vignettes)[number];

function PracticeCard({ card, total }: { card: CardData; total: number }) {
  const highlight = TITLE_HIGHLIGHTS[card.id];
  const highlightIndex = highlight ? card.title.indexOf(highlight) : -1;
  const titleLead = highlightIndex >= 0 ? card.title.slice(0, highlightIndex) : card.title;
  const screenshot = SCREENSHOT_META[card.id];

  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.3) {
            setRevealed(true);
            revealIO.disconnect();
            break;
          }
        }
      },
      { threshold: [0.3, 0.5] },
    );
    revealIO.observe(el);

    return () => {
      revealIO.disconnect();
    };
  }, []);

  return (
    <article
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className="ip-card relative grid grid-cols-1 items-center gap-8 border-t border-[var(--color-border-strong)] py-12 first:border-t-0 first:pt-2 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 md:py-16 md:first:pt-4 md:last:pb-0"
    >
      {/* TEXT COLUMN */}
      <div className="relative flex max-w-[58ch] flex-col">
        <p className="flex items-center gap-3 text-[15px] italic leading-[1.5] text-[var(--color-ink-2)]">
          <VoiceWaveform revealed={revealed} />
          <span>&ldquo;{card.voiceTrigger}&rdquo;</span>
        </p>

        <h3 className="font-display mt-4 max-w-[22ch] text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.08] tracking-[-0.022em] text-[var(--color-ink-1)]">
          {titleLead}
          {highlightIndex >= 0 && (
            <em
              className="font-display-italic not-italic"
              style={{ color: "var(--color-accent)" }}
            >
              {highlight}
            </em>
          )}
        </h3>

        <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-[var(--color-ink-2)]">
          {card.body}
        </p>

        <p
          className="mt-6 inline-flex items-baseline gap-3 text-[14px] leading-[1.5] text-[var(--color-ink-1)]"
          style={{ fontFamily: MONO_STACK, letterSpacing: "0.01em" }}
        >
          <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>—</span>
          <span>{card.punchline}</span>
        </p>

        <div
          className="mt-7"
          style={{
            fontFamily: MONO_STACK,
            fontSize: 10.5,
            letterSpacing: "0.22em",
            color: "var(--color-ink-3)",
          }}
        >
          <span style={{ color: "var(--color-accent)", opacity: 0.9 }}>{card.seq}</span>
          <span className="mx-2 opacity-60">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* PRODUCT COLUMN */}
      <div className="relative flex flex-col justify-center md:justify-end">
        <div className="w-full max-w-[480px] self-center md:self-end">
          {screenshot && (
            <ScreenshotFrame
              alt={screenshot.alt}
              caption={screenshot.caption}
            >
              {SHOT_BY_ID[card.id] && (
                <ScaledShot width={1360} height={850}>
                  <WorkflowShot {...SHOT_BY_ID[card.id]} />
                </ScaledShot>
              )}
            </ScreenshotFrame>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function InPracticeSection() {
  const { sectionLabel, intro, vignettes } = landingContent.inPractice;

  return (
    <section id="in-practice" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        {/* Section eyebrow — gold (decorative brand accent, tone="warm") */}
        <SectionLabel index="01" tone="warm">
          {sectionLabel}
        </SectionLabel>

        <h2 className="font-display mt-7 max-w-[26ch] text-[clamp(2.4rem,5.2vw,4rem)] leading-[0.92] tracking-[-0.028em] font-normal text-[var(--color-ink-1)]">
          Stop doing the same work{" "}
          <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
            from scratch.
          </em>
        </h2>

        <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
          {intro}
        </p>

        <div className="mt-16 flex flex-col border-t border-[var(--color-border-strong)] pt-6 md:pt-8">
          {vignettes.map((v) => (
            <PracticeCard key={v.id} card={v} total={vignettes.length} />
          ))}
        </div>
      </Container>

      <style>{`
        /* Voice waveform — single slow pulse on reveal.
           Wave bars use CYAN (state-listening-strong) — this is a LIVE / running indicator. */
        .ip-voice-bar {
          height: var(--ip-wave-h);
          background: var(--ip-wave-color, var(--color-state-listening-strong));
          transform: scaleY(0.32);
          transform-origin: bottom center;
          opacity: 0.55;
          transition: opacity 200ms ease;
        }
        .ip-voice[data-revealed="true"] .ip-voice-bar {
          animation: ip-wave-once 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: var(--ip-wave-delay, 0ms);
          opacity: 0.95;
        }
        @keyframes ip-wave-once {
          0%   { transform: scaleY(0.32); }
          45%  { transform: scaleY(1); }
          100% { transform: scaleY(0.55); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ip-voice[data-revealed="true"] .ip-voice-bar {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
