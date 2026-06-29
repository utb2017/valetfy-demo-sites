export type DemoSiteStatEvent = "views" | "book" | "claim" | "text" | "call";

export type DemoSiteStats = {
  views: number;
  book: number;
  claim: number;
  text: number;
  call: number;
};

export const DEMO_SITE_STAT_EVENTS: DemoSiteStatEvent[] = [
  "views",
  "book",
  "claim",
  "text",
  "call",
];

export function emptyDemoSiteStats(): DemoSiteStats {
  return { views: 0, book: 0, claim: 0, text: 0, call: 0 };
}

export function normalizeDemoSiteStats(raw: unknown): DemoSiteStats {
  const base = emptyDemoSiteStats();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  for (const key of DEMO_SITE_STAT_EVENTS) {
    const n = Number(o[key]);
    base[key] = Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }
  return base;
}
