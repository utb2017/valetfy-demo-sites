import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  subscriptionIsActive,
  updateDemoSiteFromSubscription,
} from "@/lib/demoSiteSubscription";
import { assertStripeTestMode, getStripe, getWebhookSecret } from "@/lib/stripe";
import { sendClaimCompletedEmails } from "@/lib/claimEmails";

export const runtime = "nodejs";

function siteIdFromMeta(
  meta: Stripe.Metadata | null | undefined
): string | null {
  const id = meta?.siteId?.trim();
  return id || null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const siteId =
    session.client_reference_id?.trim() ||
    siteIdFromMeta(session.metadata) ||
    null;
  if (!siteId) return;

  const ownerUid = session.metadata?.ownerUid ?? null;
  const customerId =
    typeof session.customer === "string" ? session.customer : null;
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  await updateDemoSiteFromSubscription({
    siteId,
    ownerUid,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    subscriptionStatus: "active",
    dnsRevealUnlocked: true,
    status: "sold",
  });

  const emailResult = await sendClaimCompletedEmails({
    siteId,
    customerEmail: session.customer_details?.email ?? session.customer_email,
    claimType: "paid",
  });
  if (emailResult.warnings.length > 0) {
    console.warn("Claim email warnings:", emailResult.warnings);
  }
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const siteId = siteIdFromMeta(sub.metadata);
  if (!siteId) return;

  const active = subscriptionIsActive(sub.status);
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

  await updateDemoSiteFromSubscription({
    siteId,
    ownerUid: sub.metadata?.ownerUid ?? null,
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    subscriptionStatus: sub.status,
    dnsRevealUnlocked: active,
    status: active ? "sold" : undefined,
  });
}

export async function POST(request: Request) {
  try {
    assertStripeTestMode();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe test only" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, getWebhookSecret());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "customer.subscription.updated":
      await handleSubscriptionChange(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionChange({
        ...(event.data.object as Stripe.Subscription),
        status: "canceled",
      });
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
