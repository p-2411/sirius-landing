/**
 * Canonical origin for absolute URLs (sitemap, robots, metadata).
 * Override per environment with NEXT_PUBLIC_SITE_URL — e.g. set it to
 * https://trysirius.me if that is the live domain. Falls back to the value
 * declared in app/layout.tsx's metadataBase so the repo stays consistent.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sirius.so"
).replace(/\/$/, "");
