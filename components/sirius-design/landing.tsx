// Faithful React port of the design's hero.jsx + sections.jsx. Markup/classes
// mirror the prototype (styles live in app/sirius-design.css, scoped under .sd);
// copy is read from content/landing.ts. The one-app and final-CTA sections are
// intentionally OURS (rendered from page.tsx), and the orb sits in a dark well.
import type { CSSProperties } from "react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { WorldGraph } from "@/components/sirius/world-graph";
import { SectionLabel } from "@/components/ui/section-label";
import { ScrollLink } from "@/components/layout/scroll-link";
import { DESIGN_LOGOS, FOOTER_LOGOS } from "@/components/sirius-design/logos";
import { JobsRoster } from "@/components/sections/jobs-roster";
import { LoopFlywheel } from "@/components/sirius/loop-flywheel";
import { TeamConstellation } from "@/components/sirius/team-constellation";

const d = (v: number) => ({ "--d": `${v}s` }) as CSSProperties;

/* ── Chrome ──────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { id: "knows", label: "What it knows" },
  { id: "does", label: "What it does" },
  { id: "loop", label: "The loop" },
  { id: "team", label: "For your team" },
];

function CTAs() {
  const { requestCta } = landingContent;
  return (
    <div className="cta-row">
      <ScrollLink id="cta" className="btn btn-primary">
        {requestCta.label}
      </ScrollLink>
      <ScrollLink id="knows" className="btn btn-ghost">
        See it work
        <span className="arrow" aria-hidden="true"> →</span>
      </ScrollLink>
    </div>
  );
}

function OrbStage() {
  return (
    <div className="orb-stage">
      <div className="orb-well" aria-hidden="true" />
      <div className="orb-core">
        <Orb interactive className="pointer-events-auto !h-[clamp(216px,29vw,288px)] !w-[clamp(216px,29vw,288px)]" />
      </div>
    </div>
  );
}

function Integrations() {
  return (
    <div className="integrations is-centered">
      <span className="integrations-label">Works inside</span>
      <ul className="integrations-list">
        {DESIGN_LOGOS.map(({ name, Mark }) => (
          <li key={name} className="intg" title={name}>
            <span className="intg-mark">
              <Mark />
            </span>
            <span className="intg-name">{name}</span>
          </li>
        ))}
      </ul>
      <span className="integrations-more">+ anything with an API</span>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────── */
export function SiriusHero() {
  const { title, titleAccent, description } = landingContent.hero;
  return (
    <section id="hero" className="hero hero-centered" data-screen-label="Hero">
      <div className="hero-inner centered-inner">
        <div className="centered-orb reveal-orb">
          <OrbStage />
        </div>
        <div className="hero-text is-centered">
          <h1 className="headline font-display">
            <span className="headline-line reveal" style={d(0.14)}>
              {title}
            </span>
            <span className="headline-line reveal accent italic" style={d(0.23)}>
              {titleAccent}
            </span>
          </h1>
          <p className="sub reveal" style={d(0.34)}>
            {description}
          </p>
          <div className="reveal" style={d(0.44)}>
            <CTAs />
          </div>
          <div className="proof reveal" style={d(0.54)}>
            <span className="proof-line">{landingContent.hero.proof}</span>
          </div>
        </div>
        <div className="reveal" style={d(0.64)}>
          <Integrations />
        </div>
      </div>
    </section>
  );
}

/* ── §2 · Information layer — "What it knows" ────────────────────────── */
export function InformationLayerSection() {
  const { eyebrow, title, lead, pillars } = landingContent.informationLayer;
  return (
    <section id="knows" className="section" data-screen-label="What it knows">
      <div className="container">
        <div className="learns">
          <div>
            <SectionLabel variant="layer" tone="info" ordinal="01" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
            <div className="pillars">
              {pillars.map((p, i) => (
                <div key={p.title} className="pillar reveal" style={d(0.18 + 0.06 * i)}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={d(0.16)}>
            <WorldGraph className="world-graph" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── §3 · Operation layer — "What it does" ───────────────────────────── */
export function OperationLayerSection() {
  const { eyebrow, title, lead } = landingContent.operationLayer;
  return (
    <section id="does" className="section band-deep" data-screen-label="What it does">
      <div className="container">
        <div className="section-head">
          <SectionLabel variant="layer" tone="op" ordinal="02" className="reveal" style={d(0)}>
            {eyebrow}
          </SectionLabel>
          <h2 className="section-title reveal" style={d(0.06)}>
            {title}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {lead}
          </p>
        </div>
        <div className="reveal" style={d(0.16)}>
          <JobsRoster />
        </div>
      </div>
    </section>
  );
}

/* ── §4 · The loop ───────────────────────────────────────────────────── */
export function LoopSection() {
  const { eyebrow, title, lead } = landingContent.theLoop;
  return (
    <section id="loop" className="section" data-screen-label="The loop">
      <div className="container">
        <div className="learns">
          <div>
            <SectionLabel tone="neutral" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
          </div>
          <div className="reveal" style={d(0.16)}>
            <LoopFlywheel className="loop-figure" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── §5 · For your team ──────────────────────────────────────────────── */
export function ForYourTeamSection() {
  const { eyebrow, title, lead } = landingContent.perEmployee;
  return (
    <section id="team" className="section band-deep" data-screen-label="For your team">
      <div className="container">
        <div className="learns">
          <div className="reveal" style={d(0.16)}>
            <TeamConstellation className="team-figure" />
          </div>
          <div>
            <SectionLabel tone="neutral" className="reveal" style={d(0)}>
              {eyebrow}
            </SectionLabel>
            <h2 className="section-title reveal" style={d(0.06)}>
              {title}
            </h2>
            <p className="section-lead reveal" style={d(0.12)}>
              {lead}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── §7 · Maker quote ────────────────────────────────────────────────── */
export function MakerSection() {
  const { quote, signature } = landingContent.maker;
  return (
    <section className="section section-tight" data-screen-label="Why we built it">
      <div className="container">
        <figure className="mx-auto max-w-[60ch] text-center">
          <blockquote className="font-display reveal text-[clamp(1.4rem,3vw,2.1rem)] font-light leading-[1.3] tracking-[-0.015em] text-[var(--color-ink-1)]" style={d(0)}>
            &ldquo;{quote}&rdquo;
          </blockquote>
          <figcaption className="reveal mt-6 text-[13px] uppercase tracking-[0.18em] text-[var(--color-ink-3)]" style={d(0.1)}>
            {signature}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────── */
export function SiriusFooter() {
  const { footer } = landingContent;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#hero" className="wordmark" aria-label="Sirius home">
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.25) 100%)",
                }}
              />
              <Orb className="!h-7 !w-7 relative" glowless />
            </span>
            <span className="font-display">Sirius</span>
          </a>
          <p className="footer-blurb">{footer.blurb}</p>
          <div className="footer-logos" aria-hidden="true">
            {FOOTER_LOGOS.map(({ name, Mark }) => (
              <span key={name} className="footer-logo">
                <Mark />
              </span>
            ))}
          </div>
        </div>
        <nav className="footer-cols">
          <div className="footer-col">
            <span className="footer-h">Product</span>
            {NAV_LINKS.map((l) => (
              <ScrollLink key={l.id} id={l.id}>
                {l.label}
              </ScrollLink>
            ))}
          </div>
        </nav>
      </div>
      <div className="footer-base">
        <span>© 2026 Sirius</span>
        <span>Made for people with too much to do.</span>
      </div>
    </footer>
  );
}
