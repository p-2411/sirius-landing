"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useOrbAudio } from "@/components/sirius/orb-audio-context";

type MicState = "idle" | "listening" | "denied" | "unsupported";

type WebkitAudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const VOICE_ACTIVE_THRESHOLD = 0.055;
const SILENCE_RESET_MS = 1100;

export function useMicSignal() {
  const { signalRef } = useOrbAudio();
  const [state, setState] = useState<MicState>("idle");
  const mediaRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const heardVoiceRef = useRef(false);
  const silenceSinceRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = null;
    mediaRef.current?.getTracks().forEach((track) => track.stop());
    mediaRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    heardVoiceRef.current = false;
    silenceSinceRef.current = null;
    signalRef.current = { amplitude: 0, centroid: 0.5, active: false };
    setState((current) => (current === "denied" || current === "unsupported" ? current : "idle"));
  }, [signalRef]);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      const AudioContextCtor = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
      if (!AudioContextCtor) {
        setState("unsupported");
        stream.getTracks().forEach((track) => track.stop());
        mediaRef.current = null;
        return;
      }

      const ctx = new AudioContextCtor();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      const time = new Uint8Array(analyser.fftSize);
      const freq = new Uint8Array(analyser.frequencyBinCount);

      heardVoiceRef.current = false;
      silenceSinceRef.current = null;

      const tick = (now: number) => {
        analyser.getByteTimeDomainData(time);
        analyser.getByteFrequencyData(freq);

        let sumSq = 0;
        for (let i = 0; i < time.length; i += 1) {
          const v = (time[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / time.length);
        const amplitude = Math.min(1, rms * 3.2);

        let num = 0;
        let den = 0;
        for (let i = 0; i < freq.length; i += 1) {
          num += i * freq[i];
          den += freq[i];
        }
        const centroidRaw = den > 0 ? num / den / freq.length : 0.5;
        const centroid = Math.max(0, Math.min(1, centroidRaw * 2.2));
        const voiceActive = amplitude >= VOICE_ACTIVE_THRESHOLD;

        if (voiceActive) {
          heardVoiceRef.current = true;
          silenceSinceRef.current = null;
        } else if (heardVoiceRef.current) {
          silenceSinceRef.current ??= now;
          if (now - silenceSinceRef.current >= SILENCE_RESET_MS) {
            stop();
            return;
          }
        }

        signalRef.current = { amplitude, centroid, active: true };
        rafRef.current = requestAnimationFrame(tick);
      };

      setState("listening");
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      mediaRef.current?.getTracks().forEach((track) => track.stop());
      mediaRef.current = null;
      signalRef.current = { amplitude: 0, centroid: 0.5, active: false };
      setState("denied");
    }
  }, [signalRef]);

  useEffect(() => () => stop(), [stop]);

  return { state, start, stop } as const;
}
