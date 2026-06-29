import { lookupRegistrarWithFallback } from "./rdapLookup";

function extractDomain(input: string): string | null {
  const raw = input.trim();
  try {
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    const cleaned = raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();
    return cleaned.includes(".") ? cleaned : null;
  }
}

type DnsAnswer = { data?: string; type?: number };

async function nameserversForDomain(domain: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { Answer?: DnsAnswer[] };
    return (json.Answer ?? [])
      .filter((a) => a.type === 2 && a.data)
      .map((a) => String(a.data).toLowerCase());
  } catch {
    return [];
  }
}

function registrarFromNameservers(ns: string[]): string | null {
  const joined = ns.join(" ");
  if (joined.includes("cloudflare.com")) return "Cloudflare, Inc.";
  if (joined.includes("domaincontrol.com")) return "GoDaddy.com, LLC";
  if (joined.includes("registrar-servers.com")) return "Namecheap";
  if (joined.includes("porkbun.com")) return "Porkbun LLC";
  return null;
}

/** RDAP registrar, with nameserver hint when DNS is on Cloudflare. */
export async function detectRegistrarForDomain(
  sourceUrl: string
): Promise<string | null> {
  const domain = extractDomain(sourceUrl);
  if (!domain) return null;

  const ns = await nameserversForDomain(domain);
  const fromNs = registrarFromNameservers(ns);
  if (fromNs === "Cloudflare, Inc.") return fromNs;

  const fromRdap = await lookupRegistrarWithFallback(
    domain.startsWith("http") ? domain : `https://${domain}`
  );
  return fromRdap ?? fromNs;
}
