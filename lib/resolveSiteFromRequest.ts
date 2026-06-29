import { headers } from "next/headers";

import {
  getDemoSiteByCustomDomain,
  getDemoSiteBySlug,
} from "@/lib/getDemoSite";
import {
  resolveDevFallbackSlug,
  resolveSlugFromHost,
} from "@/lib/resolveTenantFromHost";

export async function resolveSiteIdFromRequest(): Promise<string | null> {
  const headerStore = await headers();
  const host = headerStore.get("host");
  const fromMiddleware = headerStore.get("x-demo-site-slug");
  if (fromMiddleware) return fromMiddleware;

  const slug = resolveSlugFromHost(host);
  if (slug) return slug;

  if (host) {
    const normalized = host.split(":")[0].trim().toLowerCase();
    const byDomain = await getDemoSiteByCustomDomain(normalized);
    if (byDomain) return byDomain.siteId;
  }

  return resolveDevFallbackSlug();
}

export async function loadSiteForRequest() {
  const siteId = await resolveSiteIdFromRequest();
  if (!siteId) return null;
  return getDemoSiteBySlug(siteId);
}
