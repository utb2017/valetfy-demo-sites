import type { DemoSiteDoc, DemoSitePublic } from "@/lib/demoSiteTypes";
import { assertDevFirebaseProject, getAdminDb } from "@/lib/firebaseAdmin";

function asDemoSitePublic(
  siteId: string,
  data: FirebaseFirestore.DocumentData
): DemoSitePublic {
  return {
    siteId,
    businessName: String(data.businessName ?? ""),
    slug: String(data.slug ?? siteId),
    owner: data.owner,
    sourceUrl: data.sourceUrl,
    registrar: data.registrar,
    status: data.status ?? "demo",
    generatedPages: Array.isArray(data.generatedPages)
      ? data.generatedPages
      : [],
    theme: data.theme ?? {
      primaryColor: "#1e3a5f",
      accentColor: "#c9a227",
    },
    contentBlocks: Array.isArray(data.contentBlocks)
      ? data.contentBlocks
      : [],
    backlinkEnabled: data.backlinkEnabled !== false,
    subscriptionStatus: data.subscriptionStatus ?? null,
    stripeCustomerId: data.stripeCustomerId ?? null,
    stripeSubscriptionId: data.stripeSubscriptionId ?? null,
    dnsRevealUnlocked: Boolean(data.dnsRevealUnlocked),
  };
}

export async function getDemoSiteBySlug(
  slug: string
): Promise<DemoSitePublic | null> {
  assertDevFirebaseProject();
  const db = getAdminDb();
  const snap = await db.collection("demoSites").doc(slug).get();
  if (!snap.exists) return null;
  return asDemoSitePublic(snap.id, snap.data() as DemoSiteDoc);
}
