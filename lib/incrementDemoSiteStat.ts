import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import type { DemoSiteStatEvent } from "@/lib/demoSiteStats";

export async function incrementDemoSiteStat(
  siteId: string,
  event: DemoSiteStatEvent
): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection("demoSites").doc(siteId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;

    const stats = snap.data()?.stats ?? {};
    const current = Number(stats[event]) || 0;

    tx.set(
      ref,
      {
        stats: {
          ...stats,
          [event]: current + 1,
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}
