// Hero — the operating system for your business. Confident serif headline,
// one-line explanation of the two-layer loop, waitlist CTA, then the living
// system loop and the tools it runs inside. Server-rendered; the orb and form
// hydrate as client islands.
import type { CSSProperties } from "react";

import { WaitlistForm } from "@/components/ui/waitlist-form";
import { HeroDemo } from "@/components/os/hero-demo";
import { DESIGN_LOGOS } from "@/components/sirius-design/logos";

const d = (v: number) => ({ "--d": `${v}s` }) as CSSProperties;

export function Hero() {
  return (
    <section id="hero" className="os-hero">
      <div className="os-container">
        <div className="os-hero__inner">
          <p className="os-hero__eyebrow os-reveal" style={d(0)}>
            <span className="dot" aria-hidden="true" />
            The operating system for your business
          </p>

          <h1 className="os-hero__title">
            <span className="line os-reveal" style={d(0.08)}>It learns how your business runs.</span>
            <span className="line accent os-reveal" style={d(0.16)}>Then it does the work.</span>
          </h1>

          <p className="os-hero__sub os-reveal" style={d(0.26)}>
            Sirus turns every meeting, email, and message into one living picture of
            your company — sees what&rsquo;s slipping, and ships the work to fix it across
            the tools you already use. The more it does, the sharper it gets.
          </p>

          <div className="os-hero__cta os-reveal" style={d(0.34)}>
            <div className="os-hero__form">
              <WaitlistForm />
            </div>
          </div>

          <p className="os-hero__proof os-reveal" style={d(0.42)}>
            <span className="live">●</span> Now rolling out to teams.
          </p>
        </div>

        <HeroDemo />

        <div className="os-integrations os-reveal" style={d(0.6)}>
          <p className="os-integrations__label">Runs inside the tools you already run on</p>
          <ul className="os-integrations__list">
            {DESIGN_LOGOS.map(({ name, Mark }) => (
              <li key={name} className="os-integrations__mark" title={name}>
                <Mark />
              </li>
            ))}
            <li className="os-integrations__more">+ anything with an API</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
