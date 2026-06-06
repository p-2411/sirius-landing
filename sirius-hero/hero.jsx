/* global React, SiriusOrbRenderer, LOGOS */
const { useState, useEffect, useRef } = React;

/* ──────────────────────────────────────────────────────────────────────
   Hero copy — founders & operators: leverage, delegation, reliability.
   ────────────────────────────────────────────────────────────────────── */
const HEADLINES = {
  knows: {
    eyebrow: "The next step in agentic assistants",
    lines: ["It knows you.", "It does the work."],
    accentLine: 1,
    sub: "Sirius remembers your projects, your clients, your whole stack — then acts across Gmail, Slack, Notion, GitHub, and anything with an API. The work you repeat becomes a workflow that runs the same way, every time.",
  },
  delegate: {
    eyebrow: "An assistant, in the proper sense",
    lines: ["Delegate the work,", "not just the thinking."],
    accentLine: 1,
    sub: "Sirius knows you and acts across every tool you live in. Turn the things you do over and over into deterministic workflows — twice as fast, far more reliable, a fraction of the cost.",
  },
  prompting: {
    eyebrow: "The next step in agentic assistants",
    lines: ["Stop prompting.", "Start delegating."],
    accentLine: 1,
    sub: "Most assistants forget you the moment the chat ends. Sirius remembers everything, works inside your tools, and runs your repeat work as workflows that execute the same way every time.",
  },
};

/* ──────────────────────────────────────────────────────────────────────
   Orb — mounts the canvas plasma renderer.
   ────────────────────────────────────────────────────────────────────── */
function Orb({ size, tint, interactive }) {
  const canvasRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const orb = new SiriusOrbRenderer(canvas, {
      mouseEnabled: interactive,
      breatheAmp: 0.014,
      yawSpeed: 0.12,
      tint: tint,
    });
    orbRef.current = orb;
    return () => orb.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  useEffect(() => {
    if (orbRef.current) orbRef.current.setTint(tint);
  }, [tint]);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={340}
      style={{
        width: size, height: size, display: "block",
        filter: "blur(0.45px)",
        transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), height 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
      aria-hidden="true"
    />
  );
}

