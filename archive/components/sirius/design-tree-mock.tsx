import { ProductMock } from "@/components/ui/product-mock";
import { cn } from "@/lib/utils";

type Status = "done" | "drafted" | "flagged" | "declined";

type Item = {
  text: string;
  tag: string;
  status: Status;
  assigneeHue: string;
};

const ITEMS: Item[] = [
  { text: "Logo a touch darker",       tag: "figma-edit",   status: "done",     assigneeHue: "204 25% 52%" },
  { text: "Move CTA right by 8px",     tag: "figma-edit",   status: "done",     assigneeHue: "204 25% 52%" },
  { text: "Brand fonts site-wide",     tag: "figma-edit",   status: "done",     assigneeHue: "32 38% 52%"  },
  { text: "Headline reads too formal", tag: "copy-change",  status: "drafted",  assigneeHue: "32 38% 52%"  },
  { text: "Why is the button blue?",   tag: "question",     status: "drafted",  assigneeHue: "275 22% 58%" },
  { text: "Add testimonials section",  tag: "scope-creep",  status: "flagged",  assigneeHue: "12 55% 55%"  },
  { text: "Make it look like Stripe",  tag: "out-of-scope", status: "declined", assigneeHue: "152 24% 48%" },
];

const SIDEBAR: { label: string; widthPct: string; count?: string; active?: boolean }[] = [
  { label: "Inbox",   widthPct: "70%", count: "8", active: true },
  { label: "Active",  widthPct: "60%", count: "2" },
  { label: "Done",    widthPct: "44%", count: "4" },
  { label: "Flagged", widthPct: "58%", count: "1" },
  { label: "Archive", widthPct: "52%" },
];

function StatusMark({ status }: { status: Status }) {
  const symbol: Record<Status, string> = {
    done:     "✓",
    drafted:  "✎",
    flagged:  "⚠",
    declined: "✕",
  };
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center text-[12px]",
        status === "done"     && "text-[var(--color-success)]",
        status === "drafted"  && "text-[var(--color-accent)]",
        status === "flagged"  && "text-[var(--color-accent)]",
        status === "declined" && "text-[var(--color-ink-3)]",
      )}
      aria-hidden="true"
    >
      {symbol[status]}
    </span>
  );
}

export function DesignTreeMock() {
  return (
    <ProductMock label="Client feedback · Marcus" status="8 items" variant="finder" accent="cyan">
      <div className="-mx-1 -mt-1 flex gap-3">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-[72px] shrink-0 flex-col gap-1.5 border-r border-[var(--color-border)] pr-3">
          <div
            className="mb-1.5 flex h-6 items-center justify-center rounded-md"
            style={{
              background: "rgba(var(--color-accent-rgb), 0.1)",
              border: "1px solid rgba(var(--color-accent-rgb), 0.32)",
            }}
          >
            <span
              className="font-mono text-[8.5px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-accent)" }}
            >
              + New
            </span>
          </div>

          {SIDEBAR.map((nav) => (
            <div key={nav.label} className="flex h-3.5 items-center gap-1.5">
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{
                  background: nav.active ? "var(--color-accent)" : "var(--color-border)",
                }}
              />
              <span
                className="h-1.5 rounded-full"
                style={{
                  width: nav.widthPct,
                  background: nav.active
                    ? "var(--color-ink-2)"
                    : "var(--color-border)",
                }}
              />
              {nav.count && (
                <span className="ml-auto font-mono text-[8.5px] tabular-nums text-[var(--color-ink-3)]">
                  {nav.count}
                </span>
              )}
            </div>
          ))}
        </aside>

        {/* Triage list */}
        <div className="min-w-0 flex-1">
          {/* Filter chips */}
          <div className="mb-2 flex items-center gap-1.5">
            <span
              className="inline-flex h-4 items-center rounded-full px-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em]"
              style={{
                background: "rgba(var(--color-accent-rgb), 0.08)",
                color: "var(--color-accent)",
                border: "1px solid rgba(var(--color-accent-rgb), 0.3)",
              }}
            >
              All · 8
            </span>
            <span className="inline-flex h-4 items-center rounded-full border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
              Open · 4
            </span>
            <span className="inline-flex h-4 items-center rounded-full border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
              Replied
            </span>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5">
                <StatusMark status={item.status} />
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--color-ink-1)]">
                  {item.text}
                </span>
                <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
                  {item.tag}
                </span>
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `hsl(${item.assigneeHue})` }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-[var(--color-border)] pt-3">
        <p className="flex-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-2)]">
          4 done · 2 need yours · 2 flagged
        </p>
        <span className="font-display-italic text-[12px] text-[var(--color-ink-3)]">
          Want me to send?
        </span>
      </div>
    </ProductMock>
  );
}
