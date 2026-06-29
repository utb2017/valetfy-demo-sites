/** Extract hostname from a demoSite sourceUrl for RDAP registrar lookup. */
export function domainFromSourceUrl(sourceUrl?: string | null): string | null {
  if (!sourceUrl?.trim()) return null;
  try {
    const url = sourceUrl.includes("://")
      ? sourceUrl
      : `https://${sourceUrl.trim()}`;
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (!host.includes(".") || host.endsWith(".example")) return null;
    return host;
  } catch {
    return null;
  }
}

export function normalizeSourceUrl(sourceUrl?: string | null): string | null {
  const domain = domainFromSourceUrl(sourceUrl);
  return domain ? `https://${domain}` : sourceUrl?.trim() || null;
}
