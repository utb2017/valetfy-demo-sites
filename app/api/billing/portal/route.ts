import { NextResponse } from "next/server";

import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { getRequestOriginFromHeaders } from "@/lib/siteOrigin";
import { assertStripeTestMode, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertStripeTestMode();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe not configured" },
      { status: 500 }
    );
  }

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
  if (!site || site.ownerUid !== user.uid || !site.stripeCustomerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const origin = getRequestOriginFromHeaders(host, proto);

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: site.stripeCustomerId,
    return_url: `${origin}/connect`,
  });

  return NextResponse.json({ url: session.url });
}
