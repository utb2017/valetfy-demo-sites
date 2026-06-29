import { NextResponse } from "next/server";

import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { getRegistrarGuide } from "@/lib/registrarGuides";
import { siteConnectUnlocked } from "@/lib/monetization";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await verifyBearerToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const siteId = url.searchParams.get("siteId")?.trim();
  if (!siteId) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  const site = await getDemoSiteBySlug(siteId);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const unlocked = siteConnectUnlocked(site, user.uid);

  if (!unlocked) {
    const isOwner = site.ownerUid === user.uid;
    return NextResponse.json(
      {
        allowed: false,
        reason: isOwner
          ? "Claim this site to unlock DNS instructions"
          : "Not the site owner",
      },
      { status: 403 }
    );
  }

  const guide = getRegistrarGuide(site.registrar);

  return NextResponse.json({
    allowed: true,
    site: {
      siteId: site.siteId,
      businessName: site.businessName,
      registrar: site.registrar,
      customDomain: site.customDomain,
      monetization: site.monetization,
    },
    guide,
  });
}
