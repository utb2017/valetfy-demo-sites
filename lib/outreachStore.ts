import type { DemoSiteOutreachStatus } from "@/lib/demoSiteTypes";
import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";

export async function recordOutreachSent(siteId: string): Promise<void> {
  const db = getAdminDb();
  await db.collection("demoSites").doc(siteId).set(
    {
      outreachStatus: "sent" satisfies DemoSiteOutreachStatus,
      outreachSentAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function recordOutreachFailed(siteId: string): Promise<void> {
  const db = getAdminDb();
  await db.collection("demoSites").doc(siteId).set(
    {
      outreachStatus: "failed" satisfies DemoSiteOutreachStatus,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}
