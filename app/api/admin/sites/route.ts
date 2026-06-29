import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { listAllDemoSitesAdmin } from "@/lib/listDemoSitesAdmin";
import { countsTowardMrr, getEffectivePriceUsd } from "@/lib/monetization";
import { getClaimPriceUsd } from "@/lib/stripe";

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
  const defaultPriceUsd = getClaimPriceUsd();

  const subscribed = sites.filter((s) => s.subscriptionStatus);
  const mrrSites = subscribed.filter((s) => countsTowardMrr(s));
  const activeCount = mrrSites.length;
  const mrrUsd = mrrSites.reduce(
    (sum, s) => sum + getEffectivePriceUsd(s),
    0
  );
  const canceledCount = subscribed.filter(
    (s) => s.subscriptionStatus === "canceled"
  ).length;

  return NextResponse.json({
    sites,
    subscriptions: {
      priceUsd: defaultPriceUsd,
      mrrUsd,
      activeCount,
      canceledCount,
      totalWithSubscription: subscribed.length,
    },
  });
}
