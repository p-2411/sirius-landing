"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";

import { Orb } from "@/components/sirius/orb";
import { Rail, ScaledShot, AppIcon } from "@/components/sirius/appui";
import { Eyebrow } from "@/components/sirius/appui/eyebrow";
import { T, FONT_BODY, FONT_DISPLAY } from "@/lib/app-theme";
import {
  WORKFLOW_NAME,
  DEMO_SOURCE,
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
  perStep: 700, // still running when we leave the run page
  backTap: 8000, // head home BEFORE the run finishes (~3 steps done)
  home2: 8300,
  doneNotif: 9500, // run finishes in the background → briefing pings home
  briefingExpand: 10700, // cursor hovers the briefing → it opens to the drafts
  total: 14200,
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

  const surface = surfaceFor(e);
  const onHome = surface === "home";
  const orbActive = e >= TL.orbClick && onHome && e < TL.runStart;
  const showPrompt = e >= TL.orbClick && e < TL.runStart;
  const showReply = e >= TL.reply && e < TL.runStart;
  const showStartToast = e >= TL.startToast && e < TL.runStart;
  const stepsDone = Math.max(0, Math.min(RUN_STEPS.length, Math.floor((e - TL.runStart) / TL.perStep)));
  const showDisplay = surface === "run" && stepsDone >= RUN_STEPS.length;
  const showBriefing = e >= TL.doneNotif;
  const briefingExpanded = e >= TL.briefingExpand;

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
              showBriefing={showBriefing}
              briefingExpanded={briefingExpanded}
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

      <style>{`@keyframes sp-notif-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes sp-toast-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

// ── Home surface (mirrors app/app/page.tsx: orb on top, tier-1 briefings below) ──
function HomeShot({
  orbActive,
  showPrompt,
  showReply,
  showStartToast,
  showBriefing,
  briefingExpanded,
}: {
  orbActive: boolean;
  showPrompt: boolean;
  showReply: boolean;
  showStartToast: boolean;
  showBriefing: boolean;
  briefingExpanded: boolean;
}) {
  return (
    <div style={{ display: "flex", width: DW, height: DH, background: T.bg, fontFamily: FONT_BODY, color: T.ink, overflow: "hidden" }}>
      <Rail active="voice" />
      <main style={{ position: "relative", flex: 1, minWidth: 0, height: DH, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Voice center — orb + transcript, fills the upper space */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            padding: "40px 24px",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "44%",
              width: 720,
              height: 720,
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
                <div style={{ fontSize: 17, color: T.ink, lineHeight: 1.5, textAlign: "center", maxWidth: 600 }}>{HOME_REPLY}</div>
              )}
            </div>
          )}

          <div style={{ fontSize: 12, color: T.ink4, letterSpacing: 0.4 }}>or to type: ⌘ K</div>
        </div>

        {/* Tier-1 briefing column — below the orb, exactly as the home screen */}
        {showBriefing && (
          <div style={{ flexShrink: 0, maxHeight: "56%", overflowY: "hidden", width: "100%" }}>
            <div style={{ width: "min(540px, 82%)", margin: "0 auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 40 }}>
              <BriefingCardShot expanded={briefingExpanded} />
            </div>
          </div>
        )}

        {/* Tier-2 ambient toast (run started) — bottom-right */}
        {showStartToast && !showBriefing && <ActivityToast name={WORKFLOW_NAME} />}
      </main>
    </div>
  );
}

// Tier 2 — copied from ActivityToasts.tsx (the "started" toast).
function ActivityToast({ name }: { name: string }) {
  const color = "var(--color-warning)";
  return (
    <div style={{ position: "absolute", bottom: 24, right: 24, zIndex: 50 }}>
      <div
        style={{
          width: 272,
          background: T.surface,
          border: `1px solid ${T.borderStrong}`,
          borderRadius: 12,
          boxShadow: "0 10px 26px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.16)",
          padding: "11px 12px",
          display: "flex",
          alignItems: "center",
          gap: 11,
          animation: "sp-toast-in 240ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `color-mix(in srgb, ${color} 18%, transparent)`,
            color,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: T.ink, fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.35 }}>
            {name}
          </div>
          <div style={{ color, fontSize: 11, fontWeight: 500, marginTop: 1 }}>Started</div>
        </div>
      </div>
    </div>
  );
}

// Tier 1 — copied from notifications/BriefingCard.tsx (collapsed → hover-expanded).
function BriefingCardShot({ expanded }: { expanded: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        maxHeight: expanded ? 420 : 210,
        borderRadius: 12,
        background: "linear-gradient(180deg, #3A3327, #342D23 40%)",
        border: "1px solid rgba(232,224,200,0.18)",
        boxShadow: expanded ? "0 20px 50px rgba(0,0,0,0.45)" : "inset 0 1px 0 rgba(246,239,223,0.06)",
        overflow: "hidden",
        transition: "max-height 320ms cubic-bezier(0.22,1,0.36,1), box-shadow 320ms ease",
        animation: "sp-notif-in 360ms cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 18px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ color: T.ink3, display: "inline-flex" }}>
            <AppIcon name="spark" size={14} />
          </span>
          <span style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: T.ink3, fontWeight: 500, whiteSpace: "nowrap" }}>
            {WORKFLOW_NAME} · just now
          </span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, color: T.ink3 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </span>
      </div>

      <h2 style={{ flexShrink: 0, fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 22, lineHeight: 1.2, color: T.ink, margin: "0 18px 10px" }}>
        3 LinkedIn drafts ready
      </h2>

      {!expanded ? (
        <div style={{ padding: "0 18px 18px" }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.ink2 }}>
            Three angles, written in your voice from <span style={{ color: T.ink }}>{DEMO_SOURCE}</span>. Pick one to ship.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DEMO_DRAFTS.map((d) => (
              <span key={d.id} style={{ border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 9px", fontSize: 11.5, color: T.ink3 }}>
                {d.angle}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden", padding: "0 18px 0", position: "relative" }}>
          {DEMO_DRAFTS.map((d, di) => {
            const paras = d.text.split("\n\n");
            return (
              <div key={d.id} style={{ marginTop: di === 0 ? 0 : 18 }}>
                <p style={{ margin: "0 0 6px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: T.warm, fontWeight: 600 }}>
                  Post {di + 1} · {d.angle}
                </p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: T.ink2 }}>{paras[0]}</p>
                {paras.slice(1).map((p, pi) => (
                  <p key={pi} style={{ margin: "6px 0 0", whiteSpace: "pre-line", fontSize: 13, lineHeight: 1.55, color: T.ink2 }}>
                    {p}
                  </p>
                ))}
              </div>
            );
          })}
          {/* bottom fade — there's more below the cap */}
          <div
            aria-hidden
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, pointerEvents: "none", background: "linear-gradient(180deg, rgba(52,45,35,0) 0%, #342D23 92%)" }}
          />
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, fontSize: 11.5, letterSpacing: "0.04em", flexShrink: 0 }}>
            <span style={{ color: T.ink3 }}>Workflows</span>
            <span style={{ color: T.ink4 }}>/</span>
            <span style={{ color: T.ink3 }}>{WORKFLOW_NAME}</span>
            <span style={{ color: T.ink4 }}>/</span>
            <span style={{ color: T.ink2 }}>run #{RUN_ID}</span>
          </div>

          <header style={{ paddingBottom: 24, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            <Eyebrow accent="warm">Run</Eyebrow>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 30, color: T.ink, letterSpacing: "-0.02em", margin: "8px 0 12px" }}>
              {WORKFLOW_NAME} <span style={{ color: T.ink4, fontWeight: 400, fontSize: 18, fontFamily: FONT_BODY }}>#{RUN_ID}</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: showDisplay ? T.success : T.warning, display: "inline-block" }} />
                <span style={{ color: showDisplay ? T.success : T.warning, fontWeight: 500 }}>{showDisplay ? "Done" : "Running"}</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "6px 14px", background: T.warm, color: T.bgDeep, fontWeight: 500, fontSize: 12.5 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                  <polygon points="2,1 9,5 2,9" />
                </svg>
                Run now
              </span>
            </div>
          </header>

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
          <div style={{ margin: "10px 0 0", padding: "10px 12px", background: T.surface, borderLeft: `2px solid ${T.warm}`, fontSize: 13, color: T.ink, borderRadius: "0 6px 6px 0" }}>
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
  if (t < TL.orbClick) return { x: 53, y: 38 };
  if (t < TL.startToast) return { x: 53, y: 50 };
  if (t < TL.toastTap + 250) return { x: 88, y: 93 };
  if (t < TL.backTap) return { x: 50, y: 50 };
  if (t < TL.home2) return { x: 4, y: 44 };
  return { x: 50, y: 62 };
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
