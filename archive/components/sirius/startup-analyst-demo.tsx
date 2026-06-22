"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AppIcon, AppPill, ChatPane, DagMini, Rail } from "@/components/sirius/appui";
import type { AppPillTone } from "@/components/sirius/appui";
import type { StartupAnalystDemoFile } from "@/lib/startup-analyst-demo";
import { cn } from "@/lib/utils";
import type { DagStep } from "./appui/dag-mini";

type AppDemoView = "chat" | "workflow" | "run" | "output";
type DemoRunStatus = "pending" | "running" | "completed";

const PIPELINE_STEPS: DagStep[] = [
  { id: "discover", type: "DISPLAY_TO_USER", title: "Banner Discover", col: 0, next: ["ha_search", "web_search"], state: "idle" },
  { id: "ha_search", type: "HTTP_REQUEST", title: "HA Search", col: 1, next: ["extract"], state: "idle" },
  { id: "web_search", type: "SEARCH_WEB", title: "Web Search", col: 1, next: ["extract"], state: "idle" },
  { id: "extract", type: "AGENT_TASK", title: "Extract Companies", col: 2, next: ["write_csv"], state: "idle" },
  { id: "write_csv", type: "AGENT_TASK", title: "Write CSV", col: 3, next: ["score_banner"], state: "idle" },
  { id: "score_banner", type: "DISPLAY_TO_USER", title: "Banner Score", col: 4, next: ["read_score"], state: "idle" },
  { id: "read_score", type: "READ_FILE", title: "Read CSV for Scoring", col: 5, next: ["score_python"], state: "idle" },
  { id: "score_python", type: "RUN_PYTHON", title: "Score Python", col: 6, next: ["write_scored"], state: "idle" },
  { id: "write_scored", type: "WRITE_FILE", title: "Write Scored CSV", col: 7, next: ["profiles_banner"], state: "idle" },
  { id: "profiles_banner", type: "DISPLAY_TO_USER", title: "Banner Profiles", col: 8, next: ["read_profiles"], state: "idle" },
  { id: "read_profiles", type: "READ_FILE", title: "Read CSV for Profiles", col: 9, next: ["write_profiles"], state: "idle" },
  { id: "write_profiles", type: "AGENT_TASK", title: "Write Profiles", col: 10, next: ["report_banner"], state: "idle" },
  { id: "report_banner", type: "DISPLAY_TO_USER", title: "Banner Report", col: 11, next: ["list_companies", "read_report"], state: "idle" },
  { id: "list_companies", type: "LIST_DIRECTORY", title: "List Companies", col: 12, next: ["generate_report"], state: "idle" },
  { id: "read_report", type: "READ_FILE", title: "Read CSV for Report", col: 12, next: ["generate_report"], state: "idle" },
  { id: "generate_report", type: "AGENT_TASK", title: "Generate Report", col: 13, next: ["done"], state: "idle" },
  { id: "done", type: "DISPLAY_TO_USER", title: "Pipeline Done", col: 14, next: [], state: "idle" },
];

const PHASES = [
  { label: "Discovering companies", range: [0, 4] },
  { label: "Scoring conviction", range: [5, 8] },
  { label: "Writing company profiles", range: [9, 11] },
  { label: "Generating report", range: [12, 15] },
  { label: "Pipeline Done", range: [16, 16] },
] as const;

// Real workspace folders the run writes to (not invented product sections).
const GROUP_LABELS: Record<StartupAnalystDemoFile["group"], string> = {
  report: "reports/",
  data: "data/",
  companies: "companies/",
  founders: "founders/",
};

function buildSteps(activeIndex: number, completed: boolean): DagStep[] {
  return PIPELINE_STEPS.map((step, index) => {
    let state: DagStep["state"] = "idle";
    if (completed || index < activeIndex) state = "done";
    if (!completed && index === activeIndex) state = "running";
    return { ...step, state };
  });
}

function currentPhase(activeIndex: number, completed: boolean) {
  if (completed) return "Pipeline Done";
  return PHASES.find((phase) => activeIndex >= phase.range[0] && activeIndex <= phase.range[1])?.label ?? PHASES[0].label;
}

function demoTone(completed: boolean, running: boolean): AppPillTone {
  if (completed) return "done";
  if (running) return "running";
  return "awaiting";
}

function demoStatusLabel(completed: boolean, running: boolean) {
  if (completed) return "Done";
  if (running) return "Running";
  return "Awaiting input";
}

function runNodeStatus(index: number, activeIndex: number, completed: boolean): DemoRunStatus {
  if (completed || index < activeIndex) return "completed";
  if (index === activeIndex) return "running";
  return "pending";
}

function runOutputForStep(
  id: string,
  startupCount: number,
  companyCount: number,
  founderCount: number,
) {
  const outputs: Record<string, { text?: string; path?: string; rows?: number; files?: number }> = {
    discover: { text: "Banner [#4] — Discovering startups from HN and web search..." },
    ha_search: { text: `${startupCount} candidates returned from Hacker News search.` },
    web_search: { text: "Web search enriched funding, GitHub, and product positioning signals." },
    extract: { text: `${startupCount} company records extracted and normalized.` },
    write_csv: { path: "data/startups.csv", rows: startupCount },
    score_banner: { text: "Banner [#5] — Scoring conviction across team, market, and traction..." },
    read_score: { path: "data/startups.csv", rows: startupCount },
    score_python: { text: "Scores calculated: high priority, watching, and filtered-out cohorts." },
    write_scored: { path: "data/startups.csv", rows: startupCount },
    profiles_banner: { text: "Banner [#6] — Writing company and founder profiles..." },
    read_profiles: { path: "data/startups.csv", rows: startupCount },
    write_profiles: { files: companyCount + founderCount, text: `${companyCount} company profiles and ${founderCount} founder briefs written.` },
    report_banner: { text: "Banner [#7] — Generating weekly dealflow report..." },
    list_companies: { files: companyCount },
    read_report: { path: "data/startups.csv", rows: startupCount },
    generate_report: { path: "reports/2026-05-17.md", text: "Weekly dealflow report generated with ranked opportunities and red flags." },
    done: { text: "Pipeline Done. Report, CSV, company profiles, and founder profiles are ready." },
  };

  return outputs[id] ?? { text: "Completed." };
}

