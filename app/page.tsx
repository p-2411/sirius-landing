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
import { landingContent } from "@/content/landing";

export default function HomePage() {
  const { beat } = landingContent;
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-ink-1)]">
      <SiteHeader />
      <ProgressRail />
      <HeroSection />
      <SectionDivider />
      <section id="beat" className="py-16 md:py-20">
        <div className="mx-auto max-w-[640px] px-6 text-center">
          <p className="font-display text-[clamp(1.3rem,2.6vw,1.9rem)] font-normal italic leading-[1.3] text-[var(--color-ink-1)]">
            {beat}
          </p>
        </div>
      </section>
      <SectionDivider />
      <WhatItDoesSection />
      <SectionDivider />
      <LearnsOnceSection />
      <SectionDivider />
      <OneAppSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <LocalDataSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
