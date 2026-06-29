/**
 * RDAP lookup for registrar pre-detection at demo site create time.
 * Stores provider name on demoSites.registrar for future DNS-reveal UI.
 */

function extractDomain(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    const url = new URL(withProtocol);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    const cleaned = raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();
    return cleaned.includes(".") ? cleaned : null;
  }
}

type RdapEntity = {
  roles?: string[];
  vcardArray?: unknown;
  handle?: string;
};

type RdapResponse = {
  entities?: RdapEntity[];
  remarks?: Array<{ title?: string; description?: string[] }>;
};

function registrarFromEntities(entities: RdapEntity[] | undefined): string | null {
  if (!entities?.length) return null;

  for (const entity of entities) {
    const roles = entity.roles ?? [];
    if (!roles.includes("registrar")) continue;

    const vcard = entity.vcardArray;
    if (Array.isArray(vcard) && Array.isArray(vcard[1])) {
      for (const row of vcard[1]) {
        if (Array.isArray(row) && row[0] === "fn" && row[3]) {
          return String(row[3]);
        }
      }
    }
    if (entity.handle) return entity.handle;
  }

  return null;
}

export async function lookupRegistrar(sourceUrl: string): Promise<string | null> {
  const domain = extractDomain(sourceUrl);
  if (!domain) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { Accept: "application/rdap+json" },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as RdapResponse;
    return registrarFromEntities(data.entities);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function lookupRegistrarWithFallback(
  sourceUrl: string
): Promise<string | null> {
  const primary = await lookupRegistrar(sourceUrl);
  if (primary) return primary;

  const domain = extractDomain(sourceUrl);
  if (!domain) return null;

  try {
    const res = await fetch(`https://rdap.verisign.com/com/v1/domain/${domain}`, {
      headers: { Accept: "application/rdap+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RdapResponse;
    return registrarFromEntities(data.entities);
  } catch {
    return null;
  }
}
