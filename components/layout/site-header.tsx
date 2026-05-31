import Link from "next/link";

import { AppIcon } from "@/components/sirius/appui";
import { HeaderNav } from "@/components/layout/header-nav";
import { Orb } from "@/components/sirius/orb";
import { Container } from "@/components/ui/container";
import { landingContent } from "@/content/landing";

// Set to false to replace the live orb with a static cyan dot.
const HEADER_ORB = true;

export function SiteHeader() {
  const { meta, nav, downloadCta } = landingContent;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(18,15,11,0.9)] backdrop-blur-xl">
      <Container className="flex h-14 items-center justify-between">
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
          <a
            href={downloadCta.href}
            className="group inline-flex cursor-pointer items-center text-[13px] text-[var(--color-ink-1)] underline-offset-[6px] transition hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
            style={{ textDecorationColor: "rgba(var(--color-accent-rgb), 0.55)" }}
          >
            <span className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-[var(--color-accent)]">
              {downloadCta.label}
              <span className="inline-flex motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out group-hover:translate-x-0.5">
                <AppIcon name="arrow" size={13} stroke="currentColor" />
              </span>
            </span>
          </a>
        </div>
      </Container>
    </header>
  );
}
