import { cn } from "@/lib/utils";
import { ProductMock } from "@/components/ui/product-mock";

type Row = {
  initial: string;
  hue: string; // hsl
  unread?: boolean;
  replied?: boolean;
  subjectWidth: string;
  snippetWidth: string;
  time: string;
};

const ROWS: Row[] = [
  { initial: "M", hue: "204 25% 52%", unread: true,  subjectWidth: "62%", snippetWidth: "82%", time: "9:42" },
  { initial: "A", hue: "32 38% 52%",  unread: true,  subjectWidth: "48%", snippetWidth: "70%", time: "9:38" },
  { initial: "J", hue: "12 55% 55%",  replied: true, subjectWidth: "55%", snippetWidth: "60%", time: "9:24" },
  { initial: "Y", hue: "275 22% 58%",                 subjectWidth: "40%", snippetWidth: "76%", time: "Mon" },
  { initial: "P", hue: "152 24% 48%",                 subjectWidth: "36%", snippetWidth: "44%", time: "Mon" },
];

const NAV: { label: string; widthPct: string; active?: boolean; count?: string }[] = [
  { label: "Inbox",   widthPct: "78%", active: true, count: "3" },
  { label: "Starred", widthPct: "60%" },
  { label: "Sent",    widthPct: "42%" },
  { label: "Drafts",  widthPct: "55%", count: "2" },
  { label: "Replies", widthPct: "50%" },
];

export function OutreachInboxMock() {
  return (
    <ProductMock
      label="Outreach · founders, dev tools"
      status="Tuesday"
      variant="inbox"
      accent="warm"
    >
      <div className="flex gap-3 -mx-1 -mt-1">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-[68px] shrink-0 flex-col gap-1.5 border-r border-[var(--color-border)] pr-3">
          <div
            className="mb-1.5 flex h-6 items-center justify-center rounded-md"
            style={{
              background: "rgba(var(--color-accent-rgb), 0.12)",
              border: "1px solid rgba(var(--color-accent-rgb), 0.32)",
            }}
          >
            <span
              className="font-mono text-[8.5px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-accent)" }}
            >
              Compose
            </span>
          </div>

          {NAV.map((item) => (
            <div key={item.label} className="flex h-3.5 items-center gap-1.5">
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{
                  background: item.active ? "var(--color-accent)" : "var(--color-border)",
                }}
              />
              <span
                className="h-1.5 rounded-full"
                style={{
                  width: item.widthPct,
                  background: item.active
                    ? "var(--color-ink-2)"
                    : "var(--color-border)",
                }}
              />
              {item.count && (
                <span className="ml-auto font-mono text-[8.5px] tabular-nums text-[var(--color-ink-3)]">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </aside>

        {/* Inbox list */}
        <div className="min-w-0 flex-1">
          {ROWS.map((row, index) => (
            <div
              key={`${row.initial}-${index}`}
              className={cn(
                "flex items-center gap-2.5 border-b border-[var(--color-border)] py-2 last:border-b-0",
                row.unread && "bg-[rgba(var(--color-accent-rgb),0.04)]",
              )}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: `hsl(${row.hue})` }}
              >
                <span className="font-mono text-[10.5px] text-white/85">
                  {row.initial}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 rounded-full"
                    style={{
                      width: row.subjectWidth,
                      background: row.unread
                        ? "var(--color-ink-1)"
                        : "var(--color-ink-2)",
                      opacity: row.unread ? 0.95 : 0.6,
                    }}
                  />
                  {row.replied && (
                    <span
                      className="inline-flex h-3.5 items-center rounded-full px-1.5 font-mono text-[8.5px] uppercase tracking-[0.16em]"
                      style={{
                        border: "1px solid rgba(var(--color-accent-rgb),0.5)",
                        color: "var(--color-accent)",
                        background: "rgba(var(--color-accent-rgb),0.06)",
                      }}
                    >
                      Replied
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <span
                    className="h-1.5 rounded-full bg-[var(--color-border)]"
                    style={{ width: row.snippetWidth }}
                  />
                </div>
              </div>

              <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-[var(--color-ink-3)]">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <p className="font-mono text-[10.5px] text-[var(--color-ink-3)]">
          9 sent · 1 reply
        </p>
        <p className="font-mono text-[10.5px] text-[var(--color-ink-3)]">
          queue Tue
        </p>
      </div>
    </ProductMock>
  );
}
