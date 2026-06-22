import { ProductMock } from "@/components/ui/product-mock";

export function NoticeCardMock() {
  return (
    <ProductMock tone="raised">
      <div
        aria-hidden="true"
        className="absolute -left-5 -top-5 -bottom-5 md:-left-6 md:-top-6 md:-bottom-6 w-[3px] bg-[var(--color-accent)]"
      />

      <div className="flex items-center gap-2">
        <div className="h-[22px] w-[22px] shrink-0 rounded-full border border-[var(--color-border)] flex items-center justify-center">
          <div className="h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]" />
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-3)]">
          Sirius · noticed · 2m ago
        </span>
        <div className="ml-auto">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="var(--color-ink-3)"
            strokeWidth="1.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </div>
      </div>

      <p className="font-display text-[16px] leading-tight text-[var(--color-ink-1)] mt-4">
        You drafted three of these this week.
      </p>

      <p className="text-[14px] leading-[1.55] text-[var(--color-ink-2)] mt-2">
        All to fund analysts, all in roughly the same shape. Want me to make this a workflow? Next time, just say &ldquo;do another for X.&rdquo;
      </p>

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          tabIndex={-1}
          className="text-[13px] font-medium text-[var(--color-ink-1)] underline-offset-4 hover:underline"
        >
          Yes, extract
        </button>
        <span aria-hidden="true" className="text-[var(--color-ink-3)]">·</span>
        <button
          type="button"
          tabIndex={-1}
          className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-ink-1)]"
        >
          Not now
        </button>
      </div>
    </ProductMock>
  );
}
