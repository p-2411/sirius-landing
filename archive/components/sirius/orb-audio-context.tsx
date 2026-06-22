"use client";

import { createContext, useContext, useMemo, useRef } from "react";

export type OrbAudioSignal = {
  amplitude: number;
  centroid: number;
  active: boolean;
};

type OrbAudioContextValue = {
  signalRef: React.MutableRefObject<OrbAudioSignal>;
};

const defaultSignal: OrbAudioSignal = { amplitude: 0, centroid: 0.5, active: false };

const OrbAudioContext = createContext<OrbAudioContextValue | null>(null);

export function OrbAudioProvider({ children }: { children: React.ReactNode }) {
  const signalRef = useRef<OrbAudioSignal>({ ...defaultSignal });
  const value = useMemo<OrbAudioContextValue>(() => ({ signalRef }), []);
  return <OrbAudioContext.Provider value={value}>{children}</OrbAudioContext.Provider>;
}

export function useOrbAudio() {
  const ctx = useContext(OrbAudioContext);
  if (!ctx) throw new Error("useOrbAudio must be used inside OrbAudioProvider");
  return ctx;
}
