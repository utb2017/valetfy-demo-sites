/**
 * Real domains used for RDAP registrar detection per seed tenant.
 * Override via SCOTT_RDAP_DOMAIN / WOOF_WASH_RDAP_DOMAIN env vars.
 *
 * scott → scottservices.com (RDAP + NS → Cloudflare, Inc.)
 * woof-wash → set WOOF_WASH_RDAP_DOMAIN to a live domain on Cloudflare Registrar
 */
export const REGISTRAR_LOOKUP_DOMAINS: Record<string, string | undefined> = {
  scott: process.env.SCOTT_RDAP_DOMAIN ?? "scottservices.com",
  "woof-wash": process.env.WOOF_WASH_RDAP_DOMAIN,
};
