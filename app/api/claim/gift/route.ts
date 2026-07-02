import { NextResponse } from "next/server";

import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { claimGiftSite } from "@/lib/demoSiteSubscription";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { sendClaimCompletedEmails } from "@/lib/claimEmails";
import { isGiftMonetization } from "@/lib/monetization";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await verifyBearerToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { siteId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const siteId = body.siteId?.trim();
  if (!siteId) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  const site = await getDemoSiteBySlug(siteId);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  if (!isGiftMonetization(site.monetization)) {
    return NextResponse.json(
      { error: "This site requires a paid subscription to claim." },
      { status: 400 }
    );
  }

  if (
    site.ownerUid &&
    site.ownerUid !== user.uid &&
    site.dnsRevealUnlocked
  ) {
    return NextResponse.json(
      { error: "This site is already claimed by another account." },
      { status: 409 }
    );
  }

  if (site.ownerUid === user.uid && site.dnsRevealUnlocked) {
    return NextResponse.json({ ok: true, redirect: "/connect" });
  }

  await claimGiftSite(siteId, user.uid);

  const emailResult = await sendClaimCompletedEmails({
    siteId,
    customerEmail: user.email,
    claimType: "gift",
  });

  return NextResponse.json({
    ok: true,
    redirect: "/connect",
    emailWarnings:
      emailResult.warnings.length > 0 ? emailResult.warnings : undefined,
  });
}
