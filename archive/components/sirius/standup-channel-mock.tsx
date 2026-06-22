import { ProductMock } from "@/components/ui/product-mock";

const SHIPPED = [
  { text: "Aurora migration",            ref: "PR #4421" },
  { text: "Search-index feature flag",   ref: "LIN-892"  },
  { text: "N+1 fix · /workspace",        ref: "PR #4438" },
];

const NEXT = [
  "Deploy-script consolidation",
  "Auth refactor with Marcus",
];

const BLOCKING = [
  { text: "Brennan to review", ref: "LIN-901" },
];

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]">
      {label}
    </p>
  );
}

export function StandupChannelMock() {
  return (
    <ProductMock label="#standup · 12 members" status="9:01 AM">
      <div className="flex items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[12.5px] font-medium text-[var(--color-ink-1)]">Sirius</span>
            <span
              className="rounded-full border px-1.5 py-px font-mono text-[8.5px] uppercase tracking-[0.16em]"
              style={{
                borderColor: "rgba(var(--color-accent-rgb), 0.32)",
                background: "rgba(var(--color-accent-rgb), 0.08)",
                color: "var(--color-accent)",
              }}
            >
              Draft
            </span>
            <span className="font-mono text-[9.5px] text-[var(--color-ink-3)]">9:01 AM</span>
          </div>

          <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-1)]">
            Standup &mdash; Mon, Mar 17
          </p>

          <div className="mt-3 space-y-2.5">
            <div>
              <SectionHeader label="Shipped" />
              <ul className="mt-1 space-y-0.5">
                {SHIPPED.map((item) => (
                  <li key={item.ref} className="flex items-baseline gap-1.5 text-[11.5px]">
                    <span className="text-[var(--color-ink-3)]">·</span>
                    <span className="flex-1 min-w-0 text-[var(--color-ink-2)]">{item.text}</span>
                    <span className="font-mono text-[9.5px] text-[var(--color-accent)]">{item.ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader label="Next" />
              <ul className="mt-1 space-y-0.5">
                {NEXT.map((line) => (
                  <li key={line} className="flex items-baseline gap-1.5 text-[11.5px]">
                    <span className="text-[var(--color-ink-3)]">·</span>
                    <span className="flex-1 text-[var(--color-ink-2)]">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader label="Blocking" />
              <ul className="mt-1 space-y-0.5">
                {BLOCKING.map((item) => (
                  <li key={item.ref} className="flex items-baseline gap-1.5 text-[11.5px]">
                    <span className="text-[var(--color-accent)]">·</span>
                    <span className="flex-1 min-w-0 text-[var(--color-ink-2)]">{item.text}</span>
                    <span className="font-mono text-[9.5px] text-[var(--color-accent)]">{item.ref}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-3">
        <button
          type="button"
          tabIndex={-1}
          className="text-[11.5px] text-[var(--color-ink-2)] underline-offset-4 hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-medium tracking-tight text-[var(--color-bg)]"
        >
          Post to #standup
        </button>
      </div>
    </ProductMock>
  );
}