function OrbStage({ size, tint, bloom, halo, interactive, glowColor }) {
  return (
    <div className="orb-stage" style={{ width: size, height: size }}>
      <div
        className="orb-bloom"
        style={{
          background: `radial-gradient(circle, ${glowColor(0.42 * bloom)} 0%, ${glowColor(0.13 * bloom)} 30%, transparent 62%)`,
          opacity: bloom,
        }}
      />
      {halo && (
        <div
          className="orb-halo"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${glowColor(0.16 * bloom)} 40deg, transparent 90deg, transparent 180deg, ${glowColor(0.10 * bloom)} 220deg, transparent 270deg, transparent 360deg)`,
          }}
        />
      )}
      <div className="orb-core">
        <Orb size={size} tint={tint} interactive={interactive} />
      </div>
    </div>
  );
}

/* ── Shared chrome ─────────────────────────────────────────────────────── */
function AppleGlyph() {
  return (
    <svg width="15" height="18" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" style={{ marginRight: 2, marginTop: -1 }}>
      <path d="M11.6 9.04c-.02-1.86 1.52-2.75 1.59-2.8-.87-1.27-2.22-1.44-2.7-1.46-1.15-.12-2.24.67-2.83.67-.58 0-1.48-.65-2.43-.64-1.25.02-2.4.73-3.05 1.84-1.3 2.26-.33 5.6.94 7.43.62.9 1.36 1.9 2.33 1.86.94-.04 1.29-.6 2.42-.6 1.13 0 1.45.6 2.43.58 1-.02 1.64-.91 2.25-1.81.71-1.04 1-2.05 1.02-2.1-.02-.01-1.96-.75-1.98-2.98zM9.77 3.3c.52-.63.87-1.5.77-2.38-.75.03-1.65.5-2.18 1.13-.48.55-.9 1.44-.78 2.29.83.06 1.68-.42 2.19-1.04z" />
    </svg>
  );
}

function Wordmark() {
  return (
    <a href="#" className="wordmark" aria-label="Sirius home">
      <span className="wordmark-dot" aria-hidden="true" />
      <span className="font-display">Sirius</span>
    </a>
  );
}

function Nav() {
  return (
    <header className="nav">
      <Wordmark />
      <nav className="nav-links">
        <a href="#what">What it does</a>
        <a href="#how">How it works</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <a href="#cta" className="btn btn-quiet nav-cta">Download for Mac</a>
    </header>
  );
}

function CTAs() {
  return (
    <div className="cta-row">
      <a href="#cta" className="btn btn-primary">
        <AppleGlyph />
        Download for Mac
      </a>
      <a href="#what" className="btn btn-ghost">
        See it work
        <span className="arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function Integrations({ centered }) {
  return (
    <div className={"integrations" + (centered ? " is-centered" : "")}>
      <span className="integrations-label">Works inside</span>
      <span className="integrations-rule" aria-hidden="true" />
      <ul className="integrations-list">
        {LOGOS.map(({ name, Mark }) => (
          <li key={name} className="intg" title={name}>
            <span className="intg-mark"><Mark /></span>
            <span className="intg-name">{name}</span>
          </li>
        ))}
      </ul>
      <span className="integrations-more">+ anything with an API</span>
    </div>
  );
}

function ScrollCue() {
  return (
    <div className="scroll-cue" aria-hidden="true">
      <span className="scroll-cue-line" />
      <span className="scroll-cue-label">Scroll</span>
    </div>
  );
}

function HeroText({ data, centered, onBackdrop }) {
  return (
    <div className={"hero-text" + (centered ? " is-centered" : "") + (onBackdrop ? " on-backdrop" : "")}>
      <div className="eyebrow reveal" style={{ "--d": "0.05s" }}>
        <span className="eyebrow-dot" aria-hidden="true" />
        {data.eyebrow}
      </div>
      <h1 className="headline font-display">
        {data.lines.map((line, i) => (
          <span
            key={i}
            className={"headline-line reveal" + (i === data.accentLine ? " accent italic" : "")}
            style={{ "--d": 0.14 + i * 0.09 + "s" }}
          >
            {line}
          </span>
        ))}
      </h1>
      <p className="sub reveal" style={{ "--d": "0.34s" }}>{data.sub}</p>
      <div className="reveal" style={{ "--d": "0.44s" }}>
        <CTAs />
      </div>
      <div className="proof reveal" style={{ "--d": "0.54s" }}>
        <span className="proof-line">Free to start</span>
        <span className="proof-dot" aria-hidden="true" />
        <span className="proof-line">Runs entirely on your Mac</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   HeroSection — three layouts, driven by tweaks.
   ────────────────────────────────────────────────────────────────────── */
function HeroSection({ t }) {
  const data = HEADLINES[t.headline] || HEADLINES.knows;
  const tint = t.orbColor === "gold" ? 1 : 0;
  const glowColor = (a) =>
    t.orbColor === "gold" ? `rgba(240, 179, 90, ${a})` : `rgba(108, 200, 255, ${a})`;

  const layout = t.layout;
  const orbBaseSize = layout === "backdrop" ? 640 : layout === "split" ? 430 : 286;
  const orbSize = Math.round(orbBaseSize * t.orbSize);

  const orbProps = { size: orbSize, tint, halo: t.halo, interactive: true, glowColor };

  if (layout === "backdrop") {
    return (
      <section id="top" className="hero hero-backdrop" data-screen-label="Hero">
        <div className="backdrop-orb reveal-orb">
          <OrbStage {...orbProps} bloom={t.bloom * 0.85} />
        </div>
        <div className="hero-inner backdrop-inner">
          <HeroText data={data} centered={true} onBackdrop={true} />
          <div className="reveal" style={{ "--d": "0.64s" }}>
            <Integrations centered={true} />
          </div>
        </div>
        <ScrollCue />
      </section>
    );
  }

  if (layout === "split") {
    return (
      <section id="top" className="hero hero-split" data-screen-label="Hero">
        <div className="hero-inner split-inner">
          <div className="split-text">
            <HeroText data={data} centered={false} />
            <div className="reveal" style={{ "--d": "0.64s" }}>
              <Integrations centered={false} />
            </div>
          </div>
          <div className="split-orb reveal-orb">
            <OrbStage {...orbProps} bloom={t.bloom} />
          </div>
        </div>
        <ScrollCue />
      </section>
    );
  }

  return (
    <section id="top" className="hero hero-centered" data-screen-label="Hero">
      <div className="hero-inner centered-inner">
        <div className="centered-orb reveal-orb">
          <OrbStage {...orbProps} bloom={t.bloom} />
        </div>
        <HeroText data={data} centered={true} />
        <div className="reveal" style={{ "--d": "0.64s" }}>
          <Integrations centered={true} />
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}

/* ── Base + hero styles (injected once) ─────────────────────────────────── */
const HERO_CSS = `
.page { position: relative; min-height: 100vh; }
a { color: inherit; text-decoration: none; }

/* Shared section scaffolding */
.section { position: relative; z-index: 3; padding-block: clamp(84px, 12vh, 150px); }
.container { max-width: 1200px; margin: 0 auto; padding-inline: clamp(20px, 4vw, 56px); }
.section-eyebrow {
  display: inline-flex; align-items: center; gap: 9px; white-space: nowrap;
  font-size: 12.5px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-3); font-weight: 500;
}
.section-eyebrow .eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.7); }
.section-title {
  font-family: var(--font-display); font-weight: 400; letter-spacing: -0.028em;
  font-size: clamp(2rem, 4vw, 3.3rem); line-height: 1.05; color: var(--ink-1);
  margin: 18px 0 0; text-wrap: balance;
}
.section-title .accent-italic { font-style: italic; color: var(--accent); }
.section-lead {
  margin: 20px 0 0; max-width: 620px; font-size: clamp(1.02rem, 1.3vw, 1.18rem);
  line-height: 1.6; color: var(--ink-2); text-wrap: pretty;
}
.band-deep { background: var(--color-surface-deep, #14110D); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }

/* ── Nav ─────────────────────────────────────────────── */
.nav {
  position: relative; z-index: 5;
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1320px; margin: 0 auto;
  padding: 28px clamp(20px, 4vw, 56px) 0;
}
.wordmark { display: inline-flex; align-items: center; gap: 10px; font-size: 21px; letter-spacing: -0.01em; color: var(--ink-1); }
.wordmark-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #cfeeff, var(--star) 60%, #2a87c0);
  box-shadow: 0 0 10px rgba(var(--star-rgb), 0.8), 0 0 22px rgba(var(--star-rgb), 0.4);
}
.nav-links { display: flex; gap: clamp(18px, 2.4vw, 38px); }
.nav-links a { color: var(--ink-3); font-size: 14.5px; transition: color 0.2s ease; }
.nav-links a:hover { color: var(--ink-1); }
@media (max-width: 720px) { .nav-links { display: none; } }
.nav-cta { font-size: 14.5px; }

/* ── Buttons ─────────────────────────────────────────── */
.btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  gap: 0.5rem; cursor: pointer; white-space: nowrap; user-select: none;
  font-weight: 500; letter-spacing: 0.01em; outline: none; text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease, color 0.2s ease, transform 0.12s ease;
}
.btn-primary {
  height: 3rem; padding-inline: 1.7rem; border-radius: 9999px;
  color: #1b1712; background-color: var(--accent);
  box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 14px 40px -16px rgba(var(--accent-rgb), 0.7);
}
.btn-primary:hover { background-color: var(--accent-strong); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0) scale(0.99); }
.btn-ghost {
  height: 3rem; padding-inline: 1.5rem; border-radius: 9999px;
  color: var(--ink-1); border: 1px solid var(--border-strong); background-color: transparent;
}
.btn-ghost:hover { border-color: rgba(var(--accent-rgb), 0.55); background-color: rgba(var(--accent-rgb), 0.06); box-shadow: 0 10px 30px -14px rgba(var(--accent-rgb), 0.45); }
.btn-ghost .arrow { transition: transform 0.2s ease; }
.btn-ghost:hover .arrow { transform: translateX(3px); }
.btn-quiet { color: var(--ink-2); }
.btn-quiet:hover { color: var(--ink-1); text-decoration: underline; text-underline-offset: 6px; text-decoration-color: rgba(var(--accent-rgb), 0.55); }

