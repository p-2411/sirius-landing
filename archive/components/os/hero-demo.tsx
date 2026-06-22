"use client";

// Hero demo — the real Sirus app in a window frame, standing in as the demo
// placeholder until the recorded walkthrough drops in. Shows the faithful home
// (rail + voice orb + a real exchange) behind a play affordance, so the hero
// leads with the actual product instead of an abstract diagram.
import type { CSSProperties } from "react";

import { ScaledShot } from "@/components/sirius/appui/scaled-shot";
import { VoiceHomeShot } from "@/components/sirius/appui/voice-home-shot";

export function HeroDemo() {
  return (
    <div className="os-demo os-reveal" style={{ "--d": "0.5s" } as CSSProperties}>
      <div className="os-demo__frame">
        <div className="os-demo__bar">
          <span className="os-demo__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="os-demo__title"><b>Sirus</b> · home</span>
          <span className="os-demo__live"><i aria-hidden="true" /> live</span>
        </div>

        <div className="os-demo__screen">
          <ScaledShot width={1360} height={850}>
            <VoiceHomeShot />
          </ScaledShot>

          <div className="os-demo__scrim">
            <button type="button" className="os-demo__play" aria-label="Watch Sirus work — 90 second demo">
              <span className="tri" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              See Sirus work
              <span className="dur">90s</span>
            </button>
          </div>
        </div>
      </div>

      <p className="os-demo__caption">
        A live walkthrough is on the way — join the waitlist for early access.
      </p>
    </div>
  );
}
