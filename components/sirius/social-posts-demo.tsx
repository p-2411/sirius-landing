"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";

import { Orb } from "@/components/sirius/orb";
import { Rail } from "@/components/sirius/appui";
import {
  WORKFLOW_NAME,
  RUN_STEPS,
  DISPLAY_INTRO,
  DEMO_DRAFTS,
  HOME_PROMPT,
  HOME_REPLY,
} from "@/lib/social-posts-demo";

// ── Timeline (ms) ───────────────────────────────────────────────────────────
// One clock drives everything; visuals are derived from `elapsed`, so the
// scrubber and the scene always agree. This is a directed film, not a video.
const T = {
  orbClick: 1500,
  prompt: 1500,
  reply: 2100,
  startToast: 3400,
  toastTap: 4600,
  runStart: 4800,
  perStep: 400, // 6 steps → all done by ~7200
  backTap: 9200,
  home2: 9500,
  doneNotif: 10300,
  total: 11200,
};

type Surface = "home" | "run";

function surfaceFor(t: number): Surface {
  if (t < T.runStart) return "home";
  if (t < T.home2) return "run";
  return "home";
}

export function SocialPostsDemo() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const runScrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  // elapsedRef is the clock's source of truth; `elapsed` mirrors it for render.
  const elapsedRef = useRef(0);

  // Auto-play once when scrolled into view (skipped for reduced motion).
  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4 && !started) {
          setStarted(true);
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: [0.4] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, started]);

  // rAF loop — advances the ref, mirrors to state, stops at the end.
  // setState only happens inside the rAF callback (not the effect body).
  useEffect(() => {
    if (!playing || reduce) return;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      const next = Math.min(elapsedRef.current + dt, T.total);
      elapsedRef.current = next;
      setElapsed(next);
      if (next < T.total) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [playing, reduce]);

  // Reduced motion → render the finished payoff without animating.
  const e = reduce ? T.total : elapsed;
  const ended = e >= T.total;

  const toggle = useCallback(() => {
    if (reduce) return;
    if (elapsedRef.current >= T.total) {
      elapsedRef.current = 0;
      setElapsed(0);
      lastTsRef.current = null;
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [reduce]);

  // ── Derived view state ─────────────────────────────────────────────────────
  const surface = surfaceFor(e);
  const onHome = surface === "home";
  const orbActive = e >= T.orbClick && onHome && e < T.runStart;
  const showPrompt = e >= T.prompt && e < T.runStart;
  const showReply = e >= T.reply && e < T.runStart;
  const showStartToast = e >= T.startToast && e < T.runStart;
  const stepsDone = Math.max(
    0,
    Math.min(RUN_STEPS.length, Math.floor((e - T.runStart) / T.perStep)),
  );
  const showDisplay = surface === "run" && stepsDone >= RUN_STEPS.length;
  const showBackHint = surface === "run" && e > T.runStart + 200;
  const showDoneNotif = e >= T.doneNotif;

  // Auto-scroll the run page as the display output reveals.
  useEffect(() => {
    if (surface !== "run") return;
    const el = runScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: showDisplay ? el.scrollHeight : 0, behavior: reduce ? "auto" : "smooth" });
  }, [surface, showDisplay, stepsDone, reduce]);

  const cursor = cursorFor(e);
  const clicking = near(e, T.orbClick) || near(e, T.toastTap) || near(e, T.backTap);
  const progress = Math.min(100, (e / T.total) * 100);

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-black shadow-[0_30px_80px_-36px_rgba(0,0,0,0.8)]"
    >
      {/* play area */}
      <div className="relative h-[380px] bg-black sm:h-[400px]">
        <div className="absolute inset-0 flex">
          <Rail active={surface === "run" ? "workflows" : "voice"} />

          {onHome ? (
            <HomeSurface
              orbActive={orbActive}
              showPrompt={showPrompt}
              showReply={showReply}
              showStartToast={showStartToast}
              showDoneNotif={showDoneNotif}
            />
          ) : (
            <RunSurface
              scrollRef={runScrollRef}
              stepsDone={stepsDone}
              showDisplay={showDisplay}
              showBackHint={showBackHint}
            />
          )}
        </div>

        {/* simulated cursor */}
        {!reduce && started && !ended && (
          <div
            className="pointer-events-none absolute z-20"
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
              transition: "left 650ms cubic-bezier(0.4,0,0.2,1), top 650ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {clicking && (
              <span className="absolute -left-2 -top-2 h-6 w-6 animate-ping rounded-full border border-white/70" />
            )}
            <svg
              width="17"
              height="17"
              viewBox="0 0 16 16"
              fill="white"
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
            >
              <path d="M1 1 L1 12 L4 9 L6.5 14 L8.5 13 L6 8 L10 8 Z" />
            </svg>
          </div>
        )}
      </div>

      {/* scrubber — black bar, thin solid-white fill, bare white glyph, no timer */}
      <div className="flex items-center gap-3 bg-black px-3.5 py-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={ended ? "Replay" : playing ? "Pause" : "Play"}
          className="text-white/90 outline-none transition-opacity hover:opacity-70 focus-visible:opacity-100"
        >
          {ended ? <ReplayGlyph /> : playing ? <PauseGlyph /> : <PlayGlyph />}
        </button>
        <div className="relative h-[2px] flex-1 rounded-full bg-white/20">
          <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ── Home surface ──────────────────────────────────────────────────────────────
