// The design's living celestial background: a faint drifting nebula (subtle
// blue + gold glows), a vignette that deepens the edges, and a fine grain
// overlay. Fixed behind all content; pairs with the canvas Starfield.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AmbientLayers() {
  return (
    <>
      {/* drifting nebula */}
      <div aria-hidden className="pointer-events-none fixed inset-[-20%] -z-[9] blur-[40px]">
        <span
          className="sd-neb absolute rounded-full"
          style={{
            width: "60vw",
            height: "60vw",
            left: "4%",
            top: "2%",
            background: "radial-gradient(circle, rgba(108,216,255,0.10), transparent 62%)",
            animation: "sd-drift1 34s ease-in-out infinite alternate",
          }}
        />
        <span
          className="sd-neb absolute rounded-full"
          style={{
            width: "55vw",
            height: "55vw",
            right: "2%",
            top: "16%",
            background: "radial-gradient(circle, rgba(240,179,90,0.085), transparent 60%)",
            animation: "sd-drift2 40s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[8]"
        style={{
          background:
            "radial-gradient(130% 110% at 50% 36%, transparent 38%, rgba(10,8,6,0.55) 100%), linear-gradient(to bottom, rgba(10,8,6,0.18), transparent 22%, transparent 78%, rgba(10,8,6,0.42))",
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[8] opacity-[0.05] [mix-blend-mode:overlay]"
        style={{ backgroundImage: GRAIN }}
      />

      <style>{`
        @keyframes sd-drift1 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(6%,5%,0) scale(1.12); } }
        @keyframes sd-drift2 { from { transform: translate3d(0,0,0) scale(1.05); } to { transform: translate3d(-7%,-4%,0) scale(0.95); } }
        @media (prefers-reduced-motion: reduce) { .sd-neb { animation: none !important; } }
      `}</style>
    </>
  );
}
