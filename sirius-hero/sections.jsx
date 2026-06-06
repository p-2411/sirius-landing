/* global React, OrbStage, CTAs, Wordmark, LOGOS */

/* ──────────────────────────────────────────────────────────────────────
   Section content — founders & operators voice.
   ────────────────────────────────────────────────────────────────────── */
const DAY = [
  { time: "08:00", when: "before you're in", title: "Standup, posted before you are",
    body: "It pulls the week's commits, closed tickets, and threads, writes the update, and drops it in your team channel before you sit down." },
  { time: "10:45", when: "before your 11:00", title: "Your next meeting, briefed",
    body: "Fifteen minutes ahead, it gathers the last thread, open tasks, and prior notes into a one-page brief — waiting in the calendar invite." },
  { time: "14:30", when: "client email lands", title: "Client changes, already handled",
    body: "Feedback scattered across emails and a doc — it groups the changes, drafts the easy ones, and flags what actually needs you." },
  { time: "02:00", when: "while you slept", title: "The outreach you didn't send",
    body: "Fifty people, each needing a real message. It researches every one and drafts them all. You wake up to a review queue, not a blank page." },
];

const STATS = [
  { v: "2×", unit: "faster", note: "Deterministic — no agent re-reasoning each step." },
  { v: "10×", unit: "more reliable", note: "The decisions are made once. It runs the same way every time." },
  { v: "¹⁄₁₀", unit: "the cost", note: "The right-sized model for each job, not the biggest for all of them." },
];

const REPLACES = ["Automation tool", "Personal CRM", "Email management", "Personal agent", "Research desk"];

const TIERS = [
  { name: "Free", price: "$0", suffix: "", was: "", tagline: "Everything Sirius does, with limited usage.",
    features: ["Every feature — voice, chat, workflows, schedules", "Local-first: your data stays on your Mac", "Limited monthly usage"], featured: false },
  { name: "Pro", price: "$20", suffix: "/mo", was: "$30", tagline: "The same Sirius — just higher limits.",
    features: ["Everything in Free", "Much higher usage limits", "Priority model routing"], featured: true },
  { name: "Max", price: "$50", suffix: "/mo", was: "", tagline: "For heavy, all-day use.",
    features: ["Everything in Pro", "Top usage limits", "Early access to new features"], featured: false },
];

/* ── Section header ─────────────────────────────────────────────────────── */
function SectionHead({ eyebrow, title, lead, center, di = 0 }) {
  return (
    <div className={"section-head" + (center ? " is-center" : "")}>
      <div className="section-eyebrow reveal" style={{ "--d": di + "s" }}>
        <span className="eyebrow-dot" aria-hidden="true" />{eyebrow}
      </div>
      <h2 className="section-title reveal" style={{ "--d": di + 0.06 + "s" }}>{title}</h2>
      {lead && <p className="section-lead reveal" style={{ "--d": di + 0.12 + "s" }}>{lead}</p>}
    </div>
  );
}

