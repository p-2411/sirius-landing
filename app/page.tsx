import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/ui/section-divider";
import {
  SiriusHero,
  DaySection,
  ReliabilitySection,
  RoutingSection,
  PricingSection,
  LocalSection,
  SiriusFooter,
} from "@/components/sirius-design/landing";
// Two sections are intentionally OURS, swapped in over the design:
import { OneAppSection } from "@/components/sections/one-app";
import { FinalCtaSection } from "@/components/sections/final-cta";

// The Sirius Hero design, ported verbatim (styles in app/sirius-design.css under
// .sd). Only deviations from the prototype: the One app section uses our
// ToolOrbit visual, the final CTA is ours, and the orb sits in a dark well.
export default function HomePage() {
  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <SiteHeader />
      <SiriusHero />
      <SectionDivider />
      <DaySection />
      <ReliabilitySection />
      <OneAppSection />
      <RoutingSection />
      <PricingSection />
      <SectionDivider />
      <LocalSection />
      <SectionDivider />
      <FinalCtaSection />
      <SiriusFooter />
    </main>
  );
}
