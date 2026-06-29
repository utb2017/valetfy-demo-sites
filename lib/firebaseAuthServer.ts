import { getAuth } from "firebase-admin/auth";

import { getAdminDb } from "@/lib/firebaseAdmin";

export type VerifiedUser = {
  uid: string;
  email?: string;
};

export async function verifyBearerToken(
  request: Request
): Promise<VerifiedUser | null> {
  getAdminDb();

  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

export async function assertSiteOwner(
  siteId: string,
  uid: string
): Promise<boolean> {
  const db = getAdminDb();
  const snap = await db.collection("demoSites").doc(siteId).get();
  if (!snap.exists) return false;
  const ownerUid = snap.data()?.ownerUid;
  return typeof ownerUid === "string" && ownerUid === uid;
}
