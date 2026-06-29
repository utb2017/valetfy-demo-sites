import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import type { DemoSiteSubscriptionStatus } from "@/lib/demoSiteTypes";

export { subscriptionIsActive } from "@/lib/subscriptionUtils";

export async function updateDemoSiteFromSubscription(input: {
  siteId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus: DemoSiteSubscriptionStatus | string;
  ownerUid?: string | null;
  dnsRevealUnlocked: boolean;
  status?: "demo" | "sold" | "live";
}) {
  const db = getAdminDb();
  const ref = db.collection("demoSites").doc(input.siteId);

  const patch: Record<string, unknown> = {
    subscriptionStatus: input.subscriptionStatus,
    stripeCustomerId: input.stripeCustomerId ?? null,
    stripeSubscriptionId: input.stripeSubscriptionId ?? null,
    dnsRevealUnlocked: input.dnsRevealUnlocked,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.ownerUid) patch.ownerUid = input.ownerUid;
  if (input.status) patch.status = input.status;

  await ref.set(patch, { merge: true });
}

export async function setDemoSiteOwnerUid(siteId: string, ownerUid: string) {
  const db = getAdminDb();
  await db
    .collection("demoSites")
    .doc(siteId)
    .set(
      {
        ownerUid,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

export async function claimGiftSite(siteId: string, ownerUid: string) {
  const db = getAdminDb();
  await db.collection("demoSites").doc(siteId).set(
    {
      ownerUid,
      monetization: "gift",
      dnsRevealUnlocked: true,
      status: "gifted",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function setDemoSiteCustomDomain(
  siteId: string,
  customDomain: string
) {
  const db = getAdminDb();
  await db
    .collection("demoSites")
    .doc(siteId)
    .set(
      {
        customDomain,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}
