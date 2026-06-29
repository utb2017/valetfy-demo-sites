const DEFAULT_BASE = "dev.sites.valetfy.com";

export function getDemoSitesPublicBaseDomain(): string {
  return (
    process.env.NEXT_PUBLIC_DEMO_SITES_BASE_DOMAIN?.trim() ||
    process.env.DEMO_SITES_BASE_DOMAIN?.trim() ||
    DEFAULT_BASE
  );
}

export function demoSitePublicUrl(slug: string): string {
  const base = getDemoSitesPublicBaseDomain();
  return `https://${slug}.${base}`;
}

export function demoSiteConnectUrl(slug: string): string {
  return `${demoSitePublicUrl(slug)}/connect`;
}
