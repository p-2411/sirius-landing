"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";

import { Orb } from "@/components/sirius/orb";
import { Rail, ScaledShot } from "@/components/sirius/appui";
import { Eyebrow } from "@/components/sirius/appui/eyebrow";
import { T, FONT_BODY, FONT_DISPLAY } from "@/lib/app-theme";
import {
  WORKFLOW_NAME,
  RUN_STEPS,
  DISPLAY_INTRO,
  DEMO_DRAFTS,
  HOME_PROMPT,
  HOME_REPLY,
  type RunStep,
} from "@/lib/social-posts-demo";

// Design size of the real app screen we render then scale into the player.
const DW = 1360;
const DH = 850;
const RUN_ID = 128;

// ── Timeline (ms). One clock; visuals derive from `e` so scrubber + scene agree.
const TL = {
  orbClick: 1600,
  reply: 2400,
  startToast: 3700,
  toastTap: 5000,
  runStart: 5300,
  perStep: 780, // 6 steps → done ≈ 9980
  backTap: 11200,
  home2: 11500,
  doneNotif: 12200,
  total: 14400,
};

type Surface = "home" | "run";
function surfaceFor(t: number): Surface {
  if (t < TL.runStart) return "home";
  if (t < TL.home2) return "run";
  return "home";
}

