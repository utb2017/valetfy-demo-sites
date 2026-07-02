import { NextResponse } from "next/server";



import { verifyBearerToken } from "@/lib/firebaseAuthServer";

import { getDemoSiteBySlug } from "@/lib/getDemoSite";

import { getRequestOriginFromHeaders } from "@/lib/siteOrigin";

import { setDemoSiteOwnerUid } from "@/lib/demoSiteSubscription";

import {

  getEffectivePriceUsd,

  isGiftMonetization,

} from "@/lib/monetization";

import {

  assertStripeTestMode,

  getClaimPriceUsd,

  getDemoSitesPriceId,

  getDemoSitesProductId,

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



  if (isGiftMonetization(site.monetization)) {

    return NextResponse.json(

      {

        error: "This site is a free gift — use the gift claim flow.",

        redirect: "gift",

      },

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

  const effectivePrice = getEffectivePriceUsd(site);

  const defaultPrice = getClaimPriceUsd();

  const useCatalogPrice = Math.abs(effectivePrice - defaultPrice) < 0.001;



  const lineItems = useCatalogPrice

    ? [{ price: getDemoSitesPriceId(), quantity: 1 }]

    : [

        {

          price_data: {

            currency: "usd",

            unit_amount: Math.round(effectivePrice * 100),

            recurring: { interval: "month" as const },

            product: getDemoSitesProductId(),

          },

          quantity: 1,

        },

      ];



  const session = await stripe.checkout.sessions.create({

    mode: "subscription",

    line_items: lineItems,

    client_reference_id: siteId,

    customer_email: user.email,

    success_url: `${origin}/connect?checkout=success`,

    cancel_url: `${origin}/?checkout=canceled`,

    metadata: {

      siteId,

      ownerUid: user.uid,

      lane: "demo-sites",

      monetization: "paid",

    },

    subscription_data: {

      metadata: {

        siteId,

        ownerUid: user.uid,

        lane: "demo-sites",

        monetization: "paid",

      },

    },

  });



  return NextResponse.json({

    url: session.url,

    priceUsd: effectivePrice,

  });

}

