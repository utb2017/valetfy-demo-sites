export type RegistrarKey =
  | "cloudflare"
  | "godaddy"
  | "namecheap"
  | "squarespace"
  | "wix"
  | "google"
  | "porkbun"
  | "ionos"
  | "other";

export function normalizeRegistrar(raw?: string | null): RegistrarKey {
  const s = (raw ?? "").toLowerCase();
  if (!s) return "other";
  if (s.includes("cloudflare")) return "cloudflare";
  if (s.includes("godaddy") || s.includes("go daddy")) return "godaddy";
  if (s.includes("namecheap")) return "namecheap";
  if (s.includes("squarespace")) return "squarespace";
  if (s.includes("wix")) return "wix";
  if (s.includes("google") || s.includes("domains.google")) return "google";
  if (s.includes("porkbun")) return "porkbun";
  if (s.includes("ionos") || s.includes("1&1")) return "ionos";
  return "other";
}
