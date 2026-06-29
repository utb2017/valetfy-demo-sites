import Stripe from "stripe";

let _stripe: Stripe | null = null;

function safeStr(v: unknown): string {
  const raw =
    typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}

export function assertStripeTestMode(): string {
  const key = safeStr(process.env.STRIPE_SECRET_KEY);
  if (!key.startsWith("sk_test_")) {
    throw new Error(
      "Refusing demo-sites Stripe call: STRIPE_SECRET_KEY must be sk_test_*."
    );
  }
  return key;
}

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = assertStripeTestMode();
  _stripe = new Stripe(key);
  return _stripe;
}

export function getDemoSitesPriceId(): string {
  const priceId = safeStr(process.env.STRIPE_DEMO_SITES_PRICE_ID);
  if (!priceId) {
    throw new Error("Missing STRIPE_DEMO_SITES_PRICE_ID");
  }
  return priceId;
}

export function getClaimPriceUsd(): number {
  const n = Number(process.env.DEMO_SITES_CLAIM_PRICE_USD ?? "19");
  return Number.isFinite(n) && n > 0 ? n : 19;
}

export function getWebhookSecret(): string {
  const secret = safeStr(process.env.STRIPE_DEMO_SITES_WEBHOOK_SECRET);
  if (!secret) {
    throw new Error("Missing STRIPE_DEMO_SITES_WEBHOOK_SECRET");
  }
  return secret;
}
