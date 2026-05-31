import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/hero";
import { WhatItDoesSection } from "@/components/sections/what-it-does";
import { LearnsOnceSection } from "@/components/sections/learns-once";
import { OneAppSection } from "@/components/sections/one-app";
import { PricingSection } from "@/components/sections/pricing";
import { LocalDataSection } from "@/components/sections/local-data";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { ProgressRail } from "@/components/ui/progress-rail";
import { SectionDivider } from "@/components/ui/section-divider";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-ink-1)]">
      <SiteHeader />
      <ProgressRail />
      <HeroSection />
      <SectionDivider />
      <WhatItDoesSection />
      <SectionDivider />
      <LearnsOnceSection />
      <SectionDivider />
      <OneAppSection />
      <SectionDivider />
      <LocalDataSection />
      <SectionDivider />
      <PricingSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
