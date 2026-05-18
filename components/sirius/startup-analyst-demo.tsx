"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AppIcon, ScaledShot, WorkflowShot } from "@/components/sirius/appui";
import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
import type { StartupAnalystDemoFile } from "@/lib/startup-analyst-demo";
import { cn } from "@/lib/utils";
import type { DagStep } from "./appui/dag-mini";

type DemoMode = "preview" | "workflow" | "output";

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

export function StartupAnalystDemo({
  files,
  index,
  total,
}: {
  files: StartupAnalystDemoFile[];
  index: number;
  total: number;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<DemoMode>("preview");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hasCompletedRun, setHasCompletedRun] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reportFile = files.find((file) => file.group === "report") ?? files[0];
  const [activeFileId, setActiveFileId] = useState(reportFile?.id ?? "");

  const activeFile = files.find((file) => file.id === activeFileId) ?? reportFile;
  const csvFile = files.find((file) => file.kind === "csv");
  const steps = useMemo(() => buildSteps(activeIndex, completed), [activeIndex, completed]);
  const phase = currentPhase(activeIndex, completed);
  const companyCount = files.filter((file) => file.group === "companies").length;
  const founderCount = files.filter((file) => file.group === "founders").length;
  const startupCount = countCsvRows(csvFile);

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
    if (mode === "preview") return;
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [mode]);

  useEffect(() => {
    if (!running) return;

    const timeout = window.setTimeout(() => {
      if (activeIndex >= PIPELINE_STEPS.length - 1) {
        setCompleted(true);
        setHasCompletedRun(true);
        setRunning(false);
        window.setTimeout(() => setMode("output"), 650);
        return;
      }
      setActiveIndex((current) => current + 1);
    }, 360);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, running]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mode !== "preview") {
        setMode("preview");
        setRunning(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode]);

  function openWorkflow() {
    setMode("workflow");
  }

  function runWorkflow() {
    setMode("workflow");
    setCompleted(false);
    setHasCompletedRun(false);
    setActiveIndex(0);
    setRunning(true);
  }

  function skipToOutput() {
    setActiveIndex(PIPELINE_STEPS.length - 1);
    setCompleted(true);
    setRunning(false);
    setMode("output");
  }

  function exitDemo() {
    setMode("preview");
    setRunning(false);
  }

  const statusLabel = completed ? "Pipeline Done" : running ? "Running" : "Ready";
  const tone = completed ? "done" : running ? "running" : "awaiting";

  return (
    <article
      ref={rootRef}
      data-revealed={revealed ? "true" : "false"}
      className="sad-root relative border-t border-[var(--color-border-strong)] py-12 md:flex md:min-h-[calc(100svh-4rem)] md:items-center md:py-16"
    >
      {mode === "preview" ? (
        <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
          <div className="relative flex max-w-[58ch] flex-col">
            <p className="flex items-center gap-3 text-[15px] italic leading-[1.5] text-[var(--color-ink-2)]">
              <span className="inline-flex h-[18px] shrink-0 items-center text-[var(--color-state-listening-strong)]">
                <AppIcon name="spark" size={17} />
              </span>
              <span>&ldquo;Sirius, run the startup analyst workflow.&rdquo;</span>
            </p>

            <h3 className="font-display mt-4 max-w-[22ch] text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.08] tracking-[-0.022em] text-[var(--color-ink-1)]">
              Startup analyst,{" "}
              <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
                already done.
              </em>
            </h3>

            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-[var(--color-ink-2)]">
              Run the actual dealflow pipeline: discover AI infrastructure startups, enrich the records, score conviction, write company and founder profiles, then produce the weekly report.
            </p>

            <p className="mt-6 inline-flex items-baseline gap-3 text-[14px] leading-[1.5] text-[var(--color-ink-1)]">
              <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>-</span>
              <span>{hasCompletedRun ? `Last run: Pipeline Done · ${startupCount} startups analyzed · report generated.` : "You inspect the finished diligence packet, not a loading screen."}</span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-primary btn-field text-[13px]" onClick={openWorkflow}>
                <AppIcon name="play" size={13} />
                Open demo
              </button>
              {hasCompletedRun && (
                <button type="button" className="btn btn-ghost btn-field text-[13px]" onClick={() => setMode("output")}>
                  <AppIcon name="doc" size={14} />
                  Reopen output
                </button>
              )}
            </div>

            <div className="mt-7 text-[10.5px] tracking-[0.22em] text-[var(--color-ink-3)]">
              <span style={{ color: "var(--color-accent)", opacity: 0.9 }}>{String(index).padStart(2, "0")}</span>
              <span className="mx-2 opacity-60">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="sad-preview relative w-full max-w-[520px] justify-self-center md:justify-self-end">
            <ScreenshotFrame alt="Sirius startup analyst dealflow pipeline" caption="dealflow_pipeline">
              <ScaledShot width={1360} height={850}>
                <WorkflowShot
                  breadcrumb="dealflow_pipeline"
                  title="Startup analyst"
                  tone={tone}
                  statusLabel={statusLabel}
                  trigger="Manual trigger"
                  runsMeta={`${PIPELINE_STEPS.length} steps · ${files.length} files`}
                  railActive="workflows"
                  showRunButton={false}
                  steps={steps}
                  chatHeader="Workflow run"
                  messages={[
                    { role: "user", text: "Run the startup analyst workflow." },
                    { role: "assistant", text: completed ? "Pipeline Done. Report, CSV, company profiles, and founder profiles are ready." : "Ready to discover, score, and package this week's AI infrastructure dealflow." },
                  ]}
                  recentRuns={[
                    { tone: completed ? "done" : "scheduled", label: completed ? "Done" : "Ready", when: "now", dur: completed ? "7s" : "-" },
                    { tone: "done", label: "Done", when: "1w ago", dur: "2m 18s" },
                  ]}
                />
              </ScaledShot>
            </ScreenshotFrame>
          </div>
        </div>
      ) : (
        <div className="sad-shell">
          <div className="sad-demo-bar">
            <div className="min-w-0">
              <p>Startup Analyst</p>
              <strong>{mode === "output" ? "Generated output workspace" : "dealflow_pipeline"}</strong>
            </div>
            <div className="sad-demo-actions">
              {mode === "output" && (
                <button type="button" onClick={() => setMode("workflow")}>
                  <AppIcon name="arrow" size={13} />
                  Back to workflow
                </button>
              )}
              <span className={cn("sad-status", running && "sad-status-running", completed && "sad-status-done")}>{statusLabel}</span>
              <button type="button" onClick={exitDemo}>
                Exit demo
              </button>
            </div>
          </div>

          {mode === "workflow" ? (
            <div className="sad-workflow">
              <div className="sad-command-panel">
                <div className="sad-command-copy">
                  <span>{running ? phase : completed ? "Pipeline Done" : "Ready"}</span>
                  <h4>{completed ? "Diligence packet generated" : "Run Startup Analyst"}</h4>
                  <p>
                    {completed
                      ? `${startupCount} startups analyzed. ${companyCount} company profiles and ${founderCount} founder briefs are ready.`
                      : "This starts the dealflow pipeline and opens the generated output workspace when it finishes."}
                  </p>
                </div>
                <div className="sad-command-actions">
                  <button type="button" className="sad-primary-run" onClick={runWorkflow} disabled={running}>
                    <AppIcon name={running ? "dots" : "play"} size={18} />
                    <span>{running ? "Running pipeline" : completed ? "Run Startup Analyst again" : "Run Startup Analyst"}</span>
                  </button>
                  <button type="button" className="sad-secondary-link" onClick={skipToOutput} disabled={running && activeIndex < 3}>
                    Skip to output
                  </button>
                </div>
              </div>

              <div className="sad-phase-rail" aria-label="Pipeline progress">
                {PHASES.map((item) => {
                  const done = completed || activeIndex > item.range[1];
                  const active = !completed && activeIndex >= item.range[0] && activeIndex <= item.range[1];
                  return (
                    <span key={item.label} data-state={done ? "done" : active ? "active" : "idle"}>
                      {item.label}
                    </span>
                  );
                })}
              </div>

              <ScreenshotFrame alt="Expanded Sirius startup analyst workflow page" caption="dealflow_pipeline" width={1600} height={860} className="sad-expanded-frame">
                <ScaledShot width={1360} height={850}>
                  <WorkflowShot
                    breadcrumb="dealflow_pipeline"
                    title="Startup analyst"
                    tone={tone}
                    statusLabel={statusLabel}
                    trigger="Manual trigger"
                    runsMeta={`${PIPELINE_STEPS.length} steps · last run now`}
                    railActive="workflows"
                    showRunButton={false}
                    steps={steps}
                    chatHeader="Workflow run"
                    messages={[
                      { role: "user", text: "Run the startup analyst workflow." },
                      { role: "assistant", text: completed ? "Pipeline Done. I generated the weekly report, CSV, company profiles, and founder profiles." : running ? `${phase}. Working through the pipeline now.` : "Ready. This workflow will produce the same artifact set shown in the output workspace." },
                    ]}
                    recentRuns={[
                      { tone, label: statusLabel, when: "now", dur: running ? "-" : completed ? "7s" : "-" },
                      { tone: "done", label: "Done", when: "1w ago", dur: "2m 18s" },
                    ]}
                  />
                </ScaledShot>
              </ScreenshotFrame>
            </div>
          ) : (
            <div className="sad-output">
              <aside className="sad-files" aria-label="Generated files">
                <div className="sad-output-summary">
                  <span>Pipeline Done</span>
                  <strong>{startupCount} startups · {files.length} files</strong>
                </div>
                {(Object.keys(groupedFiles) as StartupAnalystDemoFile["group"][]).map((group) => (
                  groupedFiles[group].length > 0 && (
                    <div key={group} className="sad-file-group">
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

              <section className="sad-preview-pane" aria-live="polite">
                {activeFile ? (
                  <>
                    <header>
                      <div>
                        <span>{activeFile.path}</span>
                        <h4>{activeFile.name}</h4>
                      </div>
                      <span>{activeFile.kind.toUpperCase()}</span>
                    </header>
                    <FilePreview file={activeFile} />
                  </>
                ) : (
                  <div className="sad-empty">No demo files found.</div>
                )}
              </section>
            </div>
          )}
        </div>
      )}

      <style>{`
        .sad-root {
          scroll-margin-top: 5rem;
        }
        .sad-preview {
          opacity: 0;
          transform: translateY(18px) scale(0.94);
          transition: opacity 520ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sad-root[data-revealed="true"] .sad-preview {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .sad-shell {
          min-height: min(820px, calc(100svh - 96px));
          overflow: hidden;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-lg);
          background: var(--color-surface-deep);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
        }
        .sad-demo-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--color-border);
          background: rgba(44, 38, 29, 0.72);
        }
        .sad-demo-bar p,
        .sad-file-group p {
          margin: 0;
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-demo-bar strong {
          display: block;
          margin-top: 3px;
          color: var(--color-ink-1);
          font-size: 14px;
          font-weight: 500;
          line-height: 1.35;
        }
        .sad-demo-actions,
        .sad-command-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .sad-demo-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 34px;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-sm);
          padding: 0 12px;
          color: var(--color-ink-2);
          background: transparent;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
        }
        .sad-demo-actions button:hover {
          border-color: rgba(var(--color-accent-rgb), 0.55);
          color: var(--color-ink-1);
          background: rgba(var(--color-accent-rgb), 0.06);
        }
        .sad-demo-actions button:focus-visible,
        .sad-primary-run:focus-visible,
        .sad-secondary-link:focus-visible,
        .sad-files button:focus-visible {
          outline: 2px solid rgba(var(--color-accent-rgb), 0.62);
          outline-offset: 2px;
        }
        .sad-demo-actions button:disabled,
        .sad-primary-run:disabled,
        .sad-secondary-link:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }
        .sad-status {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          border: 1px solid var(--color-accent-muted);
          border-radius: var(--radius-full);
          padding: 0 10px;
          color: var(--color-accent);
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
        }
        .sad-status-running {
          border-color: var(--color-border-strong);
          color: var(--color-state-listening);
        }
        .sad-status-done {
          border-color: var(--color-border-strong);
          color: var(--color-success);
        }
        .sad-workflow {
          padding: 16px;
        }
        .sad-command-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
          align-items: center;
          gap: 20px;
          margin-bottom: 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 18px;
          background:
            linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1), transparent 36%),
            var(--color-surface-1);
        }
        .sad-command-copy span {
          display: inline-flex;
          margin-bottom: 8px;
          color: var(--color-accent);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sad-command-copy h4 {
          margin: 0;
          color: var(--color-ink-1);
          font-family: var(--font-title);
          font-size: clamp(1.6rem, 3.6vw, 2.5rem);
          font-weight: 400;
          line-height: 0.98;
        }
        .sad-command-copy p {
          max-width: 58ch;
          margin: 10px 0 0;
          color: var(--color-ink-2);
          font-size: 14px;
          line-height: 1.55;
        }
        .sad-command-actions {
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }
        .sad-primary-run,
        .sad-secondary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          border-radius: var(--radius-sm);
          font-weight: 650;
          cursor: pointer;
        }
        .sad-primary-run {
          min-height: 58px;
          border: 1px solid rgba(var(--color-accent-rgb), 0.82);
          padding: 0 22px;
          color: var(--color-bg);
          background: var(--color-accent);
          font-size: 15px;
          box-shadow:
            0 0 0 1px rgba(var(--color-accent-rgb), 0.24),
            0 0 34px rgba(var(--color-accent-rgb), 0.22);
          animation: sad-command-pulse 1.8s ease-in-out infinite;
        }
        .sad-primary-run:hover {
          background: var(--color-accent-strong);
        }
        .sad-primary-run:disabled {
          animation: none;
        }
        .sad-secondary-link {
          min-height: 34px;
          border: 1px solid transparent;
          padding: 0 10px;
          color: var(--color-ink-3);
          background: transparent;
          font-size: 12.5px;
        }
        .sad-secondary-link:hover {
          color: var(--color-ink-1);
          text-decoration: underline;
          text-decoration-color: rgba(var(--color-accent-rgb), 0.55);
          text-underline-offset: 5px;
        }
        .sad-phase-rail {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .sad-phase-rail span {
          flex: 0 0 auto;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 6px 10px;
          color: var(--color-ink-3);
          font-size: 11.5px;
          font-weight: 500;
        }
        .sad-phase-rail span[data-state="active"] {
          border-color: rgba(var(--color-state-listening-rgb), 0.5);
          color: var(--color-state-listening);
        }
        .sad-phase-rail span[data-state="done"] {
          border-color: var(--color-border-strong);
          color: var(--color-success);
        }
        .sad-expanded-frame {
          min-height: min(620px, 64svh);
        }
        .sad-output {
          display: grid;
          grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
          height: min(760px, calc(100svh - 156px));
          min-height: 560px;
          overflow: hidden;
        }
        .sad-output * {
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--color-accent-rgb), 0.48) rgba(20, 17, 13, 0.58);
        }
        .sad-output *::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .sad-output *::-webkit-scrollbar-track {
          background: rgba(20, 17, 13, 0.58);
          border-left: 1px solid rgba(232, 224, 200, 0.08);
        }
        .sad-output *::-webkit-scrollbar-thumb {
          border: 2px solid rgba(20, 17, 13, 0.58);
          border-radius: var(--radius-full);
          background: linear-gradient(
            180deg,
            rgba(var(--color-accent-strong-rgb), 0.68),
            rgba(var(--color-accent-rgb), 0.42)
          );
        }
        .sad-output *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(var(--color-accent-strong-rgb), 0.82),
            rgba(var(--color-accent-rgb), 0.58)
          );
        }
        .sad-output *::-webkit-scrollbar-corner {
          background: rgba(20, 17, 13, 0.58);
        }
        .sad-files {
          overflow: auto;
          border-right: 1px solid var(--color-border);
          background: rgba(20, 17, 13, 0.58);
          padding: 14px;
        }
        .sad-output-summary {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px;
          background: var(--color-surface-1);
        }
        .sad-output-summary span {
          color: var(--color-success);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .sad-output-summary strong {
          display: block;
          margin-top: 5px;
          color: var(--color-ink-1);
          font-size: 13px;
          font-weight: 500;
        }
        .sad-file-group {
          margin-top: 18px;
        }
        .sad-file-group p {
          margin-bottom: 8px;
        }
        .sad-files button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 9px;
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          padding: 9px 10px;
          color: var(--color-ink-2);
          background: transparent;
          text-align: left;
          font-size: 12.5px;
          line-height: 1.35;
          cursor: pointer;
        }
        .sad-files button:hover,
        .sad-files button[aria-current="true"] {
          border-color: var(--color-border);
          color: var(--color-ink-1);
          background: var(--color-surface-1);
        }
        .sad-files button span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sad-preview-pane {
          min-width: 0;
          min-height: 0;
          overflow: auto;
          background: var(--color-surface-1);
        }
        .sad-preview-pane > header {
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
        .sad-preview-pane header span {
          color: var(--color-ink-3);
          font-size: 11.5px;
          font-weight: 600;
        }
        .sad-preview-pane h4 {
          margin: 3px 0 0;
          color: var(--color-ink-1);
          font-size: 16px;
          font-weight: 500;
          line-height: 1.25;
        }
        .sad-empty {
          padding: 24px;
          color: var(--color-ink-3);
        }
        .sad-markdown {
          max-width: 820px;
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
          border-radius: var(--radius-xs);
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
          border-collapse: collapse;
          min-width: 700px;
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
          color: var(--color-ink-2);
          max-width: 280px;
        }
        @keyframes sad-command-pulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(var(--color-accent-rgb), 0.24), 0 0 26px rgba(var(--color-accent-rgb), 0.17); }
          50% { box-shadow: 0 0 0 1px rgba(var(--color-accent-rgb), 0.48), 0 0 40px rgba(var(--color-accent-rgb), 0.32); }
        }
        @media (min-width: 900px) {
          .sad-preview {
            position: sticky;
            top: 6rem;
          }
        }
        @media (max-width: 760px) {
          .sad-shell {
            min-height: calc(100svh - 74px);
            border-radius: var(--radius-md);
          }
          .sad-demo-bar,
          .sad-command-panel {
            align-items: flex-start;
            grid-template-columns: 1fr;
          }
          .sad-demo-actions,
          .sad-command-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .sad-expanded-frame {
            min-height: 430px;
          }
          .sad-output {
            grid-template-columns: 1fr;
            height: auto;
            min-height: calc(100svh - 156px);
            overflow: visible;
          }
          .sad-files {
            max-height: 250px;
            position: sticky;
            top: 0;
            z-index: 2;
            border-right: 0;
            border-bottom: 1px solid var(--color-border);
          }
          .sad-preview-pane {
            min-height: 520px;
          }
          .sad-markdown {
            padding: 22px 18px 40px;
          }
          .sad-preview-pane > header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-preview,
          .sad-primary-run {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </article>
  );
}
