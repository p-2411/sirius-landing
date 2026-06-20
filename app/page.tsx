import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
import { SiteHeader } from "@/components/layout/site-header";
import { SectionDivider } from "@/components/ui/section-divider";
import {
  SiriusHero,
  InformationLayerSection,
  WhileYouSleepSection,
  RoutingSection,
  PricingSection,
  LocalSection,
  SiriusFooter,
} from "@/components/sirius-design/landing";
import { RelationshipsSection } from "@/components/sections/relationships";
import { OneAppSection } from "@/components/sections/one-app";
import { FinalCtaSection } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <main className="sd relative min-h-screen overflow-x-clip">
      <Starfield />
      <AmbientLayers />
      <SiteHeader />
      <SiriusHero />
      <SectionDivider />
      <InformationLayerSection />
      <RelationshipsSection />
      <OneAppSection />
      <WhileYouSleepSection />
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
