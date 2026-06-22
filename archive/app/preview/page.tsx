import type { Metadata } from "next";

import { OrbAudioProvider } from "@/components/sirius/orb-audio-context";
import { Hero } from "@/components/os/hero";

// Redesign preview surface. The live `/` stays parked on the placeholder until
// this is approved, then it gets promoted into app/page.tsx.
export const metadata: Metadata = {
  title: "Sirius — preview",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <OrbAudioProvider>
      <main className="os">
        <Hero />
      </main>
    </OrbAudioProvider>
  );
}
