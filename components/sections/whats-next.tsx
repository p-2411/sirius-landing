import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";

// Canis Major asterism. `mag` follows astronomical convention (lower = brighter).
type Tier = "sirius" | "bright" | "mid" | "dim" | "faint";

type StarDef = {
  name: string;
  cx: number;
  cy: number;
  mag: number;
  tier: Tier;
  haloId: string;
  spikeId: string;
};

const HALO_STD = "wn-halo";
const HALO_SIRIUS = "wn-halo-sirius";
const HALO_WARM = "wn-halo-warm";
const SPIKE_STD = "wn-spike";
const SPIKE_SIRIUS = "wn-spike-sirius";

const SIRIUS: StarDef = {
  name: "Sirius",
  cx: 210, cy: 130, mag: -1.46, tier: "sirius",
  haloId: HALO_SIRIUS, spikeId: SPIKE_SIRIUS,
};

const STARS: StarDef[] = [
  { name: "Adhara",    cx: 220, cy: 304, mag: 1.50, tier: "bright", haloId: HALO_STD,  spikeId: SPIKE_STD },
  { name: "Wezen",     cx: 280, cy: 232, mag: 1.83, tier: "bright", haloId: HALO_WARM, spikeId: SPIKE_STD }, // F8 — warmer
  { name: "Mirzam",    cx:  98, cy: 154, mag: 1.98, tier: "mid",    haloId: HALO_STD,  spikeId: SPIKE_STD },
  { name: "Aludra",    cx: 364, cy: 278, mag: 2.45, tier: "mid",    haloId: HALO_STD,  spikeId: SPIKE_STD },
  { name: "Furud",     cx:  96, cy: 312, mag: 3.02, tier: "dim",    haloId: HALO_STD,  spikeId: SPIKE_STD },
  { name: "Muliphein", cx: 286, cy:  92, mag: 4.11, tier: "faint",  haloId: HALO_STD,  spikeId: SPIKE_STD },
];

const ASTERISM: [number, number, number, number][] = [
  [98, 154, SIRIUS.cx, SIRIUS.cy],
  [SIRIUS.cx, SIRIUS.cy, 286, 92],
  [98, 154, 96, 312],
  [SIRIUS.cx, SIRIUS.cy, 280, 232],
  [280, 232, 220, 304],
  [280, 232, 364, 278],
  [220, 304, 96, 312],
];

type Sizing = {
  halo: number;       // halo circle radius
  core: number;       // hard pinpoint radius
  spikeLen: number;   // primary spike half-length (rx of horizontal spike ellipse)
  spikeW: number;     // primary spike half-width  (ry of horizontal spike ellipse)
  diagLen?: number;   // diagonal spike half-length (Sirius only)
  diagW?: number;     // diagonal spike half-width
};

function tier2sizing(tier: Tier): Sizing {
  switch (tier) {
    case "sirius":
      return { halo: 26, core: 1.3, spikeLen: 50, spikeW: 1.0, diagLen: 30, diagW: 0.7 };
    case "bright":
      return { halo: 14, core: 0.95, spikeLen: 22, spikeW: 0.55 };
    case "mid":
      return { halo: 10, core: 0.8,  spikeLen: 16, spikeW: 0.42 };
    case "dim":
      return { halo:  6, core: 0.65, spikeLen: 10, spikeW: 0.32 };
    case "faint":
      return { halo:  3.4, core: 0.5, spikeLen: 0, spikeW: 0 };
  }
}

