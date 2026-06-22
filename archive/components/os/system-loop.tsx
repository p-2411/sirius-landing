// The living two-layer loop — the hero's centerpiece. Information sources flow
// into the unified core (the orb); operations fire out the other side; the
// bottom edge shows the feedback loop that makes it an operating system.
// Structure is fully rendered by default; only the travelling comets animate,
// so it ships legible with JS off / reduced motion.
import type { CSSProperties } from "react";

import { Orb } from "@/components/sirius/orb";

type GlyphName = "meeting" | "mail" | "hash" | "db" | "check" | "bolt" | "flag";

function Glyph({ name }: { name: GlyphName }) {
  const p: Record<GlyphName, string> = {
    meeting: "M3 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm11 4 4-2.5v9L14 14",
    mail: "M3 5h18v14H3zM3 7l9 6 9-6",
    hash: "M4 9h16M4 15h16M10 3 8 21M16 3l-2 18",
    db: "M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6",
    check: "m4 12 5 5L20 6",
    bolt: "M13 3 4 14h6l-1 7 9-11h-6l1-7Z",
    flag: "M5 21V3m0 1h12l-2.5 4L17 12H5",
  };
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p[name]} />
    </svg>
  );
}

const FEEDS: { src: string; txt: string; icon: GlyphName }[] = [
  { src: "Meeting", txt: "Acme renewal call", icon: "meeting" },
  { src: "Email", txt: "Dana at Acme", icon: "mail" },
  { src: "Slack", txt: "#deals thread", icon: "hash" },
  { src: "CRM", txt: "HubSpot record", icon: "db" },
];

const OPS: { txt: string; icon: GlyphName }[] = [
  { txt: "Drafted Dana's follow-up", icon: "check" },
  { txt: "Built a renewal watcher", icon: "bolt" },
  { txt: "Flagged a stalled deal", icon: "flag" },
];

function Wire({ kind, delays }: { kind: "in" | "out"; delays: number[] }) {
  return (
    <div className={`os-wire os-wire--${kind}`} aria-hidden="true">
      {delays.map((delay, i) => (
        <span
          key={i}
          className="os-wire__comet"
          style={{ "--delay": `${delay}s`, "--dur": "3.2s" } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SystemLoop() {
  return (
    <div className="os-loop os-reveal" style={{ "--d": "0.5s" } as CSSProperties}>
      <div
        className="os-loop__zones"
        role="img"
        aria-label="Information from your meetings, email, Slack and CRM flows into one unified picture; Sirius then drafts follow-ups, builds automations and flags risks — and every action feeds back in."
      >
        {/* Information layer */}
        <div className="os-loop__col os-loop__col--info">
          <p className="os-loop__col-label">
            <span className="pip" />
            <span className="k">Information</span> it learns everything
          </p>
          <div className="os-feed">
            {FEEDS.map((f) => (
              <div key={f.txt} className="os-chip">
                <span className="os-chip__icon"><Glyph name={f.icon} /></span>
                <span className="os-chip__main">
                  <span className="os-chip__src">{f.src}</span>
                  <span className="os-chip__txt">{f.txt}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <Wire kind="in" delays={[0, 1.6]} />

        {/* Unified core */}
        <div className="os-loop__core">
          <div className="os-core-well">
            <span className="os-core-ring" aria-hidden="true" />
            <span className="os-core-ring os-core-ring--2" aria-hidden="true" />
            <Orb className="os-core-orb !h-[clamp(132px,17vw,188px)] !w-[clamp(132px,17vw,188px)]" pulse />
          </div>
          <p className="os-core-cap"><b>One living picture</b><br />of your whole business</p>
        </div>

        <Wire kind="out" delays={[0.8, 2.4]} />

        {/* Operation layer */}
        <div className="os-loop__col os-loop__col--op">
          <p className="os-loop__col-label">
            <span className="pip" />
            <span className="k">Operation</span> it does the work
          </p>
          <div className="os-feed">
            {OPS.map((o) => (
              <div key={o.txt} className="os-chip os-chip--fired">
                <span className="os-chip__icon"><Glyph name={o.icon} /></span>
                <span className="os-chip__main">
                  <span className="os-chip__txt">{o.txt}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The feedback edge */}
      <div className="os-loop__loopback" aria-hidden="true">
        <span className="os-loop__loopback-label">
          <span className="cyc">↻</span> every action sharpens the picture
        </span>
        <span className="rtn" />
      </div>
    </div>
  );
}