/* ── Hero shells ─────────────────────────────────────── */
.hero { position: relative; z-index: 3; }
.hero-inner { max-width: 1320px; margin: 0 auto; padding-inline: clamp(20px, 4vw, 56px); }
.hero-centered, .hero-backdrop, .hero-split { min-height: calc(100vh - 90px); display: flex; align-items: center; }

.centered-inner { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; padding-block: clamp(10px, 2.2vh, 30px); }
.centered-orb { margin-bottom: clamp(2px, 1vh, 14px); }

.split-inner { display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: clamp(24px, 4vw, 64px); width: 100%; padding-block: clamp(24px, 5vh, 56px); }
.split-orb { display: flex; justify-content: center; }
@media (max-width: 900px) {
  .split-inner { grid-template-columns: 1fr; text-align: center; }
  .split-text .hero-text { align-items: center; text-align: center; }
  .split-text .integrations { justify-content: center; }
  .split-orb { order: -1; }
}

.hero-backdrop { position: relative; overflow: hidden; }
.backdrop-orb { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 0; opacity: 0.85; }
.backdrop-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; width: 100%; padding-block: clamp(40px, 8vh, 90px); }
.hero-backdrop .headline { text-shadow: 0 2px 40px rgba(10,8,6,0.6); }
.hero-backdrop .sub { text-shadow: 0 1px 24px rgba(10,8,6,0.85); }

