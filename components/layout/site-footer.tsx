import { Orb } from "@/components/sirius/orb";
import { Container } from "@/components/ui/container";

const FOOTER_ORB = true;

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--color-border)] py-12">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-[480px] surface-line"
      />
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.25) 100%)",
              }}
            />
            {FOOTER_ORB ? (
              <Orb className="!h-6 !w-6 relative" glowless />
            ) : (
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            )}
          </span>
          <span className="font-sans text-[12.5px] font-medium uppercase tracking-[0.28em] text-[var(--color-ink-1)]">
            Sirius
          </span>
        </div>
        <p className="font-display-italic text-[14px] text-[var(--color-ink-2)]">
          An assistant. In the proper sense.
        </p>
        <a
          href="#cta"
          className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-3)] underline-offset-4 transition hover:text-[var(--color-accent)] hover:underline hover:decoration-[var(--color-accent)]"
        >
          Request access &rarr;
        </a>
      </Container>
    </footer>
  );
}
