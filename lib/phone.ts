export function onlyDigits10(s: string) {
  return (s || "").replace(/\D/g, "").slice(0, 10);
}
export function toE164USFrom10(d10: string): string | null {
  if (!/^\d{10}$/.test(d10)) return null;
  return `+1${d10}`;
}
export function displayPhone10(e164: string | null) {
  const s = typeof e164 === "string" ? e164.trim() : "";
  if (!/^\+1\d{10}$/.test(s)) return "—";
  return s.replace(/^\+1/, "");
}
