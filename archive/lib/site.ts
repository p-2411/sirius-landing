/**
 * Canonical origin for absolute URLs (sitemap, robots, page metadata).
 * Single source of truth — override per environment with NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trysirius.me"
).replace(/\/$/, "");
