// Faithful React port of the design's hero.jsx + sections.jsx. Markup/classes
// mirror the prototype (styles live in app/sirius-design.css, scoped under .sd);
// copy is read from content/landing.ts. The one-app and final-CTA sections are
// intentionally OURS (rendered from page.tsx), and the orb sits in a dark well.
import type { CSSProperties, ReactNode } from "react";

import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { DownloadButton } from "@/components/ui/download-button";
import { ScrollLink } from "@/components/layout/scroll-link";
import { DESIGN_LOGOS } from "@/components/sirius-design/logos";

const d = (v: number) => ({ "--d": `${v}s` }) as CSSProperties;

function withAccent(title: string, accent: string): ReactNode {
  const i = title.indexOf(accent);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="accent-italic">{accent}</span>
      {title.slice(i + accent.length)}
    </>
  );
}

/* ── Chrome ──────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { id: "what-it-does", label: "What it does" },
  { id: "learns-once", label: "How it works" },
  { id: "pricing", label: "Pricing" },
];

function CTAs() {
  return (
    <div className="cta-row">
      <DownloadButton />
      <ScrollLink id="what-it-does" className="btn btn-ghost">
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
        <Orb interactive className="pointer-events-auto !h-[clamp(240px,33vw,320px)] !w-[clamp(240px,33vw,320px)]" />
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
            <span className="proof-line">Free to start</span>
            <span className="proof-dot" aria-hidden="true" />
            <span className="proof-line">Runs entirely on your Mac</span>
          </div>
        </div>
        <div className="reveal" style={d(0.64)}>
          <Integrations />
        </div>
      </div>
    </section>
  );
}

/* ── 1 · A day, mostly handled ───────────────────────────────────────── */
export function DaySection() {
  const { eyebrow, title, lead, cards } = landingContent.whatItDoes;
  return (
    <section id="what-it-does" className="section" data-screen-label="What it does">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="section-title reveal" style={d(0.06)}>
            {withAccent(title, "mostly handled.")}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {lead}
          </p>
        </div>
        <ol className="timeline">
          {cards.map((c, i) => (
            <li key={c.id} className="tl-item reveal" style={d(0.08 * i)}>
              <div className="tl-marker" aria-hidden="true">
                <span className="tl-dot" />
              </div>
              <div className="tl-time">
                <span className="tl-clock font-display">{c.time}</span>
                <span className="tl-when">{c.when}</span>
              </div>
              <div className="tl-card">
                <h3 className="tl-title">{c.title}</h3>
                <p className="tl-body">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 2 · Guide it once (reliability) ─────────────────────────────────── */
export function ReliabilitySection() {
  const { eyebrow, title, body, compare, stats } = landingContent.learnsOnce;
  return (
    <section id="learns-once" className="section band-deep" data-screen-label="How it works">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="section-title reveal" style={d(0.06)}>
            {withAccent(title, "Then just ask.")}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {body}
          </p>
        </div>

        <div className="compare reveal" style={d(0.06)}>
          <div className="cmp-card cmp-before">
            <span className="cmp-tag">{compare.before.tag}</span>
            <div className="cmp-graphic cmp-loop" aria-hidden="true">
              <span className="loop-node" />
              <span className="loop-arc" />
              <span className="loop-label">{compare.before.label}</span>
            </div>
            <p className="cmp-note">{compare.before.note}</p>
          </div>
          <div className="cmp-arrow" aria-hidden="true">
            →
          </div>
          <div className="cmp-card cmp-after">
            <span className="cmp-tag is-gold">{compare.after.tag}</span>
            <div className="cmp-graphic cmp-chain" aria-hidden="true">
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className="chain-node" />
              ))}
              <span className="chain-line" />
              <span className="loop-label is-gold">{compare.after.label}</span>
            </div>
            <p className="cmp-note">{compare.after.note}</p>
          </div>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <div key={s.unit} className="stat reveal" style={d(0.08 * i)}>
              <div className="stat-v font-display">
                {s.v}
                <span className="stat-unit">{s.unit}</span>
              </div>
              <p className="stat-note">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4 · Right brain (type-led) ──────────────────────────────────────── */
export function RoutingSection() {
  const { eyebrow, title, body } = landingContent.rightBrain;
  return (
    <section id="right-brain" className="section band-deep" data-screen-label="Model routing">
      <div className="container">
        <div className="section-head is-center">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="section-title reveal" style={d(0.06)}>
            {withAccent(title, "right brain")}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 5 · Pricing ─────────────────────────────────────────────────────── */
export function PricingSection() {
  const { eyebrow, title, tiers } = landingContent.pricing;
  return (
    <section id="pricing" className="section" data-screen-label="Pricing">
      <div className="container">
        <div className="section-head is-center">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="section-title reveal" style={d(0.06)}>
            {title}
          </h2>
        </div>
        <div className="tiers">
          {tiers.map((tier, i) => (
            <div key={tier.name} className={"tier reveal" + (tier.featured ? " is-featured" : "")} style={d(0.07 * i)}>
              {tier.featured && <span className="tier-flag">Most popular</span>}
              <div className="tier-name">{tier.name}</div>
              <div className="tier-price">
                {tier.was && <span className="tier-was">{tier.was}</span>}
                <span className="tier-amt font-display">{tier.price}</span>
                {tier.priceSuffix && <span className="tier-suffix">{tier.priceSuffix}</span>}
              </div>
              {tier.was && <div className="tier-launch">Launch price</div>}
              <p className="tier-tagline">{tier.tagline}</p>
              <ul className="tier-features">
                {tier.features.map((f) => (
                  <li key={f}>
                    <span className="tick" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <DownloadButton label={tier.cta} variant={tier.featured ? "primary" : "ghost"} className="tier-cta" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6 · Local-first vault ───────────────────────────────────────────── */
function LockGlyph() {
  return (
    <svg className="vault-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function CloudGlyph() {
  return (
    <svg className="cloud-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 3.5 3.5 0 0 0 7 18z" />
    </svg>
  );
}

export function LocalSection() {
  const { eyebrow, title, body, items } = landingContent.local;
  return (
    <section id="local" className="section section-tight" data-screen-label="Local-first">
      <div className="container local-row">
        <div className="local-copy">
          <div className="section-eyebrow reveal" style={d(0)}>
            <span className="eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="section-title reveal" style={d(0.06)}>
            {title}
          </h2>
          <p className="section-lead reveal" style={d(0.12)}>
            {body}
          </p>
        </div>
        <div className="local-visual reveal" style={d(0.12)} aria-hidden="true">
          <div className="cloud">
            <CloudGlyph />
            <span className="cloud-text">
              <span className="cloud-k">Cloud</span>
              <span className="cloud-sub">listens for triggers</span>
            </span>
          </div>
          <div className="local-link" />
          <div className="vault">
            <div className="vault-bar">
              <span className="vault-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="vault-name">Your Mac</span>
              <LockGlyph />
            </div>
            <div className="vault-items">
              {items.map((x) => (
                <span key={x} className="vault-item">
                  <span className="vi-dot" />
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
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
            {DESIGN_LOGOS.map(({ name, Mark }) => (
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
