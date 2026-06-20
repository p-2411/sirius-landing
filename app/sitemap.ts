import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// While the site is in "coming soon" mode the only public route is `/`.
// The full landing/blog/demo live under app/_archived/ and are not served.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
