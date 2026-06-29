import type { DemoSiteLeadDoc } from "@/lib/demoSiteTypes";
import type { DemoSiteDoc, DemoSitePublic } from "@/lib/demoSiteTypes";
import { normalizeDemoSiteStats } from "@/lib/demoSiteStats";
import { listRecentLeadsForSite, type LeadRow } from "@/lib/leadsStore";
import { FieldValue, assertDevFirebaseProject, getAdminDb } from "@/lib/firebaseAdmin";

export type AdminDemoSiteRow = Omit<
  DemoSitePublic,
  "outreachSentAt" | "welcomeEmailSentAt"
> & {
  stats: ReturnType<typeof normalizeDemoSiteStats>;
  createdAt: string | null;
  updatedAt: string | null;
  outreachStatus: string | null;
  outreachSentAt: string | null;
  recentLeads: LeadRow[];
};

function tsToIso(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const maybe = v as { toDate?: () => Date };
  if (typeof maybe.toDate === "function") {
    return maybe.toDate().toISOString();
  }
  return null;
}

function toAdminRow(
  siteId: string,
  data: FirebaseFirestore.DocumentData,
  recentLeads: LeadRow[]
): AdminDemoSiteRow {
  const doc = data as DemoSiteDoc;
  return {
    siteId,
    businessName: String(doc.businessName ?? ""),
    slug: String(doc.slug ?? siteId),
    owner: doc.owner,
    ownerUid: doc.ownerUid ?? null,
    sourceUrl: doc.sourceUrl,
    registrar: doc.registrar ?? null,
    customDomain: doc.customDomain ?? null,
    status: doc.status ?? "demo",
    generatedPages: Array.isArray(doc.generatedPages) ? doc.generatedPages : [],
    theme: doc.theme ?? { primaryColor: "#1e3a5f", accentColor: "#c9a227" },
    contentBlocks: Array.isArray(doc.contentBlocks) ? doc.contentBlocks : [],
    backlinkEnabled: doc.backlinkEnabled !== false,
    subscriptionStatus: doc.subscriptionStatus ?? null,
    stripeCustomerId: doc.stripeCustomerId ?? null,
    stripeSubscriptionId: doc.stripeSubscriptionId ?? null,
    dnsRevealUnlocked: Boolean(doc.dnsRevealUnlocked),
    stats: normalizeDemoSiteStats(doc.stats),
    outreachStatus: doc.outreachStatus ?? null,
    outreachSentAt: tsToIso(doc.outreachSentAt),
    recentLeads,
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
  };
}

export async function listAllDemoSitesAdmin(): Promise<AdminDemoSiteRow[]> {
  assertDevFirebaseProject();
  const db = getAdminDb();
  const snap = await db.collection("demoSites").get();

  const rows = await Promise.all(
    snap.docs.map(async (d) => {
      const recentLeads = await listRecentLeadsForSite(d.id, 5);
      return toAdminRow(d.id, d.data(), recentLeads);
    })
  );

  return rows.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function updateDemoSiteStatusAdmin(
  siteId: string,
  status: DemoSiteDoc["status"]
): Promise<void> {
  assertDevFirebaseProject();
  const db = getAdminDb();
  await db
    .collection("demoSites")
    .doc(siteId)
    .set({ status, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export type { DemoSiteLeadDoc };
