import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { listAllDemoSitesAdmin } from "@/lib/listDemoSitesAdmin";
import { getClaimPriceUsd } from "@/lib/stripe";
import { subscriptionIsActive } from "@/lib/subscriptionUtils";

export const runtime = "nodejs";

function assertAdmin(user: { uid: string } | null) {
  if (!user || !isAdminUid(user.uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(request: Request) {
  const user = await verifyBearerToken(request);
  const denied = assertAdmin(user);
  if (denied) return denied;

  const sites = await listAllDemoSitesAdmin();
  const priceUsd = getClaimPriceUsd();

  const subscribed = sites.filter((s) => s.subscriptionStatus);
  const activeCount = subscribed.filter((s) =>
    subscriptionIsActive(s.subscriptionStatus ?? null)
  ).length;
  const canceledCount = subscribed.filter(
    (s) => s.subscriptionStatus === "canceled"
  ).length;

  return NextResponse.json({
    sites,
    subscriptions: {
      priceUsd,
      mrrUsd: activeCount * priceUsd,
      activeCount,
      canceledCount,
      totalWithSubscription: subscribed.length,
    },
  });
}
