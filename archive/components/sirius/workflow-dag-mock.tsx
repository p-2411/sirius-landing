import { ProductMock } from "@/components/ui/product-mock";
import { StatusPill } from "@/components/ui/status-pill";

type StepState = "done" | "running" | "queued" | "gated" | "scheduled";

type Step = {
  label: string;
  detail?: string;
  state: StepState;
};

const STEPS: Step[] = [
  { label: "research team",       detail: "30 companies analysed",     state: "done" },
  { label: "find right person",   detail: "30 contacts identified",    state: "done" },
  { label: "shared connections",  detail: "18 / 30 checked",            state: "running" },
  { label: "tailored opener",     detail: "last project + your bio",   state: "queued" },
  { label: "send",                detail: "review queued openers",      state: "gated" },
  { label: "log to Notion",       detail: "STEP outreach · 2026 Q2",    state: "queued" },
  { label: "follow up · 5d",      detail: "if no reply",                state: "scheduled" },
];

const STATE_TO_TONE = {
  done:      { tone: "done",    label: "Done"            },
  running:   { tone: "running", label: "Running"         },
  queued:    { tone: "idle",    label: "Queued"          },
  gated:     { tone: "gated",   label: "Awaiting review" },
  scheduled: { tone: "idle",    label: "Scheduled"       },
} as const;

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
        {label}
      </p>
      <p className="mt-1 text-[14px] text-[var(--color-ink-1)]">{value}</p>
    </div>
  );
}

export function WorkflowDagMock() {
  return (
    <ProductMock label="Workflow · STEP cohort outreach" status="Running">
      <div className="grid grid-cols-3 gap-4">
        <Meta label="Trigger" value="voice · weekly" />
        <Meta label="Last run" value="2h ago" />
        <Meta label="Progress" value="18 / 30" />
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
          Steps
        </p>

        <div className="mt-3 divide-y divide-[var(--color-border)]">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4 py-3">
              <span className="font-mono text-[10.5px] text-[var(--color-ink-3)] w-6 shrink-0">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[var(--color-ink-1)]">{step.label}</p>
                {step.detail && (
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">{step.detail}</p>
                )}
              </div>
              <StatusPill tone={STATE_TO_TONE[step.state].tone}>
                {STATE_TO_TONE[step.state].label}
              </StatusPill>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Latest opener · drafted
        </p>
        <p className="mt-2 font-display-italic text-[13.5px] leading-[1.55] text-[var(--color-ink-2)]">
          &ldquo;Hi Mira — saw your work on Coda&apos;s mobile editor. Coming from dev-tools myself, I&apos;d love to compare notes on what shipped vs. what stayed in the spec…&rdquo;
        </p>
      </div>
    </ProductMock>
  );
}