function StarGlyph({ star, primary = false }: { star: StarDef; primary?: boolean }) {
  const { cx, cy } = star;
  const s = tier2sizing(star.tier);

  return (
    <g>
      {/* Halo — single radial-gradient circle */}
      <circle
        cx={cx}
        cy={cy}
        r={s.halo}
        fill={`url(#${star.haloId})`}
      />

      {/* Horizontal spike — elongated ellipse with radial gradient
          (gradient stretches with the ellipse, tapering at both ends and in width) */}
      {s.spikeLen > 0 && (
        <ellipse
          cx={cx}
          cy={cy}
          rx={s.spikeLen}
          ry={s.spikeW}
          fill={`url(#${star.spikeId})`}
        />
      )}

      {/* Vertical spike */}
      {s.spikeLen > 0 && (
        <ellipse
          cx={cx}
          cy={cy}
          rx={s.spikeW}
          ry={s.spikeLen}
          fill={`url(#${star.spikeId})`}
        />
      )}

      {/* Diagonal spikes — Sirius only, the elegant 8-pt sparkle */}
      {primary && s.diagLen && s.diagW && (
        <g transform={`rotate(45 ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={s.diagLen} ry={s.diagW} fill={`url(#${star.spikeId})`} opacity="0.7" />
          <ellipse cx={cx} cy={cy} rx={s.diagW} ry={s.diagLen} fill={`url(#${star.spikeId})`} opacity="0.7" />
        </g>
      )}

      {/* Bright pinpoint core */}
      <circle cx={cx} cy={cy} r={s.core} fill="rgba(255, 255, 255, 1)" />
    </g>
  );
}

function StarCluster() {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      aria-hidden="true"
      className="whats-next-cluster w-full max-w-[600px] h-auto"
    >
      <defs>
        {/* Standard halo — blue-white with bright center, smooth fade */}
        <radialGradient id="wn-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 255, 255, 0.85)" />
          <stop offset="8%"   stopColor="rgba(238, 246, 255, 0.55)" />
          <stop offset="22%"  stopColor="rgba(216, 232, 254, 0.22)" />
          <stop offset="48%"  stopColor="rgba(190, 215, 250, 0.07)" />
          <stop offset="100%" stopColor="rgba(180, 210, 250, 0)"    />
        </radialGradient>

        {/* Sirius halo — same shape, bigger reach via wider stop spread */}
        <radialGradient id="wn-halo-sirius" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 255, 255, 1)"    />
          <stop offset="5%"   stopColor="rgba(248, 252, 255, 0.78)" />
          <stop offset="14%"  stopColor="rgba(228, 242, 255, 0.42)" />
          <stop offset="32%"  stopColor="rgba(202, 224, 252, 0.16)" />
          <stop offset="62%"  stopColor="rgba(180, 210, 250, 0.04)" />
          <stop offset="100%" stopColor="rgba(180, 210, 250, 0)"    />
        </radialGradient>

        {/* Wezen (F8) halo — warmer cream tint */}
        <radialGradient id="wn-halo-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 252, 240, 0.85)" />
          <stop offset="8%"   stopColor="rgba(252, 244, 220, 0.5)"  />
          <stop offset="24%"  stopColor="rgba(248, 234, 200, 0.18)" />
          <stop offset="52%"  stopColor="rgba(240, 220, 180, 0.05)" />
          <stop offset="100%" stopColor="rgba(240, 220, 180, 0)"    />
        </radialGradient>

        {/* Spike — radial gradient inside an elongated ellipse:
            stretches to the ellipse aspect ratio, producing a streak
            that's brightest at center and fades smoothly toward the tips */}
        <radialGradient id="wn-spike" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 255, 255, 0.95)" />
          <stop offset="14%"  stopColor="rgba(232, 244, 255, 0.65)" />
          <stop offset="42%"  stopColor="rgba(212, 232, 254, 0.18)" />
          <stop offset="100%" stopColor="rgba(212, 232, 254, 0)"    />
        </radialGradient>

        {/* Sirius spike — sharper falloff, brighter center */}
        <radialGradient id="wn-spike-sirius" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255, 255, 255, 1)"    />
          <stop offset="10%"  stopColor="rgba(244, 250, 255, 0.85)" />
          <stop offset="32%"  stopColor="rgba(216, 234, 254, 0.32)" />
          <stop offset="68%"  stopColor="rgba(200, 224, 252, 0.06)" />
          <stop offset="100%" stopColor="rgba(200, 224, 252, 0)"    />
        </radialGradient>

        {/* Faint Milky Way nebulosity — Canis Major sits on the band */}
        <radialGradient id="wn-milkyway" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(168, 192, 232, 0.085)" />
          <stop offset="38%"  stopColor="rgba(140, 170, 220, 0.04)"  />
          <stop offset="78%"  stopColor="rgba(120, 150, 210, 0.012)" />
          <stop offset="100%" stopColor="rgba(120, 150, 210, 0)"     />
        </radialGradient>
      </defs>

      {/* Nebulosity wash */}
      <g transform="rotate(-22 230 200)">
        <ellipse cx="230" cy="200" rx="320" ry="120" fill="url(#wn-milkyway)" />
      </g>

      {/* Asterism — barely-there hairlines */}
      <g
        stroke="rgba(225, 240, 255, 0.05)"
        strokeWidth="0.6"
        strokeLinecap="round"
      >
        {ASTERISM.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      {/* Other Canis Major stars */}
      {STARS.map((s) => (
        <StarGlyph key={s.name} star={s} />
      ))}

      {/* Sirius — primary plus 45°-rotated diagonal sparkle */}
      <StarGlyph star={SIRIUS} primary />
    </svg>
  );
}

export function WhatsNextSection() {
  const { sectionLabel, headlineLead, headlineTail, fragments } = landingContent.whatsNext;

  return (
    <section
      id="whats-next"
      className="relative scroll-mt-24 bg-black py-24 md:py-32"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-16">
          <div>
            <SectionLabel index="06" tone="warm">
              {sectionLabel}
            </SectionLabel>

            <h2 className="font-display text-balance mt-7 max-w-[22ch] text-[clamp(2.4rem,5.2vw,4rem)] leading-[0.92] tracking-[-0.005em] text-[var(--color-ink-1)] font-normal">
              {headlineLead}{" "}
              <em
                className="font-display-italic not-italic"
                style={{ color: "var(--color-accent)" }}
              >
                {headlineTail}
              </em>
            </h2>

            <div
              className="mt-14 text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]"
              aria-label="Coming soon"
            >
              <span>{fragments.join(" · ")}</span>
              <span className="wn-dots" aria-hidden="true" />
            </div>

            <style>{`
              .wn-dots::after {
                content: "";
                animation: wn-dots-cycle 1.8s steps(1, end) infinite;
                position: relative;
                top: 0.18em;
              }
              @keyframes wn-dots-cycle {
                0%, 24.999%  { content: ""; }
                25%, 49.999% { content: "▪"; }
                50%, 74.999% { content: "▪▪"; }
                75%, 100%    { content: "▪▪▪"; }
              }
              @media (prefers-reduced-motion: reduce) {
                .wn-dots::after {
                  content: "▪▪▪";
                  animation: none;
                }
              }
            `}</style>
          </div>

          <div
            className="flex items-center justify-center md:justify-end"
            aria-hidden="true"
          >
            <StarCluster />
          </div>
        </div>
      </Container>
    </section>
  );
}
