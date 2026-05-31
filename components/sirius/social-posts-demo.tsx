"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import {
  DEMO_PHASES,
  DEMO_SOURCE,
  DEMO_ANGLES,
  DEMO_DRAFTS,
  type DemoPhase,
} from "@/lib/social-posts-demo";

type PhaseId = DemoPhase["id"];

export function SocialPostsDemo({ running }: { running: boolean }) {
  const reduce = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [openDraft, setOpenDraft] = useState<string | null>(null);

  // Reset whenever a run (re)starts.
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setPhaseIndex(reduce ? DEMO_PHASES.length - 1 : 0);
    }, 0);
    return () => window.clearTimeout(t);
  }, [running, reduce]);

  // Advance through the phases on their dwell timers.
  useEffect(() => {
    if (!running || reduce) return;
    if (phaseIndex >= DEMO_PHASES.length - 1) return;
    const t = window.setTimeout(
      () => setPhaseIndex((i) => Math.min(i + 1, DEMO_PHASES.length - 1)),
      DEMO_PHASES[phaseIndex].dwellMs,
    );
    return () => window.clearTimeout(t);
  }, [running, reduce, phaseIndex]);

  const phase = DEMO_PHASES[phaseIndex];
  const done = phase.id === "done";

  const reached = useMemo(() => {
    const order: PhaseId[] = ["trigger", "pull", "research", "draft", "done"];
    const idx = order.indexOf(phase.id);
    return (id: PhaseId) => order.indexOf(id) <= idx;
  }, [phase.id]);

  if (!running) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-10 w-full max-w-[560px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-deep)] text-left shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
      aria-live="polite"
    >
      {/* status bar */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: done ? "var(--color-success)" : "var(--color-state-listening-strong)",
          }}
        />
        <span className="text-[12px] font-medium text-[var(--color-ink-2)]">{phase.label}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-4)]">
          Sirius · home
        </span>
      </div>

      <div className="p-4">
        {!done ? (
          <ol className="flex flex-col gap-2.5">
            <Step active={phase.id === "pull"} done={reached("research")} label={`Read ${DEMO_SOURCE}`} />
            <Step active={phase.id === "research"} done={reached("draft")} label="Researched 3 angles">
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {DEMO_ANGLES.map((a) => (
                  <span key={a} className="rounded-md border border-[var(--color-border)] px-2 py-1 text-[10px] text-[var(--color-ink-3)]">
                    {a}
                  </span>
                ))}
              </div>
            </Step>
            <Step active={phase.id === "draft"} done={false} label="Drafting 3 posts in your voice" />
          </ol>
        ) : (
          <AnimatePresence>
            <motion.div
              key="notice"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* home-surface notification */}
              <div className="relative rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
                <div className="absolute -left-px top-3 bottom-3 w-[3px] rounded-full bg-[var(--color-accent)]" aria-hidden />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]">
                    Sirius · noticed · just now
                  </span>
                </div>
                <p className="mt-3 font-display text-[18px] leading-tight text-[var(--color-ink-1)]">
                  Three drafts ready. Pick one, ship.
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--color-ink-2)]">
                  Pulled from {DEMO_SOURCE}, researched 3 angles, written in your voice.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {DEMO_DRAFTS.map((d) => {
                    const open = openDraft === d.id;
                    return (
                      <div key={d.id} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-deep)]">
                        <button
                          type="button"
                          onClick={() => setOpenDraft(open ? null : d.id)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left focus-ring"
                        >
                          <span className="text-[12px] font-medium text-[var(--color-ink-1)]">{d.angle}</span>
                          <span className="ml-auto text-[var(--color-ink-4)]">{open ? "–" : "+"}</span>
                        </button>
                        {open && (
                          <p className="border-t border-[var(--color-border)] px-3 py-2.5 text-[12.5px] leading-[1.55] text-[var(--color-ink-2)]">
                            {d.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function Step({
  active,
  done,
  label,
  children,
}: {
  active: boolean;
  done: boolean;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex gap-2.5" style={{ opacity: active || done ? 1 : 0.45 }}>
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: done
            ? "var(--color-success)"
            : active
              ? "var(--color-state-listening-strong)"
              : "var(--color-ink-4)",
        }}
      />
      <div className="min-w-0">
        <span className="text-[12.5px] text-[var(--color-ink-1)]">{done ? `✓ ${label}` : label}</span>
        {children}
      </div>
    </li>
  );
}