/* ── 1 · A day, mostly handled ─────────────────────────────────────────── */
function DaySection() {
  return (
    <section id="what" className="section" data-screen-label="What it does">
      <div className="container">
        <SectionHead
          eyebrow="What it actually does"
          title={<>A day, <span className="accent-italic">mostly handled.</span></>}
          lead="While you sleep, commute, or sit in another meeting, Sirius is already moving — so the day is mostly done by the time you look."
        />
        <ol className="timeline">
          {DAY.map((d, i) => (
            <li key={d.time} className="tl-item reveal" style={{ "--d": 0.08 * i + "s" }}>
              <div className="tl-marker" aria-hidden="true"><span className="tl-dot" /></div>
              <div className="tl-time">
                <span className="tl-clock font-display">{d.time}</span>
                <span className="tl-when">{d.when}</span>
              </div>
              <div className="tl-card">
                <h3 className="tl-title">{d.title}</h3>
                <p className="tl-body">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 2 · Guide it once (reliability) ───────────────────────────────────── */
function ReliabilitySection() {
  return (
    <section id="how" className="section band-deep" data-screen-label="How it works">
      <div className="container">
        <SectionHead
          eyebrow="Why it's reliable"
          title={<>Guide it once. <span className="accent-italic">Then just ask.</span></>}
          lead="Every other agent re-thinks the task from scratch on every run — slow, inconsistent, needs babysitting. Sirius crystallizes that first run into a workflow. After that, “do the morning briefing” runs clean in seconds."
        />

        <div className="compare reveal" style={{ "--d": "0.06s" }}>
          <div className="cmp-card cmp-before">
            <span className="cmp-tag">Every other agent</span>
            <div className="cmp-graphic cmp-loop" aria-hidden="true">
              <span className="loop-node" />
              <span className="loop-arc" />
              <span className="loop-label">re-reasons every run</span>
            </div>
            <p className="cmp-note">Reloads the context, re-plans the steps, and hopes it lands the same way. It usually doesn't.</p>
          </div>
          <div className="cmp-arrow" aria-hidden="true">→</div>
          <div className="cmp-card cmp-after">
            <span className="cmp-tag is-gold">Sirius</span>
            <div className="cmp-graphic cmp-chain" aria-hidden="true">
              {[0, 1, 2, 3].map((n) => <span key={n} className="chain-node" style={{ "--n": n }} />)}
              <span className="chain-line" />
              <span className="loop-label is-gold">decided once · runs in seconds</span>
            </div>
            <p className="cmp-note">A fixed pipeline of steps it already worked out with you. Same input, same path, every time.</p>
          </div>
        </div>

        <div className="stats">
          {STATS.map((s, i) => (
            <div key={s.unit} className="stat reveal" style={{ "--d": 0.08 * i + "s" }}>
              <div className="stat-v font-display">{s.v}<span className="stat-unit">{s.unit}</span></div>
              <p className="stat-note">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 3 · One app, not five (convergence) ───────────────────────────────── */
function ConvergenceSection() {
  return (
    <section className="section" data-screen-label="One app">
      <div className="container conv-grid">
        <div className="conv-copy">
          <SectionHead
            eyebrow="One app, not five"
            title={<>Your whole stack collapses into <span className="accent-italic">one subscription.</span></>}
            lead="The chat knows what your automations did this morning. The automations know what you talked about yesterday. Nothing falls between systems, because there's only one system."
          />
        </div>
        <div className="conv-diagram reveal" style={{ "--d": "0.06s" }} aria-hidden="true">
          <ul className="conv-sources">
            {REPLACES.map((r, i) => (
              <li key={r} className="conv-src" style={{ "--i": i }}><span>{r}</span></li>
            ))}
          </ul>
          <div className="conv-funnel">
            <svg viewBox="0 0 220 260" preserveAspectRatio="none" className="conv-lines">
              {REPLACES.map((_, i) => {
                const y = 26 + i * 52;
                return <path key={i} d={`M0 ${y} C 110 ${y}, 90 130, 210 130`} fill="none" stroke="rgba(240,179,90,0.28)" strokeWidth="1.5" />;
              })}
            </svg>
            <div className="conv-target">
              <span className="conv-target-dot font-display">Sirius</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4 · Right brain for the job (routing) ─────────────────────────────── */
function RoutingSection() {
  return (
    <section className="section band-deep" data-screen-label="Model routing">
      <div className="container">
        <SectionHead
          center
          eyebrow="Better answers, smaller bill"
          title={<>It always uses the <span className="accent-italic">right brain</span> for the job.</>}
          lead="Sirius isn't one model. It reaches across the whole field of frontier models, picks the best fit for each task, and the moment a sharper one ships, it's already using it — no lock-in, never stale."
        />
      </div>
    </section>
  );
}

/* ── 5 · Pricing ───────────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section id="pricing" className="section" data-screen-label="Pricing">
      <div className="container">
        <SectionHead
          center
          eyebrow="Pricing"
          title={<>Start free.</>}
          lead="Every plan is the whole product. You're paying for usage, never for features."
        />
        <div className="tiers">
          {TIERS.map((tier, i) => (
            <div key={tier.name} className={"tier reveal" + (tier.featured ? " is-featured" : "")} style={{ "--d": 0.07 * i + "s" }}>
              {tier.featured && <span className="tier-flag">Most popular</span>}
              <div className="tier-name">{tier.name}</div>
              <div className="tier-price">
                {tier.was && <span className="tier-was">{tier.was}</span>}
                <span className="tier-amt font-display">{tier.price}</span>
                <span className="tier-suffix">{tier.suffix}</span>
              </div>
              <p className="tier-tagline">{tier.tagline}</p>
              <ul className="tier-features">
                {tier.features.map((f) => (
                  <li key={f}><span className="tick" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
              <a href="#cta" className={"btn " + (tier.featured ? "btn-primary" : "btn-ghost") + " tier-cta"}>Download for Mac</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6 · Local-first ───────────────────────────────────────────────────── */
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

function LocalSection() {
  return (
    <section className="section section-tight" data-screen-label="Local-first">
      <div className="container local-row">
        <div className="local-copy">
          <div className="section-eyebrow reveal" style={{ "--d": "0s" }}><span className="eyebrow-dot" />Local-first</div>
          <h2 className="section-title reveal" style={{ "--d": "0.06s" }}>Your data stays on your Mac.</h2>
          <p className="section-lead reveal" style={{ "--d": "0.12s" }}>
            Memories, conversations, and files all live on your computer. The cloud only listens for the triggers that wake a workflow — the work itself runs on your machine.
          </p>
        </div>
        <div className="local-visual reveal" style={{ "--d": "0.12s" }} aria-hidden="true">
          <div className="cloud">
            <CloudGlyph />
            <span className="cloud-text">
              <span className="cloud-k">Cloud</span>
              <span className="cloud-sub">listens for triggers</span>
            </span>
          </div>
          <div className="local-link"><span className="local-link-label">trigger fires ↓ runs here</span></div>
          <div className="vault">
            <div className="vault-bar">
              <span className="vault-dots"><i /><i /><i /></span>
              <span className="vault-name">Your Mac</span>
              <LockGlyph />
            </div>
            <div className="vault-items">
              {["Memories", "Conversations", "Files"].map((x) => (
                <span key={x} className="vault-item"><span className="vi-dot" />{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7 · Maker note ────────────────────────────────────────────────────── */
function MakerSection() {
  return (
    <section className="section band-deep maker" data-screen-label="Maker note">
      <div className="container maker-inner">
        <blockquote className="maker-quote font-display reveal" style={{ "--d": "0s" }}>
          “Every personal AI we tried felt like a second job. It forgot what we'd told it, setup meant leaving a machine running in a closet, and every week we re-explained the same tasks from scratch. A real assistant doesn't work like that — it remembers you, keeps your projects straight, and gets things done. So we built the one that does.”
        </blockquote>
        <div className="maker-sig reveal" style={{ "--d": "0.1s" }}>— the people building Sirius</div>
      </div>
    </section>
  );
}

/* ── 8 · Final CTA (orb returns) ───────────────────────────────────────── */
function FinalCTA({ t }) {
  const tint = t.orbColor === "gold" ? 1 : 0;
  const glowColor = (a) => (t.orbColor === "gold" ? `rgba(240, 179, 90, ${a})` : `rgba(108, 200, 255, ${a})`);
  return (
    <section id="cta" className="section cta-final" data-screen-label="Download">
      <div className="cta-orb reveal-orb" style={{ "--d": "0s" }}>
        <OrbStage size={150} tint={tint} bloom={1.1} halo={false} interactive={true} glowColor={glowColor} />
      </div>
      <div className="container cta-final-inner">
        <h2 className="cta-final-title font-display reveal" style={{ "--d": "0.06s" }}>Meet Sirius.</h2>
        <div className="reveal" style={{ "--d": "0.16s" }}><CTAs /></div>
        <div className="cta-final-sub reveal" style={{ "--d": "0.24s" }}>macOS · Apple silicon · Free to start</div>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Wordmark />
          <p className="footer-blurb">One assistant that knows you and acts across everything you use. Local-first, Mac.</p>
          <div className="footer-logos" aria-hidden="true">
            {LOGOS.map(({ name, Mark }) => <span key={name} className="footer-logo"><Mark /></span>)}
          </div>
        </div>
        <nav className="footer-cols">
          <div className="footer-col">
            <span className="footer-h">Product</span>
            <a href="#what">What it does</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-col">
            <span className="footer-h">Company</span>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </nav>
      </div>
      <div className="container footer-base">
        <span>© 2026 Sirius</span>
        <span>Made for people with too much to do.</span>
      </div>
    </footer>
  );
}

/* ── Page sections wrapper ─────────────────────────────────────────────── */
function PageSections({ t }) {
  return (
    <React.Fragment>
      <DaySection />
      <ReliabilitySection />
      <ConvergenceSection />
      <RoutingSection />
      <PricingSection />
      <LocalSection />
      <MakerSection />
      <FinalCTA t={t} />
      <SiteFooter />
    </React.Fragment>
  );
}

const SECTIONS_CSS = `
.section-head { max-width: 720px; }
.section-head.is-center { max-width: 720px; margin: 0 auto; text-align: center; }
.section-head.is-center .section-lead { margin-left: auto; margin-right: auto; }

/* 1 · Timeline */
.timeline { list-style: none; margin: clamp(40px, 6vh, 72px) 0 0; padding: 0; max-width: 820px; }
.tl-item { position: relative; display: grid; grid-template-columns: 132px 1fr; gap: clamp(16px, 2.4vw, 34px); padding-left: 30px; padding-bottom: clamp(26px, 4vh, 44px); }
.tl-item:last-child { padding-bottom: 0; }
.tl-marker { position: absolute; left: 0; top: 4px; bottom: -4px; width: 1px; background: linear-gradient(to bottom, rgba(var(--accent-rgb),0.5), rgba(var(--accent-rgb),0.08)); }
.tl-item:last-child .tl-marker { background: linear-gradient(to bottom, rgba(var(--accent-rgb),0.5), transparent); }
.tl-dot { position: absolute; left: 50%; top: 4px; transform: translateX(-50%); width: 9px; height: 9px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px rgba(var(--accent-rgb),0.12), 0 0 12px rgba(var(--accent-rgb),0.6); }
.tl-time { padding-top: 0; }
.tl-clock { display: block; font-size: 1.5rem; color: var(--ink-1); letter-spacing: -0.02em; }
.tl-when { display: block; margin-top: 3px; font-size: 12px; color: var(--ink-4); letter-spacing: 0.02em; }
.tl-card { background: rgba(255,255,255,0.018); border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
.tl-card:hover { border-color: rgba(var(--accent-rgb),0.32); background: rgba(var(--accent-rgb),0.04); transform: translateY(-2px); }
.tl-title { margin: 0; font-size: 1.12rem; font-weight: 500; color: var(--ink-1); letter-spacing: -0.01em; }
.tl-body { margin: 8px 0 0; font-size: 0.98rem; line-height: 1.56; color: var(--ink-3); text-wrap: pretty; }
@media (max-width: 620px) {
  .tl-item { grid-template-columns: 1fr; gap: 6px; }
  .tl-time { display: flex; align-items: baseline; gap: 10px; }
  .tl-clock { font-size: 1.2rem; }
}

/* 2 · Reliability compare + stats */
.compare { display: grid; grid-template-columns: 1fr auto 1fr; align-items: stretch; gap: clamp(14px, 2vw, 26px); margin-top: clamp(40px, 6vh, 64px); }
.cmp-card { background: rgba(255,255,255,0.015); border: 1px solid var(--border); border-radius: 18px; padding: 24px; display: flex; flex-direction: column; }
.cmp-after { border-color: rgba(var(--accent-rgb),0.3); background: rgba(var(--accent-rgb),0.035); }
.cmp-tag { font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-4); }
.cmp-tag.is-gold { color: var(--accent); }
.cmp-arrow { align-self: center; color: var(--ink-4); font-size: 22px; }
.cmp-graphic { position: relative; height: 96px; margin: 18px 0; display: flex; align-items: center; justify-content: center; }
.loop-node { width: 30px; height: 30px; border-radius: 50%; border: 1.5px dashed rgba(206,208,197,0.5); }
.loop-arc { position: absolute; width: 58px; height: 58px; border-radius: 50%; border: 1.5px solid transparent; border-top-color: rgba(206,208,197,0.45); border-right-color: rgba(206,208,197,0.25); animation: halo-spin 3.5s linear infinite; }
@media (prefers-reduced-motion: reduce) { .loop-arc { animation: none; } }
.loop-label { position: absolute; bottom: -4px; font-size: 11.5px; color: var(--ink-4); letter-spacing: 0.04em; }
.loop-label.is-gold { color: rgba(var(--accent-rgb),0.85); }
.cmp-chain { gap: 0; }
.chain-line { position: absolute; left: 12%; right: 12%; top: 50%; height: 2px; background: linear-gradient(90deg, rgba(var(--accent-rgb),0.15), rgba(var(--accent-rgb),0.6), rgba(var(--accent-rgb),0.15)); transform: translateY(-8px); }
.chain-node { position: relative; z-index: 1; width: 14px; height: 14px; margin: 0 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px rgba(var(--accent-rgb),0.55); transform: translateY(-8px); }
.cmp-note { margin: auto 0 0; font-size: 0.92rem; line-height: 1.5; color: var(--ink-3); }
@media (max-width: 760px) {
  .compare { grid-template-columns: 1fr; }
  .cmp-arrow { transform: rotate(90deg); }
}
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(18px, 3vw, 40px); margin-top: clamp(44px, 6vh, 72px); }
.stat { border-top: 1px solid var(--border-strong); padding-top: 20px; }
.stat-v { font-size: clamp(2.4rem, 4.4vw, 3.4rem); color: var(--ink-1); letter-spacing: -0.02em; line-height: 1; display: flex; align-items: baseline; gap: 10px; }
.stat-unit { font-family: var(--font-body); font-size: 0.95rem; color: var(--accent); letter-spacing: 0; }
.stat-note { margin: 12px 0 0; font-size: 0.94rem; line-height: 1.5; color: var(--ink-3); }
@media (max-width: 680px) { .stats { grid-template-columns: 1fr; gap: 22px; } }

/* 3 · Convergence */
.conv-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(30px, 5vw, 72px); }
.conv-diagram { position: relative; display: grid; grid-template-columns: 1fr 220px; align-items: center; min-height: 260px; }
.conv-sources { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.conv-src span { display: inline-block; font-size: 13.5px; color: var(--ink-3); padding: 9px 14px; border: 1px solid var(--border); border-radius: 10px; background: rgba(255,255,255,0.015); white-space: nowrap; }
.conv-funnel { position: relative; height: 260px; }
.conv-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.conv-target { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 96px; height: 96px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at 38% 32%, rgba(255,208,131,0.28), rgba(var(--accent-rgb),0.1) 60%, transparent 72%);
  border: 1px solid rgba(var(--accent-rgb),0.4); box-shadow: 0 0 40px -8px rgba(var(--accent-rgb),0.5); }
.conv-target-dot { font-size: 1.15rem; color: var(--accent-strong); }
@media (max-width: 880px) {
  .conv-grid { grid-template-columns: 1fr; }
  .conv-diagram { grid-template-columns: 1fr 160px; }
  .conv-funnel { height: 260px; }
}

/* 4 · Routing */
/* 4 · Routing — type-led split */
.split2 { display: flex; align-items: stretch; justify-content: center; gap: clamp(28px,5vw,80px); max-width: 800px; margin: clamp(44px,6vh,76px) auto 0; }
.split2-item { display: flex; flex-direction: column; gap: 8px; text-align: center; max-width: 300px; }
.split2-k { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); }
.split2-v { font-size: clamp(1.5rem,2.4vw,2rem); color: var(--ink-1); letter-spacing: -0.01em; line-height: 1.1; }
.split2-item:first-child .split2-v { color: #bfeaff; }
.split2-item:last-child .split2-v { color: var(--accent-strong); }
.split2-sub { font-size: 0.96rem; line-height: 1.5; color: var(--ink-3); }
.split2-rule { width: 1px; background: var(--border); flex-shrink: 0; }
@media (max-width: 640px) { .split2 { flex-direction: column; align-items: center; gap: 30px; } .split2-rule { width: 60px; height: 1px; } }

/* 5 · Pricing */
.tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: clamp(40px, 6vh, 64px); align-items: stretch; }
.tier { position: relative; display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 20px; padding: 28px 26px; background: rgba(255,255,255,0.012); }
.tier.is-featured { border-color: rgba(var(--accent-rgb),0.5); background: rgba(var(--accent-rgb),0.05); box-shadow: 0 30px 80px -50px rgba(var(--accent-rgb),0.8); transform: translateY(-8px); padding-top: 34px; }
.tier-flag { position: absolute; top: -11px; left: 26px; white-space: nowrap; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #1b1712; background: var(--accent); padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
.tier-name { font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-3); }
.tier-price { display: flex; align-items: baseline; gap: 6px; margin-top: 14px; }
.tier-was { font-size: 1rem; color: var(--ink-4); text-decoration: line-through; }
.tier-amt { font-size: 2.8rem; color: var(--ink-1); letter-spacing: -0.02em; line-height: 1; }
.tier-suffix { font-size: 1rem; color: var(--ink-3); }
.tier-tagline { margin: 10px 0 0; font-size: 0.95rem; color: var(--ink-2); line-height: 1.45; }
.tier-features { list-style: none; margin: 20px 0 0; padding: 20px 0 0; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 11px; flex: 1; }
.tier-features li { display: flex; gap: 10px; font-size: 0.93rem; color: var(--ink-2); line-height: 1.4; }
.tick { color: var(--accent); flex-shrink: 0; }
.tier-cta { margin-top: 24px; width: 100%; }
@media (max-width: 860px) { .tiers { grid-template-columns: 1fr; max-width: 440px; margin-inline: auto; } .tier.is-featured { transform: none; } }

/* 6 · Local-first */
.section-tight { padding-block: clamp(60px, 9vh, 110px); }
.local-row { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(30px, 5vw, 72px); }
.local-visual { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 400px; margin-inline: auto; }
.cloud { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border: 1px dashed var(--border-strong); border-radius: 12px; }
.cloud-glyph { width: 24px; height: 24px; color: var(--star); opacity: 0.85; }
.cloud-text { display: flex; flex-direction: column; }
.cloud-k { font-size: 13px; color: var(--ink-2); }
.cloud-sub { font-size: 11.5px; color: var(--ink-4); white-space: nowrap; }
.local-link { position: relative; height: 48px; width: 100%; display: flex; align-items: center; justify-content: center; }
.local-link::before { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; transform: translateX(-50%); background: repeating-linear-gradient(to bottom, var(--border-strong) 0 4px, transparent 4px 9px); }
.local-link-label { position: relative; background: var(--bg); padding: 3px 12px; font-size: 11px; letter-spacing: 0.05em; color: var(--ink-4); }
.vault { width: 100%; border: 1px solid rgba(var(--star-rgb),0.3); border-radius: 16px; background: linear-gradient(180deg, rgba(108,216,255,0.06), rgba(255,255,255,0.015)); box-shadow: 0 0 60px -26px rgba(var(--star-rgb),0.7); overflow: hidden; }
.vault-bar { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
.vault-dots { display: flex; gap: 6px; }
.vault-dots i { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); display: block; }
.vault-name { font-size: 13px; color: var(--ink-2); margin-left: 2px; white-space: nowrap; }
.vault-lock { width: 16px; height: 16px; color: var(--star); margin-left: auto; opacity: 0.9; }
.vault-items { display: flex; flex-direction: column; gap: 10px; padding: 18px; }
.vault-item { display: flex; align-items: center; gap: 11px; font-size: 0.98rem; color: var(--ink-1); padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; background: rgba(108,216,255,0.05); }
.vi-dot { width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #cfeeff, var(--star) 65%, #2a87c0); box-shadow: 0 0 10px rgba(var(--star-rgb),0.7); flex-shrink: 0; }
@media (max-width: 720px) { .local-row { grid-template-columns: 1fr; } }

/* 7 · Maker */
.maker-inner { max-width: 860px; margin: 0 auto; text-align: center; }
.maker-quote { margin: 0; font-size: clamp(1.4rem, 2.6vw, 2.1rem); line-height: 1.4; font-style: italic; color: var(--ink-1); letter-spacing: -0.01em; text-wrap: balance; font-variation-settings: "opsz" 144; }
.maker-sig { margin-top: 26px; font-size: 14px; letter-spacing: 0.06em; color: var(--ink-3); }

/* 8 · Final CTA */
.cta-final { position: relative; text-align: center; padding-block: clamp(80px, 12vh, 150px); overflow: hidden; }
.cta-orb { display: flex; justify-content: center; margin-bottom: 8px; }
.cta-final-title { font-size: clamp(2.6rem, 6vw, 4.6rem); letter-spacing: -0.03em; color: var(--ink-1); margin: 0 0 28px; line-height: 1; }
.cta-final .cta-row { justify-content: center; }
.cta-final-sub { margin-top: 20px; font-size: 13px; letter-spacing: 0.04em; color: var(--ink-4); }

/* Footer */
.footer { position: relative; z-index: 3; border-top: 1px solid var(--border); padding-top: clamp(48px, 7vh, 80px); padding-bottom: 36px; }
.footer-inner { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; }
.footer-blurb { margin: 16px 0 0; max-width: 360px; font-size: 0.95rem; line-height: 1.55; color: var(--ink-3); }
.footer-logos { display: flex; gap: 14px; margin-top: 22px; }
.footer-logo { width: 20px; height: 20px; opacity: 0.5; transition: opacity 0.2s ease; }
.footer-logo:hover { opacity: 1; }
.footer-cols { display: flex; gap: clamp(40px, 8vw, 100px); justify-content: flex-end; }
.footer-col { display: flex; flex-direction: column; gap: 12px; }
.footer-h { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 4px; }
.footer-col a { font-size: 14px; color: var(--ink-3); transition: color 0.2s ease; }
.footer-col a:hover { color: var(--ink-1); }
.footer-base { display: flex; justify-content: space-between; margin-top: clamp(40px, 6vh, 64px); padding-top: 22px; border-top: 1px solid var(--border); font-size: 12.5px; color: var(--ink-4); }
@media (max-width: 720px) {
  .footer-inner { grid-template-columns: 1fr; gap: 30px; }
  .footer-cols { justify-content: flex-start; }
  .footer-base { flex-direction: column; gap: 8px; }
}
`;

document.head.insertAdjacentHTML("beforeend", `<style id="sections-css">${SECTIONS_CSS}</style>`);
