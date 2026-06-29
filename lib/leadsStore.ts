import type { DemoSiteLeadDoc } from "@/lib/demoSiteTypes";
import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";

export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

function tsToIso(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const maybe = v as { toDate?: () => Date };
  if (typeof maybe.toDate === "function") {
    return maybe.toDate().toISOString();
  }
  return null;
}

export async function createDemoSiteLead(
  siteId: string,
  input: LeadInput
): Promise<{ leadId: string; lead: DemoSiteLeadDoc }> {
  const db = getAdminDb();
  const siteRef = db.collection("demoSites").doc(siteId);
  const leadRef = siteRef.collection("leads").doc();

  const leadData = {
    name: input.name,
    email: input.email,
    phone: input.phone?.trim() || null,
    message: input.message,
    sourceSiteId: siteId,
    createdAt: FieldValue.serverTimestamp(),
  };

  await db.runTransaction(async (tx) => {
    const siteSnap = await tx.get(siteRef);
    if (!siteSnap.exists) throw new Error("Site not found");

    const stats = siteSnap.data()?.stats ?? {};
    const currentLeads = Number(stats.leads) || 0;

    tx.set(leadRef, leadData);
    tx.set(
      siteRef,
      {
        stats: { ...stats, leads: currentLeads + 1 },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  return {
    leadId: leadRef.id,
    lead: {
      name: input.name,
      email: input.email,
      phone: input.phone?.trim() || null,
      message: input.message,
      sourceSiteId: siteId,
    },
  };
}

export type LeadRow = {
  leadId: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  sourceSiteId: string;
  createdAt: string | null;
};

export async function listRecentLeadsForSite(
  siteId: string,
  limit = 5
): Promise<LeadRow[]> {
  const db = getAdminDb();
  const snap = await db
    .collection("demoSites")
    .doc(siteId)
    .collection("leads")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => {
    const data = d.data() as DemoSiteLeadDoc;
    return {
      leadId: d.id,
      ...data,
      createdAt: tsToIso(data.createdAt),
    };
  });
}

export async function countLeadsForSite(siteId: string): Promise<number> {
  const db = getAdminDb();
  const snap = await db
    .collection("demoSites")
    .doc(siteId)
    .collection("leads")
    .count()
    .get();
  return snap.data().count;
}
