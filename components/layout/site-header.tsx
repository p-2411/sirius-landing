import Link from "next/link";

import { HeaderNav } from "@/components/layout/header-nav";
import { ScrollLink } from "@/components/layout/scroll-link";
import { Orb } from "@/components/sirius/orb";
import { landingContent } from "@/content/landing";

// Set to false to replace the live orb with a static cyan dot.
const HEADER_ORB = true;

export function SiteHeader() {
  const { meta, nav, requestCta } = landingContent;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(18,15,11,0.9)] backdrop-blur-xl">
      <div className="flex h-14 w-full items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.25) 100%)",
              }}
            />
            {HEADER_ORB ? (
              <Orb className="!h-6 !w-6 relative" glowless />
            ) : (
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </span>
          <span className="font-sans text-[12.5px] font-medium uppercase tracking-[0.28em] text-[var(--color-ink-1)]">
            {meta.wordmark}
          </span>
        </Link>

        <HeaderNav items={nav} />

        <div className="flex items-center gap-3 sm:gap-4">
          <ScrollLink
            id="cta"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[var(--color-accent)] outline-none transition-colors hover:text-[var(--color-accent-strong)] focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
          >
            {requestCta.label}
            <span aria-hidden="true" className="inline-flex motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5">→</span>
          </ScrollLink>
        </div>
      </div>
    </header>
  );
}
