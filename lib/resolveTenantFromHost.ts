const DEFAULT_BASE_DOMAIN = "dev.sites.valetfy.com";

const CUSTOM_DOMAIN_SLUGS: Record<string, string> = {
  "lotuspetspamobile.com": "lotus-pet-spa-mobile",
  "www.lotuspetspamobile.com": "lotus-pet-spa-mobile",
};

function normalizeHost(host: string): string {
  return host.split(":")[0].trim().toLowerCase();
}

export function getDemoSitesBaseDomain(): string {
  const fromEnv = process.env.DEMO_SITES_BASE_DOMAIN?.trim().toLowerCase();
  return fromEnv || DEFAULT_BASE_DOMAIN;
}

/**
 * Extract tenant slug from host.
 * Examples:
 *   scott.dev.sites.valetfy.com → scott
 *   woof-wash.localhost → woof-wash
 *   scott.localhost → scott
 */
export function resolveSlugFromHost(hostHeader: string | null): string | null {
  if (!hostHeader) return null;

  const host = normalizeHost(hostHeader);
  const baseDomain = getDemoSitesBaseDomain();
  const customDomainSlug = CUSTOM_DOMAIN_SLUGS[host];
  if (customDomainSlug) return customDomainSlug;

  if (host === baseDomain) return null;

  if (host.endsWith(`.${baseDomain}`)) {
    const slug = host.slice(0, -(baseDomain.length + 1));
    return slug && !slug.includes(".") ? slug : null;
  }

  if (host.endsWith(".localhost")) {
    const slug = host.slice(0, -".localhost".length);
    return slug && !slug.includes(".") ? slug : null;
  }

  if (host.endsWith(".127.0.0.1")) {
    const slug = host.slice(0, -".127.0.0.1".length);
    return slug && !slug.includes(".") ? slug : null;
  }

  return null;
}

export function resolveDevFallbackSlug(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  const slug = process.env.DEMO_SITES_DEV_SLUG?.trim();
  return slug || null;
}
