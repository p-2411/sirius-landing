import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqSection } from "@/components/sections/faq";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { FourWaysSection } from "@/components/sections/four-ways";
import { HeroSection } from "@/components/sections/hero";
import { InPracticeSection } from "@/components/sections/in-practice";
import { LiveDemoSection } from "@/components/sections/live-demo";
import { LocalDataSection } from "@/components/sections/local-data";
import { ThreeIdeasSection } from "@/components/sections/three-ideas";
import { WhatsNextSection } from "@/components/sections/whats-next";
import { WorkflowsSection } from "@/components/sections/workflows";
import { ProgressRail } from "@/components/ui/progress-rail";
import { SectionDivider } from "@/components/ui/section-divider";
import { getStartupAnalystDemoFiles } from "@/lib/startup-analyst-demo";

export default function HomePage() {
  const startupAnalystFiles = getStartupAnalystDemoFiles();

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-ink-1)]">
      <SiteHeader />
      <ProgressRail />
      <HeroSection />
      <SectionDivider />
      <InPracticeSection />
      <SectionDivider />
      <LiveDemoSection startupAnalystFiles={startupAnalystFiles} />
      <SectionDivider />
      <WorkflowsSection />
      <SectionDivider />
      <FourWaysSection />
      <ThreeIdeasSection />
      <SectionDivider />
      <LocalDataSection />
      <FaqSection />
      <FinalCtaSection />
      <SectionDivider />
      <WhatsNextSection />
      <SiteFooter />
    </main>
  );
}
