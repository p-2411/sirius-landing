import { ProductMock } from "@/components/ui/product-mock";

type Ticker = {
  symbol: string;
  meta: string;
  delta: string;
  positive: boolean;
  spark: string;
  note: string;
};

const TICKERS: Ticker[] = [
  {
    symbol: "NVDA",
    meta: "$1,240.50",
    delta: "+2.1%",
    positive: true,
    spark: "0,20 12,19 22,21 32,17 44,18 56,13 68,12 80,7 92,5 100,3",
    note: "2 upgrades · post-close",
  },
  {
    symbol: "ANTH",
    meta: "private",
    delta: "release",
    positive: true,
    spark: "0,15 12,15 22,15 36,15 50,12 60,10 72,8 84,7 92,6 100,4",
    note: "Sonnet 4.7 · 1M ctx",
  },
  {
    symbol: "TSLA",
    meta: "$214.18",
    delta: "−1.4%",
    positive: false,
    spark: "0,8 14,9 26,8 38,11 50,10 62,13 72,14 82,16 92,17 100,19",
    note: "delivery miss · pre-mkt",
  },
];

type Headline = {
  time: string;
  tag: string;
  text: string;
  hot?: boolean;
};

const HEADLINES: Headline[] = [
  { time: "06:30", tag: "AI",      text: "Anthropic ships Sonnet 4.7 — 1M-token context.", hot: true },
  { time: "06:14", tag: "Tools",   text: "n8n 1.78 adds OpenAI-compatible LLM nodes." },
  { time: "05:58", tag: "Markets", text: "NVDA +2.1% on two upgrades since Friday." },
  { time: "05:42", tag: "Macro",   text: "FOMC minutes hint at one more cut in Q4." },
];

export function ResearchBriefingMock() {
  return (
    <ProductMock
      label="The Morning Briefing"
      status="Tue · 06:42"
      variant="briefing"
    >
      {/* Watchlist */}
      <section>
        <div className="-mt-1 mb-2 flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-ink-2)]">
            Watchlist
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
            3 tracked · live
          </span>
        </div>

        <div className="rounded-md border border-[var(--color-border)] bg-[rgba(0,0,0,0.2)]">
          {TICKERS.map((t, i) => (
            <div
              key={t.symbol}
              className={`flex items-center gap-3 px-3 py-2 ${
                i < TICKERS.length - 1 ? "border-b border-[var(--color-border)]" : ""
              }`}
            >
              <span className="w-12 shrink-0 font-mono text-[11px] tracking-[0.06em] text-[var(--color-ink-1)]">
                {t.symbol}
              </span>
              <span className="w-[68px] shrink-0 font-mono text-[10.5px] tabular-nums text-[var(--color-ink-3)]">
                {t.meta}
              </span>
              <span
                className="w-12 shrink-0 font-mono text-[10.5px] tabular-nums"
                style={{
                  color: t.positive ? "var(--color-accent)" : "var(--color-ink-2)",
                }}
              >
                {t.delta}
              </span>

              <svg
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className="h-[20px] w-[60px] shrink-0"
                aria-hidden="true"
              >
                <polyline
                  points={t.spark}
                  fill="none"
                  stroke={t.positive ? "var(--color-accent)" : "var(--color-ink-2)"}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={t.positive ? 1 : 0.55}
                />
              </svg>

              <span className="min-w-0 flex-1 truncate text-right font-mono text-[10px] text-[var(--color-ink-3)]">
                {t.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Headlines feed */}
      <section className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-ink-2)]">
            Headlines
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
            since 05:00
          </span>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {HEADLINES.map((h) => (
            <div key={h.time} className="flex items-baseline gap-3 py-1.5">
              <span className="w-10 shrink-0 font-mono text-[10px] tabular-nums text-[var(--color-ink-3)]">
                {h.time}
              </span>
              <span
                className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.16em]"
                style={{
                  color: h.hot ? "var(--color-accent)" : "var(--color-ink-3)",
                }}
              >
                {h.tag}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] leading-[1.4] text-[var(--color-ink-1)]">
                {h.text}
              </span>
              {h.hot && (
                <span
                  className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-accent)" }}
                  aria-hidden="true"
                >
                  ●
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Command bar */}
      <div className="mt-4 flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]"
          aria-hidden="true"
        >
          ⌘K
        </span>
        <span className="h-3 w-px bg-[var(--color-border)]" />
        <p className="flex-1 truncate font-display-italic text-[12px] text-[var(--color-ink-2)]">
          Ask &ldquo;what&rsquo;s the bear case on NVDA&rdquo;…
        </p>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]">
          ⏎
        </span>
      </div>
    </ProductMock>
  );
}