function HomeSurface({
  orbActive,
  showPrompt,
  showReply,
  showStartToast,
  showDoneNotif,
}: {
  orbActive: boolean;
  showPrompt: boolean;
  showReply: boolean;
  showStartToast: boolean;
  showDoneNotif: boolean;
}) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden bg-[var(--color-bg)] px-6 py-8">
      <div className="relative" style={{ width: 132, height: 132 }}>
        <Orb className="!h-full !w-full" staticRender />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-14%] rounded-full transition-opacity duration-500"
          style={{
            opacity: orbActive ? 1 : 0,
            background: "radial-gradient(circle, rgba(108,216,255,0.42), transparent 62%)",
          }}
        />
      </div>

      <div className="flex min-h-[64px] w-full max-w-[380px] flex-col items-center gap-2 text-center">
        {!showPrompt ? (
          <p className="text-[12.5px] text-[var(--color-ink-3)]">Tap the orb to start.</p>
        ) : (
          <>
            <p className="text-[11.5px] leading-[1.45] text-[var(--color-ink-3)]">
              <span className="text-[var(--color-ink-4)]">You · </span>
              {HOME_PROMPT}
            </p>
            {showReply && (
              <p className="text-[13px] leading-[1.5] text-[var(--color-ink-1)]">{HOME_REPLY}</p>
            )}
          </>
        )}
      </div>

      {showStartToast && !showDoneNotif && (
        <AppToast tone="neutral" title={WORKFLOW_NAME} body="Started — running in the background." />
      )}
      {showDoneNotif && (
        <AppToast tone="gold" title={WORKFLOW_NAME} body="3 drafts ready. Pick one, ship.">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DEMO_DRAFTS.map((d) => (
              <span
                key={d.id}
                className="rounded-md border border-[var(--color-border)] px-2 py-0.5 text-[9.5px] text-[var(--color-ink-3)]"
              >
                {d.angle}
              </span>
            ))}
          </div>
        </AppToast>
      )}
    </main>
  );
}