function countCsvRows(file?: StartupAnalystDemoFile) {
  if (!file) return 0;
  return Math.max(0, file.content.trim().split(/\r?\n/).length - 1);
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={index}>{part.slice(1, -1)}</code>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="sad-markdown">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (/^---+$/.test(trimmed)) return <hr key={index} />;

        if (trimmed.startsWith("|")) {
          const rows = trimmed
            .split("\n")
            .map((row) => row.trim())
            .filter((row) => row.startsWith("|") && !/^\|?\s*:?-{3,}/.test(row));

          return (
            <div key={index} className="sad-table-wrap">
              <table>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row
                        .replace(/^\||\|$/g, "")
                        .split("|")
                        .map((cell, cellIndex) =>
                          rowIndex === 0 ? (
                            <th key={cellIndex}>{cell.trim()}</th>
                          ) : (
                            <td key={cellIndex}>{cell.trim()}</td>
                          ),
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={index}>
              {trimmed.split("\n").map((line, itemIndex) => (
                <li key={itemIndex}>
                  <InlineMarkdown text={line.replace(/^-\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s+/.test(trimmed)) {
          return (
            <ol key={index}>
              {trimmed.split("\n").map((line, itemIndex) => (
                <li key={itemIndex}>
                  <InlineMarkdown text={line.replace(/^\d+\.\s+/, "")} />
                </li>
              ))}
            </ol>
          );
        }

        const lines = trimmed.split("\n");
        const headingMatch = lines[0].match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2];
          const heading =
            level === 1 ? <h1>{text}</h1> : level === 2 ? <h2>{text}</h2> : level === 3 ? <h3>{text}</h3> : <h4>{text}</h4>;

          if (lines.length === 1) return <div key={index}>{heading}</div>;

          return (
            <div key={index}>
              {heading}
              <p>
                {lines.slice(1).map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {lineIndex > 0 && <br />}
                    <InlineMarkdown text={line} />
                  </span>
                ))}
              </p>
            </div>
          );
        }

        return (
          <p key={index}>
            {trimmed.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                <InlineMarkdown text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function CsvPreview({ content }: { content: string }) {
  const rows = content
    .trim()
    .split(/\r?\n/)
    .map(splitCsvLine);
  const [header, ...body] = rows;

  return (
    <div className="sad-csv">
      <table>
        <thead>
          <tr>
            {header.map((cell) => (
              <th key={cell}>{cell.replaceAll("_", " ")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {header.map((_, cellIndex) => (
                <td key={cellIndex}>{row[cellIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FilePreview({ file }: { file: StartupAnalystDemoFile }) {
  if (file.kind === "csv") return <CsvPreview content={file.content} />;
  return <MarkdownPreview content={file.content} />;
}

export function StartupAnalystDemo({ files }: { files: StartupAnalystDemoFile[] }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"chat" | "running" | "output">("chat");
  const [inView, setInView] = useState(true);
  // Sticky: flips true the first time the demo scrolls into view, so the
  // directed film plays in view (and only once).
  const [started, setStarted] = useState(false);
  // Remount key — "Replay" is a website control, not an app feature.
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: [0.25, 0.5] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const vis = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );
    vis.observe(el);
    return () => vis.disconnect();
  }, []);

  return (
    <article
      id="startup-analyst-demo"
      ref={rootRef}
      data-revealed={revealed ? "true" : "false"}
      className="sad-root relative"
    >
      {/* The card is just the app window. The real /demo app runs inside it,
          contained, and the frame grows when a run starts. No website chrome. */}
      <div className="sad-card" data-mode={phase}>
        <StartupAnalystAppDemo
          key={runKey}
          files={files}
          contained
          autoplay
          start={started}
          onPhaseChange={setPhase}
        />
      </div>

      {/* Website/demo layer — deliberately styled as the site, not the app,
          so it never reads as product chrome. */}
      <div className="sad-web">
        <span className="sad-web-hint">
          {phase === "output"
            ? "This used to be your Monday morning. Sirius just did it — and it runs the exact same way every time, for a fraction of the cost."
            : "A live look at the Sirius desktop app."}
        </span>
        <div className="sad-web-actions">
          {phase === "output" && (
            <button
              type="button"
              className="btn btn-ghost btn-field text-[13px]"
              onClick={() => {
                setRunKey((k) => k + 1);
                setPhase("chat");
              }}
            >
              ↻ Replay
            </button>
          )}
          <a href="#cta" className="btn btn-primary btn-field text-[13px]">
            Get Sirius
          </a>
        </div>
      </div>

      {phase !== "chat" && !inView && (
        <button
          type="button"
          className="sad-pill"
          data-ready={phase === "output" ? "true" : "false"}
          onClick={() =>
            rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          <span className="sad-pill-dot" />
          {phase === "output"
            ? "Dealflow packet ready — view"
            : "Sirius is finishing your dealflow packet…"}
        </button>
      )}

      <style>{`
        .sad-root {
          scroll-margin-top: 5rem;
        }
        .sad-card {
          --sad-card-h: 600px;
          position: relative;
          width: 100%;
          height: var(--sad-card-h);
          overflow: hidden;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-lg);
          background: var(--color-surface-deep);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
          opacity: 0;
          transform: translateY(18px) scale(0.97);
          transition:
            height 560ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 520ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sad-card[data-mode="running"],
        .sad-card[data-mode="output"] {
          --sad-card-h: 820px;
        }
        .sad-root[data-revealed="true"] .sad-card {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .sad-card > * {
          height: 100%;
        }
        @media (max-width: 760px) {
          .sad-card {
            --sad-card-h: 640px;
            border-radius: var(--radius-md);
          }
          .sad-card[data-mode="running"],
          .sad-card[data-mode="output"] {
            --sad-card-h: 760px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-card {
            transition: opacity 1ms linear, transform 1ms linear;
          }
        }
        .sad-pill {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          max-width: min(86vw, 360px);
          padding: 12px 16px;
          border: 1px solid var(--color-border-strong);
          border-radius: 999px;
          color: var(--color-ink-1);
          background: var(--color-surface-deep);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
          font: inherit;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          animation: sad-pill-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sad-pill-dot {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--color-state-listening);
          animation: sirius-pulse 1.4s ease-in-out infinite;
        }
        .sad-pill[data-ready="true"] {
          border-color: rgba(var(--color-accent-rgb), 0.6);
        }
        .sad-pill[data-ready="true"] .sad-pill-dot {
          background: var(--color-accent);
        }
        @keyframes sad-pill-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-pill,
          .sad-pill-dot { animation: none !important; }
        }
        /* Website layer — sits outside the app card, on the page surface. */
        .sad-web {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .sad-web-hint {
          max-width: 52ch;
          color: var(--color-ink-3);
          font-size: 13px;
        }
        .sad-web-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
      `}</style>
    </article>
  );
}

// Plain-language labels for the real pipeline nodes (banners are phase headers).
const NODE_LABEL: Record<string, string> = {
  ha_search: "Searched Hacker News",
  web_search: "Searched the web",
  extract: "Extracted companies",
  write_csv: "Saved companies → data/startups.csv",
  read_score: "Read data/startups.csv",
  score_python: "Scored conviction",
  write_scored: "Saved scores → data/startups.csv",
  read_profiles: "Read data/startups.csv",
  write_profiles: "Wrote company & founder profiles",
  list_companies: "Listed companies",
  read_report: "Read data/startups.csv",
  generate_report: "Wrote the weekly report",
};

// A better-but-real run page: the real step/node/output model, rendered as a
// phase timeline + a "produced so far" rail. Raw input/output stays available
// behind a disclosure for fidelity. Shippable into the real app.
function RunTimeline({
  files,
  activeIndex,
  completed,
  running,
  onCancel,
}: {
  files: StartupAnalystDemoFile[];
  activeIndex: number;
  completed: boolean;
  running: boolean;
  onCancel: () => void;
}) {
  const csvFile = files.find((f) => f.kind === "csv");
  const startupCount = countCsvRows(csvFile);
  const companyFiles = files.filter((f) => f.group === "companies");
  const founderFiles = files.filter((f) => f.group === "founders");
  const reportFiles = files.filter((f) => f.group === "report");

  const phases = PHASES.filter((p) => p.label !== "Pipeline Done").map((p) => {
    const [lo, hi] = p.range;
    const state =
      completed || activeIndex > hi
        ? "done"
        : !completed && activeIndex >= lo && activeIndex <= hi
          ? "active"
          : "idle";
    const nodes = PIPELINE_STEPS.map((s, i) => ({ s, i }))
      .filter(({ s, i }) => i >= lo && i <= hi && s.type !== "DISPLAY_TO_USER")
      .map(({ s, i }) => {
        const status = runNodeStatus(i, activeIndex, completed);
        const out =
          status === "completed"
            ? runOutputForStep(s.id, startupCount, companyFiles.length, founderFiles.length)
            : null;
        const input =
          i === 0
            ? { query: "AI infrastructure startups", sources: ["Hacker News", "web search"] }
            : { from: PIPELINE_STEPS[Math.max(0, i - 1)].id };
        return { id: s.id, label: NODE_LABEL[s.id] ?? s.title, status, out, input };
      });
    return { label: p.label, state, nodes };
  });

  const produced: { folder: string; items: string[] }[] = [];
  if (completed || activeIndex >= 4) produced.push({ folder: "data/", items: ["startups.csv"] });
  if ((completed || activeIndex >= 11) && companyFiles.length)
    produced.push({ folder: "companies/", items: companyFiles.map((f) => f.name) });
  if ((completed || activeIndex >= 11) && founderFiles.length)
    produced.push({ folder: "founders/", items: founderFiles.map((f) => f.name) });
  if ((completed || activeIndex >= 15) && reportFiles.length)
    produced.push({ folder: "reports/", items: reportFiles.map((f) => f.name) });

  return (
    <section className="sad-rt" aria-label="Run">
      <header className="sad-rt-head">
        <div>
          <span className="sad-rt-eyebrow">Run</span>
          <h2>Startup analyst</h2>
        </div>
        <div className="sad-rt-status">
          <span className={cn("sad-rt-pill", completed && "is-done", running && "is-running")}>
            {completed ? "Done" : running ? currentPhase(activeIndex, completed) : "Ready"}
          </span>
          {running && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </header>

      <div className="sad-rt-body">
        <ol className="sad-rt-timeline">
          {phases.map((ph) => (
            <li key={ph.label} className="sad-rt-phase" data-state={ph.state}>
              <div className="sad-rt-phase-head">
                <span className="sad-rt-mark" />
                <strong>{ph.label}</strong>
              </div>
              <ul className="sad-rt-nodes">
                {ph.nodes.map((n) => (
                  <li key={n.id} className="sad-rt-node" data-status={n.status}>
                    <span className="sad-rt-dot" />
                    <div className="sad-rt-node-main">
                      <span className="sad-rt-label">{n.label}</span>
                      {n.out?.text && <p className="sad-rt-out">{n.out.text}</p>}
                      {n.out?.path && (
                        <span className="sad-rt-file">
                          <AppIcon name="doc" size={12} />
                          {n.out.path}
                        </span>
                      )}
                      {n.status === "completed" && (
                        <details className="sad-rt-details">
                          <summary>input / output</summary>
                          <pre>{JSON.stringify({ input: n.input, output: n.out }, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <aside className="sad-rt-rail" aria-label="Produced so far">
          <header>{completed ? "Output" : "Producing"}</header>
          {produced.length === 0 ? (
            <p className="sad-rt-muted">Nothing written yet…</p>
          ) : (
            produced.map((g) => (
              <div key={g.folder} className="sad-rt-grp">
                <p>{g.folder}</p>
                {g.items.map((it) => (
                  <span key={it} className="sad-rt-file">
                    <AppIcon name="doc" size={12} />
                    {it}
                  </span>
                ))}
              </div>
            ))
          )}
        </aside>
      </div>
    </section>
  );
}

export function StartupAnalystAppDemo({
  files,
  contained = false,
  onPhaseChange,
  autoplay = false,
  start = false,
}: {
  files: StartupAnalystDemoFile[];
  /** Rendered inside the landing card (vs. the full-screen /demo route). */
  contained?: boolean;
  /** Reports the app's current phase so the landing frame can grow/shrink. */
  onPhaseChange?: (phase: "chat" | "running" | "output") => void;
  /** Directed-film mode: no interaction, the sequence plays itself. */
  autoplay?: boolean;
  /** Gate that flips true once the demo is on screen (so it plays in view). */
  start?: boolean;
}) {
  const [view, setView] = useState<AppDemoView>(() => (contained ? "chat" : "workflow"));
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const reportFile = files.find((file) => file.group === "report") ?? files[0];
  const [activeFileId, setActiveFileId] = useState(reportFile?.id ?? "");
  const activeFile = files.find((file) => file.id === activeFileId) ?? reportFile;
  const companyCount = files.filter((file) => file.group === "companies").length;
  const founderCount = files.filter((file) => file.group === "founders").length;
  const steps = useMemo(() => buildSteps(activeIndex, completed), [activeIndex, completed]);
  const phase = currentPhase(activeIndex, completed);
  const tone = demoTone(completed, running);
  const statusLabel = demoStatusLabel(completed, running);

  const groupedFiles = useMemo(() => {
    return files.reduce<Record<StartupAnalystDemoFile["group"], StartupAnalystDemoFile[]>>(
      (acc, file) => {
        acc[file.group].push(file);
        return acc;
      },
      { report: [], data: [], companies: [], founders: [] },
    );
  }, [files]);

  useEffect(() => {
    if (!running) return;

    // In the landing card, heavier AGENT_TASK steps dwell ~2× longer so the
    // "thinking" beats land; the full /demo route stays uniform.
    const stepType = PIPELINE_STEPS[activeIndex]?.type;
    const stepDelay = contained && stepType === "AGENT_TASK" ? 1000 : 360;

    const timeout = window.setTimeout(() => {
      if (activeIndex >= PIPELINE_STEPS.length - 1) {
        setCompleted(true);
        setRunning(false);
        return;
      }
      setActiveIndex((current) => current + 1);
    }, stepDelay);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, running, contained]);

  useEffect(() => {
    if (view !== "run" || !completed || running) return;

    const timeout = window.setTimeout(() => {
      setView("output");
    }, 1100);

    return () => window.clearTimeout(timeout);
  }, [completed, running, view]);

  useEffect(() => {
    onPhaseChange?.(view === "chat" ? "chat" : view === "output" ? "output" : "running");
  }, [view, onPhaseChange]);

  // Directed film: once on screen, let the viewer read the "ask", then it runs
  // itself — no interaction. Reduced-motion jumps straight to the payoff.
  useEffect(() => {
    if (!autoplay || !start || view !== "workflow" || running || completed) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(
      () => {
        if (reduce) {
          setActiveIndex(PIPELINE_STEPS.length - 1);
          setCompleted(true);
          setRunning(false);
          setView("output");
        } else {
          runWorkflow();
        }
      },
      reduce ? 0 : 1700,
    );
    return () => window.clearTimeout(t);
  }, [autoplay, start, view, running, completed]);

  useEffect(() => {
    if (!contained) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || view === "chat") return;
      setView("chat");
      setRunning(false);
      setCompleted(false);
      setActiveIndex(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contained, view]);

  function openWorkflow() {
    setView("workflow");
    setCompleted(false);
    setActiveIndex(0);
    setRunning(false);
  }

  function runWorkflow() {
    setView("run");
    setCompleted(false);
    setActiveIndex(0);
    setRunning(true);
  }

  function resetWorkflow() {
    setView(contained ? "chat" : "workflow");
    setRunning(false);
    setCompleted(false);
    setActiveIndex(0);
  }

  function returnToLandingDemo() {
    window.location.assign("/#startup-analyst-demo");
  }

  // The landing card's entry state: a pre-filled, one-gesture chat send.
  const chatEntry = view === "chat";

  const assistantText = completed
    ? `Done. I generated the report, scored CSV, ${companyCount} company profiles, and ${founderCount} founder briefs.`
    : running
      ? "On it — running it now. Watch the steps, or keep scrolling and I'll ping you when it's done."
      : "Ready. This workflow will discover, score, profile, and package this week's AI infrastructure dealflow.";

  return (
    <main className={cn("sad-app-demo", contained && "sad-app-demo--contained")}>
      {chatEntry ? (
        <div className="sad-app-chat-entry">
          <ChatPane
            header="Startup Analyst"
            subtitle="Talk to Sirius"
            prefill="Sirius, take me to the startup analyst workflow."
            pulseSend
            onSend={openWorkflow}
            messages={[
              {
                role: "assistant",
                text: "I can take you to the startup analyst workflow. It finds promising AI infrastructure startups, scores them, drafts the company and founder notes, and puts a weekly report together for you.",
              },
            ]}
          />
        </div>
      ) : (
        <>
          <Rail active="workflows" />

          <div className="sad-app-main">
        <header className="sad-app-topbar">
          <nav className="sad-app-breadcrumb" aria-label="Breadcrumb">
            <span>Workflows</span>
            <span>/</span>
            {view === "workflow" ? (
              <strong>Startup analyst</strong>
            ) : (
              <>
                <span>Startup analyst</span>
                <span>/</span>
                <strong>run #17</strong>
              </>
            )}
          </nav>

          <div className="sad-app-title-row">
            <div className="sad-app-title-copy">
              <h1>Startup analyst</h1>
              <div className="sad-app-meta">
                <AppPill tone={tone} label={statusLabel} />
                {!contained && (
                  <>
                    <span>
                      <AppIcon name="arrow" size={12} />
                      Manual trigger
                    </span>
                    <span>{PIPELINE_STEPS.length} steps · {completed ? "last run now" : "ready"}</span>
                  </>
                )}
              </div>
            </div>

            <div className="sad-app-actions">
              {!contained && (
                <button type="button" className="sad-app-ghost-button" onClick={returnToLandingDemo}>
                  Back to landing
                </button>
              )}
              <button type="button" className="sad-app-run-button" onClick={runWorkflow} disabled={running}>
                <AppIcon name={running ? "dots" : "play"} size={12} stroke="currentColor" />
                {running ? "Running" : "Run now"}
              </button>
            </div>
          </div>
        </header>

        {view === "workflow" ? (
          <>
            <section className="sad-app-workspace" aria-label="Startup analyst workflow">
              <div className="sad-app-flow-pane">
                <div className="sad-app-pane-header">
                  <span>Flow</span>
                  <strong>{phase}</strong>
                </div>
                <div className="sad-app-dag-canvas">
                  <DagMini steps={steps} />
                </div>
              </div>

              <ChatPane
                header="Chat with this workflow"
                messages={[
                  { role: "user", text: "Run the startup analyst workflow." },
                  { role: "assistant", text: assistantText },
                ]}
              />
            </section>

            <footer className="sad-app-runs" aria-label="Recent runs">
              <div className="sad-app-runs-head">
                <span>Recent runs</span>
                {completed && (
                  <button type="button" onClick={() => setView("output")}>
                    Open generated output
                    <AppIcon name="arrow" size={13} />
                  </button>
                )}
              </div>
              <div className="sad-app-run-strip">
                <span>
                  <AppPill tone={tone} label={statusLabel} />
                  <strong>now</strong>
                  <em>{running ? "-" : completed ? "7s" : "-"}</em>
                </span>
                <span>
                  <AppPill tone="done" label="Done" />
                  <strong>1w ago</strong>
                  <em>2m 18s</em>
                </span>
              </div>
            </footer>
          </>
        ) : view === "run" ? (
          <RunTimeline
            files={files}
            activeIndex={activeIndex}
            completed={completed}
            running={running}
            onCancel={resetWorkflow}
          />
        ) : (
          <section
            className={cn("sad-app-output", contained && "sad-app-output--reveal")}
            aria-label="Generated startup analyst output"
          >
            <aside className="sad-app-files" aria-label="Generated files">
              <div className="sad-app-output-summary">
                <span>Run output</span>
                <strong>{files.length} files written to the workspace</strong>
              </div>
              {(Object.keys(groupedFiles) as StartupAnalystDemoFile["group"][]).map((group) => (
                groupedFiles[group].length > 0 && (
                  <div key={group} className="sad-app-file-group">
                    <p>{GROUP_LABELS[group]}</p>
                    {groupedFiles[group].map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        aria-current={activeFile?.id === file.id ? "true" : undefined}
                        onClick={() => setActiveFileId(file.id)}
                      >
                        <AppIcon name={file.kind === "csv" ? "table" : "doc"} size={14} />
                        <span>{file.name}</span>
                      </button>
                    ))}
                  </div>
                )
              ))}
            </aside>

            <div className="sad-app-preview-pane" aria-live="polite">
              <header>
                <div>
                  <span>{activeFile?.path ?? "output"}</span>
                  <h2>{activeFile?.name ?? "Generated output"}</h2>
                </div>
                {contained ? (
                  <button type="button" onClick={resetWorkflow}>
                    ← Back
                  </button>
                ) : (
                  <button type="button" onClick={() => setView("workflow")}>
                    Back to workflow
                  </button>
                )}
              </header>
              {activeFile ? <FilePreview file={activeFile} /> : <div className="sad-empty">No demo files found.</div>}
            </div>
          </section>
        )}
          </div>
        </>
      )}

      <style>{`
        .sad-app-demo {
          height: 100svh;
          display: flex;
          overflow: hidden;
          background: var(--color-bg);
          color: var(--color-ink-1);
        }
        /* Contained: same app, sized to the landing card instead of the viewport,
           with tighter density so it reads right at card scale. */
        .sad-app-demo--contained {
          height: 100%;
        }
        .sad-app-demo--contained .sad-app-topbar {
          padding: 16px 24px 14px;
        }
        .sad-app-demo--contained .sad-app-title-copy h1 {
          font-size: 26px;
        }
        .sad-app-demo--contained .sad-app-workspace {
          padding: 14px 24px;
          gap: 14px;
        }
        .sad-app-demo--contained .sad-app-runs {
          padding: 12px 24px 16px;
        }
        .sad-app-demo--contained .sad-app-actions a,
        .sad-app-demo--contained .sad-app-ghost-button,
        .sad-app-demo--contained .sad-app-run-button {
          height: 38px;
        }
        .sad-app-output--reveal {
          position: relative;
          grid-template-rows: minmax(0, 1fr) auto;
          animation: sad-reveal 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sad-app-output--reveal::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(105deg, transparent 40%, rgba(var(--color-accent-rgb), 0.16) 50%, transparent 60%);
          transform: translateX(-100%);
          animation: sad-sweep 900ms ease 120ms 1 forwards;
        }
        @keyframes sad-reveal {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sad-sweep { to { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) {
          .sad-app-output--reveal,
          .sad-app-output--reveal::after { animation: none !important; }
        }
        /* Run timeline + result rail — real model, better presentation. */
        .sad-rt {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sad-rt-head {
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .sad-rt-eyebrow {
          display: inline-flex;
          color: var(--color-accent);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-rt-head h2 {
          margin: 6px 0 0;
          color: var(--color-ink-1);
          font-family: var(--font-title);
          font-size: 24px;
          font-weight: 400;
        }
        .sad-rt-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sad-rt-pill {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 12px;
          border: 1px solid var(--color-border-strong);
          border-radius: 999px;
          color: var(--color-ink-2);
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .sad-rt-pill.is-running { color: var(--color-state-listening); }
        .sad-rt-pill.is-done { color: var(--color-success); }
        .sad-rt-status button {
          border: 1px solid var(--color-border);
          border-radius: 999px;
          padding: 5px 12px;
          color: var(--color-ink-3);
          background: transparent;
          font-size: 12px;
          cursor: pointer;
        }
        .sad-rt-status button:hover {
          color: var(--color-ink-1);
          border-color: var(--color-border-strong);
        }
        .sad-rt-body {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
          overflow: hidden;
        }
        .sad-rt-timeline {
          margin: 0;
          padding: 16px 24px 28px;
          list-style: none;
          overflow: auto;
        }
        .sad-rt-phase {
          position: relative;
          padding-left: 22px;
        }
        .sad-rt-phase::before {
          content: "";
          position: absolute;
          left: 5px;
          top: 20px;
          bottom: -8px;
          width: 2px;
          background: var(--color-border);
        }
        .sad-rt-phase:last-child::before { display: none; }
        .sad-rt-phase-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0 8px;
        }
        .sad-rt-mark {
          position: absolute;
          left: 0;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          border: 2px solid var(--color-border-strong);
          background: var(--color-surface-deep);
        }
        .sad-rt-phase[data-state="active"] .sad-rt-mark { border-color: var(--color-state-listening); }
        .sad-rt-phase[data-state="done"] .sad-rt-mark {
          border-color: var(--color-success);
          background: var(--color-success);
        }
        .sad-rt-phase-head strong {
          color: var(--color-ink-1);
          font-size: 13px;
          font-weight: 600;
        }
        .sad-rt-phase[data-state="idle"] .sad-rt-phase-head strong { color: var(--color-ink-3); }
        .sad-rt-nodes {
          margin: 0 0 6px;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sad-rt-node {
          display: flex;
          gap: 10px;
          opacity: 0.5;
        }
        .sad-rt-node[data-status="running"],
        .sad-rt-node[data-status="completed"] { opacity: 1; }
        .sad-rt-dot {
          flex-shrink: 0;
          margin-top: 6px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--color-ink-4);
        }
        .sad-rt-node[data-status="running"] .sad-rt-dot {
          background: var(--color-state-listening);
          animation: sirius-pulse 1.4s ease-in-out infinite;
        }
        .sad-rt-node[data-status="completed"] .sad-rt-dot { background: var(--color-success); }
        .sad-rt-node-main { min-width: 0; }
        .sad-rt-label { color: var(--color-ink-1); font-size: 13px; }
        .sad-rt-out {
          margin: 5px 0 0;
          border-left: 2px solid var(--color-accent);
          padding: 4px 0 4px 10px;
          color: var(--color-ink-2);
          font-size: 12.5px;
          line-height: 1.5;
        }
        .sad-rt-file {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          color: var(--color-ink-3);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .sad-rt-details { margin-top: 6px; font-size: 11.5px; }
        .sad-rt-details summary { color: var(--color-ink-4); cursor: pointer; }
        .sad-rt-details pre {
          margin: 6px 0 0;
          max-height: 160px;
          overflow: auto;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 10px;
          color: var(--color-ink-2);
          background: var(--color-surface-deep);
          font-family: var(--font-sans);
          font-size: 11px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .sad-rt-rail {
          min-height: 0;
          overflow: auto;
          border-left: 1px solid var(--color-border);
          background: var(--color-surface-deep);
          padding: 16px;
        }
        .sad-rt-rail > header {
          margin-bottom: 12px;
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-rt-grp { margin-bottom: 14px; }
        .sad-rt-grp p {
          margin: 0 0 6px;
          color: var(--color-ink-3);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .sad-rt-grp .sad-rt-file { display: flex; margin-top: 4px; color: var(--color-ink-2); }
        .sad-rt-muted { margin: 0; color: var(--color-ink-4); font-size: 12px; }
        .sad-app-demo--contained .sad-rt-head { padding: 14px 20px; }
        .sad-app-demo--contained .sad-rt-timeline { padding: 14px 20px 22px; }
        .sad-app-demo--contained .sad-rt-head h2 { font-size: 20px; }
        @media (max-width: 760px) {
          .sad-rt-body { grid-template-columns: 1fr; }
          .sad-rt-rail { border-left: 0; border-top: 1px solid var(--color-border); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-rt-node[data-status="running"] .sad-rt-dot { animation: none !important; }
        }
        /* Entry state: just the chat, filling the card — no rail, no topbar. */
        .sad-app-chat-entry {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
        }
        .sad-app-chat-entry .sad-app-breadcrumb { flex-shrink: 0; margin-bottom: 0; }
        .sad-chat-entry-pane {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
        }
        .sad-chat-entry-pane > * {
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 760px) {
          .sad-app-chat-entry {
            padding: 14px;
          }
        }
        .sad-app-main {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sad-app-topbar {
          flex-shrink: 0;
          padding: 24px 48px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .sad-app-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 12.5px;
        }
        .sad-app-breadcrumb span {
          color: var(--color-ink-3);
          font-weight: 500;
        }
        .sad-app-breadcrumb strong {
          color: var(--color-ink-2);
          font-weight: 500;
        }
        .sad-app-title-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .sad-app-title-copy {
          min-width: 0;
          flex: 1;
        }
        .sad-app-title-copy h1 {
          margin: 0;
          color: var(--color-ink-1);
          font-family: var(--font-title);
          font-size: 38px;
          font-weight: 400;
          letter-spacing: -0.005em;
          line-height: 1.1;
        }
        .sad-app-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 10px;
        }
        .sad-app-meta > span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-ink-3);
          font-size: 12.5px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
        }
        .sad-app-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .sad-app-actions a,
        .sad-app-ghost-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 0 14px;
          color: var(--color-ink-2);
          background: transparent;
          font-size: 13px;
          font-weight: 500;
        }
        .sad-app-actions a:hover,
        .sad-app-ghost-button:hover {
          border-color: var(--color-border-strong);
          color: var(--color-ink-1);
          background: rgba(244, 236, 219, 0.04);
        }
        .sad-app-run-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 44px;
          border: 0;
          border-radius: 8px;
          padding: 0 16px;
          color: var(--color-bg);
          background: var(--color-accent);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .sad-app-run-button:hover {
          background: var(--color-accent-strong);
        }
        .sad-app-run-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }
        .sad-app-demo * {
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--color-accent-rgb), 0.48) rgba(20, 17, 13, 0.58);
        }
        .sad-app-demo *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .sad-app-demo *::-webkit-scrollbar-track {
          background: rgba(20, 17, 13, 0.58);
          border-left: 1px solid rgba(232, 224, 200, 0.08);
        }
        .sad-app-demo *::-webkit-scrollbar-thumb {
          border: 2px solid rgba(20, 17, 13, 0.58);
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(var(--color-accent-strong-rgb), 0.68),
            rgba(var(--color-accent-rgb), 0.42)
          );
        }
        .sad-app-demo *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(var(--color-accent-strong-rgb), 0.82),
            rgba(var(--color-accent-rgb), 0.58)
          );
        }
        .sad-app-demo *::-webkit-scrollbar-corner {
          background: rgba(20, 17, 13, 0.58);
        }
        .sad-app-actions a:focus-visible,
        .sad-app-ghost-button:focus-visible,
        .sad-app-run-button:focus-visible,
        .sad-app-runs button:focus-visible,
        .sad-app-files button:focus-visible,
        .sad-app-preview-pane header button:focus-visible {
          outline: 2px solid rgba(var(--color-accent-rgb), 0.62);
          outline-offset: 2px;
        }
        .sad-app-workspace {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(400px, 520px);
          gap: 20px;
          padding: 20px 48px;
          overflow: hidden;
        }
        .sad-app-flow-pane {
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface-1);
        }
        .sad-app-pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--color-border);
          padding: 12px 18px;
        }
        .sad-app-pane-header span {
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-app-pane-header strong {
          color: var(--color-ink-4);
          font-size: 11px;
          font-weight: 500;
        }
        .sad-app-dag-canvas {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 32px 0;
          background-image: radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px);
          background-position: 0 0;
          background-size: 22px 22px;
        }
        .sad-app-runs {
          flex-shrink: 0;
          border-top: 1px solid var(--color-border);
          padding: 14px 48px 20px;
        }
        .sad-app-runs-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 8px;
        }
        .sad-app-runs-head span {
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-app-runs button,
        .sad-app-preview-pane header button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 0;
          color: var(--color-ink-3);
          background: transparent;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .sad-app-runs button:hover,
        .sad-app-preview-pane header button:hover {
          color: var(--color-ink-1);
        }
        .sad-app-run-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .sad-app-run-strip > span {
          display: flex;
          min-width: 200px;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px 12px;
          background: var(--color-surface-1);
        }
        .sad-app-run-strip strong {
          color: var(--color-ink-2);
          font-size: 12.5px;
          font-weight: 500;
        }
        .sad-app-run-strip em {
          margin-left: auto;
          color: var(--color-ink-4);
          font-size: 11.5px;
          font-style: normal;
          font-variant-numeric: tabular-nums;
        }
        .sad-app-output {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
          overflow: hidden;
        }
        .sad-app-files {
          overflow: auto;
          border-right: 1px solid var(--color-border);
          background: var(--color-surface-deep);
          padding: 14px;
        }
        .sad-app-output-summary {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 12px;
          background: var(--color-surface-1);
        }
        .sad-app-output-summary span {
          color: var(--color-success);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .sad-app-output-summary strong {
          display: block;
          margin-top: 5px;
          color: var(--color-ink-1);
          font-size: 13px;
          font-weight: 500;
        }
        .sad-app-file-group {
          margin-top: 18px;
        }
        .sad-app-file-group p {
          margin: 0 0 8px;
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-app-files button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 9px;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 9px 10px;
          color: var(--color-ink-2);
          background: transparent;
          text-align: left;
          font-size: 12.5px;
          line-height: 1.35;
          cursor: pointer;
        }
        .sad-app-files button:hover,
        .sad-app-files button[aria-current="true"] {
          border-color: var(--color-border);
          color: var(--color-ink-1);
          background: var(--color-surface-1);
        }
        .sad-app-files button span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sad-app-preview-pane {
          min-width: 0;
          min-height: 0;
          overflow: auto;
          background: var(--color-surface-1);
        }
        .sad-app-preview-pane > header {
          position: sticky;
          top: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--color-border);
          padding: 14px 18px;
          background: rgba(44, 38, 29, 0.96);
        }
        .sad-app-preview-pane header span {
          color: var(--color-ink-3);
          font-size: 11.5px;
          font-weight: 600;
        }
        .sad-app-preview-pane h2 {
          margin: 3px 0 0;
          color: var(--color-ink-1);
          font-size: 16px;
          font-weight: 500;
          line-height: 1.25;
        }
        .sad-app-preview-pane .sad-markdown {
          max-width: 820px;
        }
        .sad-empty {
          padding: 24px;
          color: var(--color-ink-3);
        }
        .sad-markdown {
          padding: 28px 32px 48px;
          color: var(--color-ink-2);
          font-size: 14px;
          line-height: 1.72;
        }
        .sad-markdown h1,
        .sad-markdown h2,
        .sad-markdown h3,
        .sad-markdown h4 {
          color: var(--color-ink-1);
          font-weight: 500;
          line-height: 1.15;
        }
        .sad-markdown h1 {
          margin: 0 0 20px;
          font-family: var(--font-title);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 400;
        }
        .sad-markdown h2 {
          margin: 34px 0 12px;
          font-size: 20px;
        }
        .sad-markdown h3 {
          margin: 26px 0 10px;
          font-size: 17px;
        }
        .sad-markdown h4 {
          margin: 20px 0 8px;
          font-size: 15px;
        }
        .sad-markdown p,
        .sad-markdown ul,
        .sad-markdown ol {
          margin: 0 0 16px;
        }
        .sad-markdown ul,
        .sad-markdown ol {
          padding-left: 20px;
        }
        .sad-markdown li {
          margin: 7px 0;
        }
        .sad-markdown strong {
          color: var(--color-ink-1);
          font-weight: 650;
        }
        .sad-markdown code {
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 1px 5px;
          color: var(--color-accent-strong);
          background: var(--color-surface-deep);
          font-family: var(--font-mono);
          font-size: 0.9em;
        }
        .sad-markdown hr {
          height: 1px;
          margin: 24px 0;
          border: 0;
          background: var(--color-border);
        }
        .sad-table-wrap,
        .sad-csv {
          overflow: auto;
        }
        .sad-markdown table,
        .sad-csv table {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .sad-markdown th,
        .sad-markdown td,
        .sad-csv th,
        .sad-csv td {
          border-bottom: 1px solid var(--color-border);
          padding: 9px 10px;
          text-align: left;
          vertical-align: top;
        }
        .sad-markdown th,
        .sad-csv th {
          color: var(--color-ink-1);
          background: rgba(20, 17, 13, 0.42);
          font-weight: 600;
          text-transform: capitalize;
        }
        .sad-csv {
          padding: 18px;
        }
        .sad-csv td {
          max-width: 280px;
          color: var(--color-ink-2);
        }
        @media (max-width: 900px) {
          .sad-app-demo {
            height: auto;
            min-height: 100svh;
            overflow: visible;
          }
          .sad-app-demo > nav {
            display: none !important;
          }
          .sad-app-main {
            min-height: 100svh;
            overflow: visible;
          }
          .sad-app-topbar {
            padding: 20px;
          }
          .sad-app-title-row {
            align-items: flex-start;
            flex-direction: column;
          }
          .sad-app-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .sad-app-workspace {
            display: flex;
            flex-direction: column;
            overflow: visible;
            padding: 16px 20px;
          }
          .sad-app-flow-pane {
            min-height: 460px;
          }
          .sad-app-workspace > div:last-child {
            min-height: 520px;
          }
          .sad-app-runs {
            padding: 14px 20px 20px;
          }
          .sad-app-output {
            grid-template-columns: 1fr;
            overflow: visible;
          }
          .sad-app-files {
            max-height: 250px;
            border-right: 0;
            border-bottom: 1px solid var(--color-border);
          }
          .sad-app-preview-pane {
            min-height: 620px;
          }
          .sad-app-preview-pane > header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-app-demo * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