export function SocialPostsDemo() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const runScrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  // Auto-play once on scroll-into-view (skipped for reduced motion).
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

  // rAF clock — setState only inside the callback, never the effect body.
  useEffect(() => {
    if (!playing || reduce) return;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      const next = Math.min(elapsedRef.current + dt, TL.total);
      elapsedRef.current = next;
      setElapsed(next);
      if (next < TL.total) {
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

  const e = reduce ? TL.total : elapsed;
  const ended = e >= TL.total;

  const toggle = useCallback(() => {
    if (reduce) return;
    if (elapsedRef.current >= TL.total) {
      elapsedRef.current = 0;
      setElapsed(0);
      lastTsRef.current = null;
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }, [reduce]);

  // Derived view state.
  const surface = surfaceFor(e);
  const onHome = surface === "home";
  const orbActive = e >= TL.orbClick && onHome && e < TL.runStart;
  const showPrompt = e >= TL.orbClick && e < TL.runStart;
  const showReply = e >= TL.reply && e < TL.runStart;
  const showStartToast = e >= TL.startToast && e < TL.runStart;
  const stepsDone = Math.max(0, Math.min(RUN_STEPS.length, Math.floor((e - TL.runStart) / TL.perStep)));
  const showDisplay = surface === "run" && stepsDone >= RUN_STEPS.length;
  const showDoneNotif = e >= TL.doneNotif;

  // Auto-scroll the run page to reveal the display output.
  useEffect(() => {
    if (surface !== "run") return;
    const el = runScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: showDisplay ? el.scrollHeight : 0, behavior: reduce ? "auto" : "smooth" });
  }, [surface, showDisplay, stepsDone, reduce]);

  const cursor = cursorFor(e);
  const clicking = near(e, TL.orbClick) || near(e, TL.toastTap) || near(e, TL.backTap);
  const progress = Math.min(100, (e / TL.total) * 100);

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-black shadow-[0_30px_80px_-36px_rgba(0,0,0,0.8)]"
    >
      <div className="relative w-full bg-black" style={{ aspectRatio: `${DW} / ${DH}` }}>
        <ScaledShot width={DW} height={DH}>
          {onHome ? (
            <HomeShot
              orbActive={orbActive}
              showPrompt={showPrompt}
              showReply={showReply}
              showStartToast={showStartToast}
              showDoneNotif={showDoneNotif}
            />
          ) : (
            <RunDetailShot scrollRef={runScrollRef} stepsDone={stepsDone} showDisplay={showDisplay} />
          )}
        </ScaledShot>

        {!reduce && started && !ended && (
          <div
            className="pointer-events-none absolute z-20"
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
              transition: "left 680ms cubic-bezier(0.4,0,0.2,1), top 680ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {clicking && (
              <span className="absolute -left-2 -top-2 h-7 w-7 animate-ping rounded-full border border-white/70" />
            )}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white" className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
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
          className="text-white/90 outline-none transition-opacity hover:opacity-70"
        >
          {ended ? <ReplayGlyph /> : playing ? <PauseGlyph /> : <PlayGlyph />}
        </button>
        <div className="relative h-[2px] flex-1 rounded-full bg-white/20">
          <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <style>{`@keyframes sp-toast-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Home surface (mirrors the real app voice/home screen) ──────────────────────
function HomeShot({
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
    <div style={{ display: "flex", width: DW, height: DH, background: T.bg, fontFamily: FONT_BODY, color: T.ink, overflow: "hidden" }}>
      <Rail active="voice" />
      <main
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "48px 24px",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: 760,
            height: 760,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle closest-side, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.14) 70%, rgba(0,0,0,0) 100%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", width: 300, height: 300 }}>
          <Orb className="!h-full !w-full" staticRender />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-10%",
              borderRadius: "50%",
              transition: "opacity 500ms ease",
              opacity: orbActive ? 1 : 0,
              background: "radial-gradient(circle, rgba(108,216,255,0.4), transparent 60%)",
            }}
          />
        </div>

        <div style={{ minHeight: 24, fontSize: 14, color: T.ink3 }}>
          {showPrompt ? null : "Tap the orb to talk (or press ⌘ /)."}
        </div>

        {showPrompt && (
          <div style={{ width: "min(640px, 92%)", display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            <div style={{ fontSize: 13, color: T.ink3, textAlign: "center", lineHeight: 1.45, maxWidth: 520 }}>
              <span style={{ color: T.ink4 }}>You · </span>
              {HOME_PROMPT}
            </div>
            {showReply && (
              <div style={{ fontSize: 17, color: T.ink, lineHeight: 1.5, textAlign: "center", maxWidth: 600 }}>
                {HOME_REPLY}
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 12, color: T.ink4, letterSpacing: 0.4 }}>or to type: ⌘ K</div>

        {showStartToast && !showDoneNotif && (
          <AppToast tone="neutral" title={WORKFLOW_NAME} body="Started — running in the background." />
        )}
        {showDoneNotif && (
          <AppToast tone="gold" title={WORKFLOW_NAME} body="3 drafts ready. Pick one, ship." chips />
        )}
      </main>
    </div>
  );
}

function AppToast({
  tone,
  title,
  body,
  chips = false,
}: {
  tone: "neutral" | "gold";
  title: string;
  body: string;
  chips?: boolean;
}) {
  const gold = tone === "gold";
  return (
    <div
      style={{
        position: "absolute",
        bottom: 32,
        right: 32,
        width: 360,
        borderRadius: 12,
        padding: 16,
        background: T.surface,
        border: `1px solid ${gold ? "rgba(217,185,120,0.55)" : T.borderStrong}`,
        boxShadow: "0 18px 50px -16px rgba(0,0,0,0.7)",
        textAlign: "left",
        animation: "sp-toast-in 360ms cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: gold ? T.warm : T.cyanStrong }} />
        <span style={{ fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: T.ink3, fontWeight: 600 }}>
          Sirius
        </span>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 15, fontWeight: 500, color: T.ink }}>{title}</p>
      <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.45, color: T.ink2 }}>{body}</p>
      {chips && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DEMO_DRAFTS.map((d) => (
            <span
              key={d.id}
              style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, color: T.ink3 }}
            >
              {d.angle}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Run detail (mirrors app/app/workflows/runs/[id]) ────────────────────────────
function RunDetailShot({
  scrollRef,
  stepsDone,
  showDisplay,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  stepsDone: number;
  showDisplay: boolean;
}) {
  return (
    <div style={{ display: "flex", width: DW, height: DH, background: T.bg, fontFamily: FONT_BODY, color: T.ink, overflow: "hidden" }}>
      <Rail active="workflows" />
      <main style={{ flex: 1, minWidth: 0, height: DH, padding: "32px 48px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ maxWidth: 1120, width: "100%", margin: "0 auto", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, fontSize: 11.5, letterSpacing: "0.04em", flexShrink: 0 }}>
            <span style={{ color: T.ink3 }}>Workflows</span>
            <span style={{ color: T.ink4 }}>/</span>
            <span style={{ color: T.ink3 }}>{WORKFLOW_NAME}</span>
            <span style={{ color: T.ink4 }}>/</span>
            <span style={{ color: T.ink2 }}>run #{RUN_ID}</span>
          </div>

          {/* Header */}
          <header style={{ paddingBottom: 24, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            <Eyebrow accent="warm">Run</Eyebrow>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 30, color: T.ink, letterSpacing: "-0.02em", margin: "8px 0 12px" }}>
              {WORKFLOW_NAME}{" "}
              <span style={{ color: T.ink4, fontWeight: 400, fontSize: 18, fontFamily: FONT_BODY }}>#{RUN_ID}</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: showDisplay ? T.success : T.warning, display: "inline-block" }} />
                <span style={{ color: showDisplay ? T.success : T.warning, fontWeight: 500 }}>{showDisplay ? "Done" : "Running"}</span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "6px 14px",
                  background: T.warm,
                  color: T.bgDeep,
                  fontWeight: 500,
                  fontSize: 12.5,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                  <polygon points="2,1 9,5 2,9" />
                </svg>
                Run now
              </span>
            </div>
          </header>

          {/* Steps */}
          <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <div style={{ maxWidth: 760 }}>
              <section style={{ marginTop: 28 }}>
                <Eyebrow accent="dim">Steps</Eyebrow>
                <ol style={{ position: "relative", listStyle: "none", margin: "18px 0 0", padding: 0 }}>
                  <div aria-hidden style={{ position: "absolute", left: 6, top: 7, bottom: 20, width: 1, background: T.border }} />
                  {RUN_STEPS.map((step, i) => (
                    <PlanRow key={step.id} step={step} index={i} stepsDone={stepsDone} showDisplay={showDisplay} />
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PlanRow({
  step,
  index,
  stepsDone,
  showDisplay,
}: {
  step: RunStep;
  index: number;
  stepsDone: number;
  showDisplay: boolean;
}) {
  const completed = index < stepsDone;
  const running = index === stepsDone && !showDisplay;
  const pending = !completed && !running;
  const isDisplay = step.type === "display_to_user";
  const statusText = completed ? "done" : running ? "running…" : "pending";
  const statusColor = running ? T.warning : T.ink4;

  return (
    <li style={{ listStyle: "none", display: "flex", gap: 14, position: "relative", paddingBottom: 20 }}>
      <span
        aria-hidden
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          marginTop: 1,
          flexShrink: 0,
          zIndex: 1,
          boxSizing: "border-box",
          background: pending ? "var(--color-bg)" : running ? T.warning : T.success,
          border: pending ? `1.5px solid ${T.ink4}` : "2px solid var(--color-bg)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0, opacity: pending ? 0.55 : 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontSize: 13.5, color: T.ink, minWidth: 0 }}>
            {step.title} <span style={{ color: T.ink4, fontSize: 11 }}>{step.type}</span>
          </span>
          <span style={{ fontSize: 11, color: statusColor, flexShrink: 0 }}>{statusText}</span>
        </div>

        {isDisplay && completed && (
          <div
            style={{
              margin: "10px 0 0",
              padding: "10px 12px",
              background: T.surface,
              borderLeft: `2px solid ${T.warm}`,
              fontSize: 13,
              color: T.ink,
              borderRadius: "0 6px 6px 0",
            }}
          >
            <p style={{ margin: 0 }}>{DISPLAY_INTRO}</p>
            <div style={{ height: 1, background: T.border, margin: "10px 0" }} />
            {DEMO_DRAFTS.map((d, di) => {
              const paras = d.text.split("\n\n");
              return (
                <div key={d.id} style={{ marginTop: di === 0 ? 0 : 16 }}>
                  <p style={{ margin: "0 0 4px" }}>
                    <strong>Post {di + 1}:</strong> {paras[0]}
                  </p>
                  {paras.slice(1).map((p, pi) => (
                    <p key={pi} style={{ margin: "6px 0 0", whiteSpace: "pre-line", color: T.ink2 }}>
                      {p}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {completed && !isDisplay && (
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <details style={{ fontSize: 11.5 }}>
              <summary style={{ color: T.ink4, cursor: "pointer", fontFamily: FONT_BODY }}>input</summary>
            </details>
            <details style={{ fontSize: 11.5 }}>
              <summary style={{ color: T.ink4, cursor: "pointer", fontFamily: FONT_BODY }}>output</summary>
            </details>
          </div>
        )}
      </div>
    </li>
  );
}

// ── Cursor scripting (% of the player box, which matches design aspect) ──────────
function cursorFor(t: number): { x: number; y: number } {
  if (t < TL.orbClick) return { x: 53, y: 40 };
  if (t < TL.startToast) return { x: 53, y: 52 };
  if (t < TL.toastTap + 250) return { x: 87, y: 90 };
  if (t < TL.backTap) return { x: 50, y: 55 };
  if (t < TL.home2) return { x: 4, y: 44 };
  return { x: 87, y: 86 };
}

function near(t: number, mark: number) {
  return t >= mark - 70 && t <= mark + 240;
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
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 7a5 5 0 1 1-1.5-3.5" />
      <path d="M12 2v3h-3" />
    </svg>
  );
}
