import { ProductMock } from "@/components/ui/product-mock";

export function VoiceMock() {
  const bars = Array.from({ length: 24 }, (_, i) => {
    const factor = Math.sin(i * 0.4) * 0.5 + Math.sin(i * 0.9) * 0.3 + 0.2;
    const height = Math.max(3, Math.min(18, factor * 20));
    const opacity = 0.5 + (Math.sin((i / 23) * Math.PI)) * 0.5;
    return { height, opacity };
  });

  return (
    <ProductMock tone="flush">
      <div className="flex flex-col items-start">
        <svg
          width="100%"
          height="40"
          viewBox="0 0 108 40"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {bars.map((bar, i) => {
            const x = i * 4.5 + 0.75;
            const y = 20 - bar.height / 2;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="1.5"
                height={bar.height}
                rx="0.75"
                fill="var(--color-accent)"
                opacity={bar.opacity}
              />
            );
          })}
        </svg>
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <span className="font-mono text-[11px] text-[var(--color-ink-2)]">
            Sirius, run the release.
          </span>
        </div>
      </div>
    </ProductMock>
  );
}

export function ChatMock() {
  return (
    <ProductMock tone="flush">
      <div className="flex flex-col gap-2">
        <div className="self-end rounded-full bg-[rgba(0,0,0,0.2)] px-3 py-1.5">
          <span className="text-[12px] text-[var(--color-ink-1)]">
            Move the release to Friday.
          </span>
        </div>
        <div className="flex items-start gap-1.5 self-start max-w-[80%]">
          <span
            className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <span className="font-display-italic text-[12px] italic text-[var(--color-ink-2)]">
            Done. I&apos;ll ping CI when it goes green.
          </span>
        </div>
      </div>
    </ProductMock>
  );
}

export function FeedMock() {
  const items = [
    { time: "06:41", title: "Sonnet 4.7 · context to 1M tokens" },
    { time: "06:39", title: "NVDA · two analyst upgrades since Friday" },
    { time: "06:37", title: "n8n 1.78 · OpenAI-compatible LLM nodes" },
  ];

  return (
    <ProductMock tone="flush">
      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.time}
            className="flex items-baseline gap-3 border-b border-[var(--color-border)] py-1.5 last:border-b-0"
          >
            <span className="w-12 shrink-0 font-mono text-[10.5px] text-[var(--color-ink-3)]">
              {item.time}
            </span>
            <span className="truncate text-[12px] text-[var(--color-ink-2)]">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </ProductMock>
  );
}

function ScheduleRow({ trigger, target }: { trigger: string; target: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-3 py-1.5 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-2)]">
          {trigger}
        </span>
      </div>
      <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true" className="shrink-0">
        <line x1="0" y1="5" x2="16" y2="5" stroke="var(--color-border-strong)" strokeWidth="1.5" />
        <polyline points="13,2 18,5 13,8" fill="none" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex-1 rounded-full border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)] px-3 py-1.5 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-1)]">
          {target}
        </span>
      </div>
    </div>
  );
}

export function SchedulesMock() {
  return (
    <ProductMock tone="flush">
      <div className="flex flex-col gap-2.5">
        <ScheduleRow trigger="Tuesday · 9am" target="STEP outreach" />
        <ScheduleRow trigger="PR opened" target="Review script" />
      </div>
    </ProductMock>
  );
}
