const leftItems = [
  { label: "Memories", meta: "local" },
  { label: "Conversations", meta: "local" },
  { label: "Files & references", meta: "local" },
];

function PaneLabel({ children, color }: { children: string; color?: string }) {
  return (
    <span
      className="font-mono text-[10.5px] uppercase tracking-[0.2em]"
      style={{ color: color ?? "var(--color-ink-3)" }}
    >
      {children}
    </span>
  );
}

function LaptopGlyph() {
  return (
    <svg
      width="36"
      height="24"
      viewBox="0 0 36 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-3 mb-4"
    >
      <rect x="4" y="1" width="28" height="18" rx="2" />
      <rect x="1" y="20" width="34" height="3" rx="1.5" />
    </svg>
  );
}

export function LocalDataDiagram() {
  return (
    <figure>
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] p-5 md:p-6">
        <PaneLabel color="var(--color-accent)">Your machine</PaneLabel>
        <LaptopGlyph />
        <ul>
          {leftItems.map(({ label, meta }) => (
            <li
              key={label}
              className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)] last:border-b-0"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span className="flex-1 text-[14px] text-[var(--color-ink-1)]">
                {label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-3)]">
                {meta}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
