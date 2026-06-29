import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import { composeOutreachEmail } from "@/lib/emails/outreachEmail";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { recordOutreachFailed, recordOutreachSent } from "@/lib/outreachStore";
import { sendPostmarkEmail } from "@/lib/postmarkSend";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ siteId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await verifyBearerToken(request);
  if (!user || !isAdminUid(user.uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { siteId } = await context.params;
  const site = await getDemoSiteBySlug(siteId);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const { subject, textBody } = composeOutreachEmail({
    businessName: site.businessName,
    slug: site.slug,
    ownerName: site.owner?.name,
  });

  const intendedTo = site.owner?.email?.includes("@")
    ? site.owner.email
    : null;

  try {
    const result = await sendPostmarkEmail({
      intendedTo,
      subject,
      textBody,
      tag: "demo-site-outreach",
    });
    await recordOutreachSent(siteId);

    return NextResponse.json({
      ok: true,
      messageId: result.messageId,
      to: result.to,
      devRouted: result.devRouted,
      intendedTo: result.intendedTo,
    });
  } catch (err) {
    await recordOutreachFailed(siteId);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Outreach send failed",
      },
      { status: 500 }
    );
  }
}
