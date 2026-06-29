import { headers } from "next/headers";

function safeStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

/** Build origin from incoming request host (tenant subdomain aware). */
export async function getRequestOrigin(): Promise<string> {
  const fromEnv = safeStr(process.env.DEMO_SITES_SITE_ORIGIN);
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

export function getRequestOriginFromHeaders(
  host: string | null,
  proto = "https"
): string {
  const fromEnv = safeStr(process.env.DEMO_SITES_SITE_ORIGIN);
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}
