import { AppEyebrow } from "./app-eyebrow";
import { WorkflowsTable } from "./workflows-table";
import { Rail } from "./rail";
import type { AppPillTone } from "./app-pill";

const ROWS: {
  name: string;
  trigger: string;
  tone: AppPillTone;
  statusLabel: string;
  lastRun: string;
  runs: number;
}[] = [
  {
    name: "Weekly client update",
    trigger: "Manual",
    tone: "awaiting",
    statusLabel: "Awaiting input",
    lastRun: "2h ago",
    runs: 12,
  },
  {
    name: "Standup digest",
    trigger: "Mon 09:00",
    tone: "running",
    statusLabel: "Running",
    lastRun: "5m ago",
    runs: 48,
  },
  {
    name: "Meeting brief",
    trigger: "Per meeting",
    tone: "done",
    statusLabel: "Done",
    lastRun: "1h ago",
    runs: 96,
  },
  {
    name: "Research digest",
    trigger: "Daily 07:00",
    tone: "done",
    statusLabel: "Done",
    lastRun: "7h ago",
    runs: 140,
  },
  {
    name: "Inbox triage",
    trigger: "Per inbound",
    tone: "idle",
    statusLabel: "Idle",
    lastRun: "—",
    runs: 0,
  },
];

const FILTERS = [
  { id: "all",      label: "All",            active: true  },
  { id: "running",  label: "Running",        active: false },
  { id: "awaiting", label: "Awaiting input", active: false },
  { id: "idle",     label: "Idle",           active: false },
];

/**
 * WorkflowsIndexShot — faithful static port of app's workflows/page.tsx.
 *
 * Renders at 1360×850. Left Rail (72px) + right content pane.
 * Content: padding 32px 48px 48px; PageHeader (AppEyebrow + Fraunces h1 38 + description);
 * filter pill row (All active style, others inactive); WorkflowsTable.
 *
 * Matches app workflows/page.tsx layout: PageHeader, filter buttons, table card.
 */
export function WorkflowsIndexShot() {
  return (
    <div
      style={{
        display: "flex",
        width: 1360,
        height: 850,
        background: "var(--color-bg)",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink-1)",
        overflow: "hidden",
      }}
    >
      <Rail active="workflows" />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "32px 48px 48px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* PageHeader — matches app PageHeader.tsx */}
        <header
          style={{
            paddingBottom: 18,
            marginBottom: 24,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <AppEyebrow accent="dim">Workflows</AppEyebrow>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--font-title)",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: 38,
                  color: "var(--color-ink-1)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.1,
                }}
              >
                Workflows
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14.5,
                  color: "var(--color-ink-2)",
                  lineHeight: 1.55,
                  maxWidth: 720,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Run any by name. Sirius lifts new ones from your conversations.
              </p>
            </div>
          </div>
        </header>

        {/* Filter pill row — matches app filter buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 0 18px",
            fontSize: 12.5,
            fontFamily: "var(--font-sans)",
          }}
        >
          {FILTERS.map((f) => (
            <span
              key={f.id}
              style={{
                padding: "6px 12px",
                borderRadius: 9999,
                background: f.active ? "var(--color-surface-1)" : "transparent",
                border: `1px solid ${f.active ? "var(--color-border-strong)" : "var(--color-border)"}`,
                color: f.active ? "var(--color-ink-1)" : "var(--color-ink-3)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                cursor: "default",
              }}
            >
              {f.label}
            </span>
          ))}
          <span
            style={{
              marginLeft: "auto",
              color: "var(--color-ink-4)",
              fontSize: 12.5,
              fontFamily: "var(--font-sans)",
            }}
          >
            {ROWS.length} of {ROWS.length} workflows
          </span>
        </div>

        {/* Table */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <WorkflowsTable rows={ROWS} />
        </div>
        </div>
      </div>
    </div>
  );
}
