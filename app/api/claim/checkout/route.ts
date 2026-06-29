import { NextResponse } from "next/server";

import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { getRequestOriginFromHeaders } from "@/lib/siteOrigin";
import { setDemoSiteOwnerUid } from "@/lib/demoSiteSubscription";
import {
  assertStripeTestMode,
  getClaimPriceUsd,
  getDemoSitesPriceId,
  getStripe,
} from "@/lib/stripe";

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
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
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

  if (
    site.dnsRevealUnlocked &&
    site.ownerUid === user.uid &&
    site.stripeCustomerId
  ) {
    return NextResponse.json(
      { error: "Already subscribed", redirect: "/connect" },
      { status: 409 }
    );
  }

  await setDemoSiteOwnerUid(siteId, user.uid);

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const origin = getRequestOriginFromHeaders(host, proto);

  const stripe = getStripe();
  const priceId = getDemoSitesPriceId();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: siteId,
    customer_email: user.email,
    success_url: `${origin}/connect?checkout=success`,
    cancel_url: `${origin}/?checkout=canceled`,
    metadata: {
      siteId,
      ownerUid: user.uid,
      lane: "demo-sites",
    },
    subscription_data: {
      metadata: {
        siteId,
        ownerUid: user.uid,
        lane: "demo-sites",
      },
    },
  });

  return NextResponse.json({
    url: session.url,
    priceUsd: getClaimPriceUsd(),
  });
}
