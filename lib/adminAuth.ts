function safeStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

export function getAdminUids(): Set<string> {
  const raw = safeStr(process.env.DEMO_SITES_ADMIN_UIDS);
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function isAdminUid(uid: string | null | undefined): boolean {
  if (!uid) return false;
  const allow = getAdminUids();
  if (allow.size === 0) return false;
  return allow.has(uid);
}
