import { OrbAudioProvider } from "@/components/sirius/orb-audio-context";
import { Hero } from "@/components/os/hero";

export default function HomePage() {
  return (
    <OrbAudioProvider>
      <main className="os">
        <Hero />
      </main>
    </OrbAudioProvider>
  );
}
