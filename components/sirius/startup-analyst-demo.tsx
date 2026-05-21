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

const GROUP_LABELS: Record<StartupAnalystDemoFile["group"], string> = {
  report: "Report",
  data: "Data",
  companies: "Company profiles",
  founders: "Founder profiles",
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

function runStatusLabel(completed: boolean, running: boolean) {
  if (completed) return "completed";
  if (running) return "running";
  return "ready";
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
        <StartupAnalystAppDemo files={files} contained onPhaseChange={setPhase} />
      </div>

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
      `}</style>
    </article>
  );
}

export function StartupAnalystAppDemo({
  files,
  contained = false,
  onPhaseChange,
}: {
  files: StartupAnalystDemoFile[];
  /** Rendered inside the landing card (vs. the full-screen /demo route). */
  contained?: boolean;
  /** Reports the app's current phase so the landing frame can grow/shrink. */
  onPhaseChange?: (phase: "chat" | "running" | "output") => void;
}) {
  const [view, setView] = useState<AppDemoView>(() => (contained ? "chat" : "workflow"));
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRunCardRef = useRef<HTMLLIElement | null>(null);

  const reportFile = files.find((file) => file.group === "report") ?? files[0];
  const [activeFileId, setActiveFileId] = useState(reportFile?.id ?? "");
  const activeFile = files.find((file) => file.id === activeFileId) ?? reportFile;
  const csvFile = files.find((file) => file.kind === "csv");
  const startupCount = countCsvRows(csvFile);
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
    if (view !== "run" || !activeRunCardRef.current) return;

    const card = activeRunCardRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    if (contained) {
      // Scroll only the card's own run list — scrollIntoView would bubble up
      // and drag the whole page with it.
      const container = card.closest<HTMLElement>(".sad-run-page");
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const tRect = card.getBoundingClientRect();
      const delta = tRect.top - cRect.top - (container.clientHeight - card.clientHeight) / 2;
      container.scrollBy({ top: delta, behavior });
      return;
    }

    card.scrollIntoView({ block: "center", behavior });
  }, [activeIndex, completed, view, contained]);

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
      ? `${phase}. Working through the pipeline now.`
      : "Ready. This workflow will discover, score, profile, and package this week's AI infrastructure dealflow.";

  const runPlan = PIPELINE_STEPS.map((step, index) => ({
    ...step,
    runStatus: runNodeStatus(index, activeIndex, completed),
    input: index === 0
      ? { query: "AI infrastructure startups", sources: ["Hacker News", "web search"] }
      : { from: PIPELINE_STEPS[Math.max(0, index - 1)].id },
    output: index < activeIndex || completed
      ? runOutputForStep(step.id, startupCount, companyCount, founderCount)
      : null,
  }));

  const planByStep = runPlan.reduce<Map<number, typeof runPlan>>((acc, node) => {
    const list = acc.get(node.col) ?? [];
    list.push(node);
    acc.set(node.col, list);
    return acc;
  }, new Map());
  const runStepNumbers = Array.from(planByStep.keys()).sort((a, b) => a - b);

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
          <div className="sad-app-breadcrumb">
            <span>Workflows</span>
            <span>/</span>
            <strong>dealflow_pipeline</strong>
          </div>

          <div className="sad-app-title-row">
            <div className="sad-app-title-copy">
              <h1>Startup analyst</h1>
              <div className="sad-app-meta">
                <AppPill tone={tone} label={statusLabel} />
                <span>
                  <AppIcon name="arrow" size={12} />
                  Manual trigger
                </span>
                <span>{PIPELINE_STEPS.length} steps · {completed ? "last run now" : "ready"}</span>
              </div>
            </div>

            <div className="sad-app-actions">
              {!contained && (
                <button type="button" className="sad-app-ghost-button" onClick={returnToLandingDemo}>
                  Back to landing
                </button>
              )}
              {completed && (
                <button type="button" className="sad-app-ghost-button" onClick={resetWorkflow}>
                  Reset
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
          <section className="sad-run-page" aria-label="Startup analyst run details">
            <div className="sad-run-inner">
              <div className="sad-run-breadcrumb">
                <button type="button" onClick={() => setView("workflow")}>Workflows</button>
                <span>/</span>
                <button type="button" onClick={() => setView("workflow")}>dealflow_pipeline</button>
                <span>/</span>
                <strong>run #17</strong>
              </div>

              <header className="sad-run-header">
                <span className="sad-run-eyebrow">Run</span>
                <h1>
                  dealflow_pipeline <span>#17</span>
                </h1>
                <div className="sad-run-meta">
                  <AppPill tone={tone} label={runStatusLabel(completed, running)} />
                  {running && (
                    <button type="button" onClick={resetWorkflow}>
                      Cancel run
                    </button>
                  )}
                  {completed && (
                    <button type="button" onClick={() => setView("output")}>
                      Open generated output
                    </button>
                  )}
                </div>
              </header>

              <section className="sad-run-steps">
                <span className="sad-run-eyebrow sad-run-eyebrow-dim">Steps</span>
                {runStepNumbers.map((step) => (
                  <div key={step} className="sad-run-step-group">
                    <h2>Step {step}</h2>
                    <ol>
                      {planByStep.get(step)!.map((node) => (
                        <li
                          key={node.id}
                          ref={node.runStatus === "running" || (completed && node.id === "done") ? activeRunCardRef : null}
                          className="sad-run-card"
                          data-status={node.runStatus}
                        >
                          <div className="sad-run-card-top">
                            <span>
                              <i aria-hidden="true" />
                              <code>{node.id}</code>
                              <small>({node.type})</small>
                            </span>
                            <em>{node.runStatus}</em>
                          </div>

                          {node.runStatus !== "pending" && node.output?.text && (
                            <p>{node.output.text}</p>
                          )}

                          {node.runStatus !== "pending" && (
                            <>
                              <details>
                                <summary>input</summary>
                                <pre>{JSON.stringify(node.input, null, 2)}</pre>
                              </details>
                              {node.output && (
                                <details>
                                  <summary>output</summary>
                                  <pre>{JSON.stringify(node.output, null, 2)}</pre>
                                </details>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </section>
            </div>
          </section>
        ) : (
          <section className="sad-app-output" aria-label="Generated startup analyst output">
            <aside className="sad-app-files" aria-label="Generated files">
              <div className="sad-app-output-summary">
                <span>Pipeline Done</span>
                <strong>{startupCount} startups · {files.length} files</strong>
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
                <button type="button" onClick={() => setView("workflow")}>
                  Back to workflow
                </button>
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
        .sad-app-demo--contained .sad-run-page {
          padding: 22px 28px 36px;
        }
        .sad-app-demo--contained .sad-run-inner {
          width: min(760px, 100%);
        }
        .sad-app-demo--contained .sad-app-actions a,
        .sad-app-demo--contained .sad-app-ghost-button,
        .sad-app-demo--contained .sad-app-run-button {
          height: 38px;
        }
        /* Entry state: just the chat, filling the card — no rail, no topbar. */
        .sad-app-chat-entry {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          padding: 20px;
        }
        .sad-app-chat-entry > * {
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
        .sad-run-page {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 32px 48px 56px;
        }
        .sad-run-inner {
          width: min(920px, 100%);
          margin: 0 auto;
        }
        .sad-run-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          color: var(--color-ink-4);
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
        }
        .sad-run-breadcrumb button {
          border: 0;
          padding: 0;
          color: var(--color-ink-3);
          background: transparent;
          font: inherit;
          cursor: pointer;
        }
        .sad-run-breadcrumb button:hover {
          color: var(--color-ink-1);
        }
        .sad-run-breadcrumb strong {
          color: var(--color-ink-2);
          font-weight: 500;
        }
        .sad-run-header {
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
        }
        .sad-run-eyebrow {
          display: inline-flex;
          color: var(--color-accent);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-run-eyebrow-dim {
          color: var(--color-ink-3);
        }
        .sad-run-header h1 {
          margin: 8px 0 12px;
          color: var(--color-ink-1);
          font-size: 30px;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .sad-run-header h1 span {
          color: var(--color-ink-4);
          font-size: 18px;
          font-weight: 400;
        }
        .sad-run-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .sad-run-meta button {
          border: 1px solid var(--color-border);
          border-radius: 999px;
          padding: 6px 14px;
          color: var(--color-ink-2);
          background: transparent;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .sad-run-meta button:hover {
          border-color: var(--color-border-strong);
          color: var(--color-ink-1);
          background: rgba(244, 236, 219, 0.04);
        }
        .sad-run-steps {
          margin-top: 28px;
        }
        .sad-run-step-group {
          margin-bottom: 14px;
        }
        .sad-run-step-group h2 {
          margin: 10px 0 8px;
          color: var(--color-ink-4);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }
        .sad-run-step-group ol {
          margin: 0;
          padding: 0;
        }
        .sad-run-card {
          position: relative;
          list-style: none;
          margin-bottom: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 12px 14px;
          background: var(--color-surface-1);
          opacity: 0.55;
        }
        .sad-run-card[data-status="running"],
        .sad-run-card[data-status="completed"] {
          opacity: 1;
        }
        .sad-run-card[data-status="running"]::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--color-state-listening);
        }
        .sad-run-card[data-status="completed"]::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--color-success);
        }
        .sad-run-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .sad-run-card-top > span {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sad-run-card-top i {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--color-ink-4);
        }
        .sad-run-card[data-status="running"] .sad-run-card-top i {
          background: var(--color-state-listening);
          animation: sirius-pulse 1.4s ease-in-out infinite;
        }
        .sad-run-card[data-status="completed"] .sad-run-card-top i {
          background: var(--color-success);
        }
        .sad-run-card code {
          color: var(--color-ink-1);
          font-family: var(--font-sans);
          font-size: 12.5px;
          font-weight: 600;
        }
        .sad-run-card small {
          min-width: 0;
          color: var(--color-ink-4);
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sad-run-card-top em {
          flex-shrink: 0;
          border: 1px solid var(--color-border);
          border-radius: 999px;
          padding: 2px 8px;
          color: var(--color-ink-3);
          font-size: 9.5px;
          font-style: normal;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }
        .sad-run-card[data-status="running"] .sad-run-card-top em {
          color: var(--color-state-listening);
        }
        .sad-run-card[data-status="completed"] .sad-run-card-top em {
          color: var(--color-success);
        }
        .sad-run-card p {
          margin: 10px 0 4px;
          border-left: 3px solid var(--color-accent);
          border-radius: 0 6px 6px 0;
          padding: 10px 12px;
          color: var(--color-ink-1);
          background: var(--color-surface-2);
          font-size: 13px;
          line-height: 1.5;
        }
        .sad-run-card details {
          margin-top: 6px;
          font-size: 12px;
        }
        .sad-run-card summary {
          color: var(--color-ink-3);
          cursor: pointer;
          font-weight: 500;
        }
        .sad-run-card pre {
          margin: 6px 0;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 10px;
          color: var(--color-ink-2);
          background: var(--color-surface-deep);
          font-family: var(--font-sans);
          font-size: 11.5px;
          white-space: pre-wrap;
          word-break: break-word;
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
          .sad-run-page {
            padding: 24px 20px 40px;
          }
          .sad-run-card-top {
            align-items: flex-start;
            flex-direction: column;
          }
          .sad-run-card small {
            max-width: 100%;
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