/* ── Orb stage ───────────────────────────────────────── */
.orb-stage { position: relative; display: flex; align-items: center; justify-content: center; overflow: visible; }
.orb-bloom { position: absolute; inset: -42%; border-radius: 50%; filter: blur(20px); transition: opacity 0.4s ease; pointer-events: none; }
.orb-halo {
  position: absolute; width: 168%; height: 168%; border-radius: 50%;
  filter: blur(26px); opacity: 0.85; pointer-events: none;
  animation: halo-spin 22s linear infinite;
}
@keyframes halo-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .orb-halo { animation: none; } }
.orb-core { position: relative; z-index: 2; }

/* ── Hero text ───────────────────────────────────────── */
.hero-text { display: flex; flex-direction: column; max-width: 600px; }
.hero-text.is-centered { align-items: center; text-align: center; max-width: 760px; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 9px;
  font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-3); margin-bottom: 16px; font-weight: 500;
}
.eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.7); }
.headline {
  margin: 0; font-weight: 400; line-height: 1.06; letter-spacing: -0.03em;
  font-size: clamp(1.7rem, 5.8vw, 4.5rem); color: var(--ink-1);
}
.is-centered .headline { letter-spacing: -0.032em; }
.headline-line { display: block; white-space: nowrap; }
.headline-line.accent { color: var(--accent); }
.headline-line.italic { font-style: italic; font-variation-settings: "opsz" 144; }
.sub {
  margin: 22px 0 0; max-width: 540px;
  font-size: clamp(1.04rem, 1.35vw, 1.2rem); line-height: 1.6; color: var(--ink-2); text-wrap: pretty;
}
.is-centered .sub { max-width: 620px; }
.cta-row { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
.is-centered .cta-row { justify-content: center; }
.proof { display: flex; align-items: center; gap: 12px; margin-top: 18px; font-size: 13px; color: var(--ink-4); }
.is-centered .proof { justify-content: center; }
.proof-line { white-space: nowrap; }
.proof-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-4); }

/* ── Integrations (real logos) ───────────────────────── */
.integrations { display: flex; align-items: center; gap: clamp(14px, 1.6vw, 22px); margin-top: clamp(22px, 3.4vh, 42px); flex-wrap: wrap; }
.integrations.is-centered { justify-content: center; }
.integrations-label { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-4); white-space: nowrap; }
.integrations-rule { width: 28px; height: 1px; background: linear-gradient(90deg, var(--border-strong), transparent); }
.integrations.is-centered .integrations-rule { display: none; }
.integrations-list { display: flex; align-items: center; gap: clamp(14px, 1.8vw, 26px); list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
.integrations-list li.intg { display: flex; align-items: center; gap: 8px; }
.intg-mark { width: 22px; height: 22px; display: block; opacity: 0.94; transition: opacity 0.2s ease, transform 0.2s ease; }
.intg-name { font-size: 14px; color: var(--ink-3); transition: color 0.2s ease; }
.intg:hover .intg-mark { opacity: 1; transform: translateY(-1px); }
.intg:hover .intg-name { color: var(--ink-1); }
.integrations-more { font-size: 13px; color: var(--ink-4); border: 1px dashed var(--border-strong); padding: 5px 12px; border-radius: 9999px; white-space: nowrap; }
@media (max-width: 560px) { .intg-name { display: none; } }

/* ── Scroll cue ──────────────────────────────────────── */
.scroll-cue { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 4; opacity: 0; animation: cue-in 0.8s ease 1.1s forwards; }
.scroll-cue-line { width: 1px; height: 30px; background: linear-gradient(to bottom, transparent, var(--ink-4)); animation: cue-pulse 2.2s ease-in-out infinite; transform-origin: top; }
.scroll-cue-label { font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-4); }
@keyframes cue-in { to { opacity: 1; } }
@keyframes cue-pulse { 0%, 100% { transform: scaleY(0.5); opacity: 0.4; } 50% { transform: scaleY(1); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .scroll-cue { animation: none; opacity: 1; } .scroll-cue-line { animation: none; } }

/* ── Reveal (CSS, transform-only so opacity is always 1 → content is visible
   even when the compositor/animation clock is frozen in a non-foreground
   frame; the slide-up only enhances when animations actually run) ───────── */
@keyframes reveal-up { from { transform: translateY(22px); } to { transform: none; } }
@keyframes reveal-orb-in { from { transform: scale(0.95); } to { transform: none; } }
.reveal { animation: reveal-up 0.75s cubic-bezier(0.22,1,0.36,1) both; animation-delay: var(--d, 0s); }
.reveal-orb { animation: reveal-orb-in 1s cubic-bezier(0.22,1,0.36,1) both; animation-delay: var(--d, 0s); }
@media (prefers-reduced-motion: reduce) { .reveal, .reveal-orb { animation: none; } }

@media (max-width: 560px) { .cta-row .btn { flex: 1 1 auto; } }
`;

document.head.insertAdjacentHTML("beforeend", `<style id="hero-css">${HERO_CSS}</style>`);
