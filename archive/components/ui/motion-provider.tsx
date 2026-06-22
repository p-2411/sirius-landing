"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { OrbAudioProvider } from "@/components/sirius/orb-audio-context";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <OrbAudioProvider>{children}</OrbAudioProvider>
    </MotionConfig>
  );
}