function AppToast({
  tone,
  title,
  body,
  children,
}: {
  tone: "neutral" | "gold";
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const gold = tone === "gold";
  return (
    <div
      className="absolute bottom-3 right-3 w-[228px] rounded-[10px] border bg-[var(--color-surface-1)] p-3 text-left shadow-[0_12px_34px_-12px_rgba(0,0,0,0.7)]"
      style={{
        borderColor: gold ? "rgba(240,179,90,0.55)" : "var(--color-border-strong)",
        animation: "sp-toast-in 360ms cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: gold ? "var(--color-accent)" : "var(--color-state-listening-strong)" }}
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
          Sirius
        </span>
      </div>
      <p className="mt-1.5 text-[12px] font-medium text-[var(--color-ink-1)]">{title}</p>
      <p className="mt-0.5 text-[11px] leading-[1.4] text-[var(--color-ink-2)]">{body}</p>
      {children}
      <style>{`@keyframes sp-toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Run surface (mirrors the real app run detail) ───────────────────────────────
function RunSurface({
  scrollRef,
  stepsDone,
  showDisplay,
  showBackHint,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  stepsDone: number;
  showDisplay: boolean;
  showBackHint: boolean;
}) {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-[var(--color-bg)]">
      <header className="flex-shrink-0 border-b border-[var(--color-border)] px-5 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-state-listening-strong)]">
          Run · {showDisplay ? "done" : "running"}
        </span>
        <h4 className="mt-0.5 font-display text-[16px] font-normal text-[var(--color-ink-1)]">{WORKFLOW_NAME}</h4>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]">Steps</p>
        <ol className="flex flex-col">
          {RUN_STEPS.map((step, i) => {
            const done = i < stepsDone;
            const running = i === stepsDone && !showDisplay;
            const last = i === RUN_STEPS.length - 1;
            return (
              <li key={step.id} className="relative pl-6" style={{ opacity: done || running ? 1 : 0.4 }}>
                {!last && (
                  <span aria-hidden className="absolute left-[3.5px] top-4 h-full w-px bg-[var(--color-border)]" />
                )}
                <span
                  className="absolute left-0 top-1.5 h-[7px] w-[7px] rounded-full"
                  style={{
                    background: done
                      ? "var(--color-success)"
                      : running
                        ? "var(--color-state-listening-strong)"
                        : "var(--color-ink-4)",
                  }}
                />
                <div className="flex items-baseline gap-2 pb-0.5">
                  <span className="text-[12.5px] text-[var(--color-ink-1)]">{step.title}</span>
                  <span className="font-mono text-[10px] text-[var(--color-ink-4)]">{step.type}</span>
                  <span className="ml-auto text-[10px] text-[var(--color-ink-4)]">
                    {done ? "done" : running ? "running" : ""}
                  </span>
                </div>
                {(done || running) && (
                  <div className="flex gap-3 pb-3 pt-0.5 text-[10px] text-[var(--color-ink-4)]">
                    <span>▸ input</span>
                    <span>▸ output</span>
                  </div>
                )}

                {last && showDisplay && (
                  <div className="mb-2 mt-1 rounded-[8px] border-l-2 border-[var(--color-accent)] bg-[var(--color-surface-1)] p-3.5">
                    <p className="text-[12px] text-[var(--color-ink-1)]">{DISPLAY_INTRO}</p>
                    <div className="mt-2 h-px bg-[var(--color-border)]" />
                    {DEMO_DRAFTS.map((d, di) => (
                      <div key={d.id} className="mt-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                          Post {di + 1} · {d.angle}
                        </p>
                        {d.text.split("\n\n").map((para, pi) => (
                          <p
                            key={pi}
                            className="mt-1.5 whitespace-pre-line text-[11.5px] leading-[1.55] text-[var(--color-ink-2)]"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {showBackHint && !showDisplay && (
        <div className="pointer-events-none absolute bottom-3 left-5 max-w-[260px] border-l-2 border-[var(--color-accent)] pl-2.5 text-[10.5px] leading-[1.35] text-[var(--color-ink-3)]">
          Head back home — I&rsquo;ll ping you when the drafts are ready.
        </div>
      )}
    </main>
  );
}

// ── Cursor scripting ────────────────────────────────────────────────────────────
function cursorFor(t: number): { x: number; y: number } {
  if (t < T.orbClick) return { x: 53, y: 44 }; // glide to orb
  if (t < T.startToast) return { x: 53, y: 56 }; // rest near orb
  if (t < T.toastTap + 200) return { x: 86, y: 84 }; // to the started toast
  if (t < T.backTap) return { x: 20, y: 90 }; // near the back hint on the run page
  if (t < T.home2) return { x: 5, y: 30 }; // rail home button
  return { x: 86, y: 82 }; // near the drafts-ready notification
}

function near(t: number, mark: number) {
  return t >= mark - 60 && t <= mark + 220;
}

// ── Scrubber glyphs ─────────────────────────────────────────────────────────────
function PlayGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M2 1.5 L10.5 6 L2 10.5 Z" />
    </svg>
  );
}
function PauseGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <rect x="2.5" y="2" width="2.5" height="8" rx="0.6" />
      <rect x="7" y="2" width="2.5" height="8" rx="0.6" />
    </svg>
  );
}
function ReplayGlyph() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 7a5 5 0 1 1-1.5-3.5" />
      <path d="M12 2v3h-3" />
    </svg>
  );
}
