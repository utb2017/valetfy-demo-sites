/**
 * Creates Stripe TEST product + price for demo-sites claim flow.
 * Archives active prices that do not match DEMO_SITES_CLAIM_PRICE_USD.
 * Run: npm run stripe:setup
 */
import Stripe from "stripe";

function assertTestKey(key: string) {
  if (!key.startsWith("sk_test_")) {
    throw new Error(
      `Refusing: STRIPE_SECRET_KEY must be sk_test_* (got ${key.slice(0, 8)}…)`
    );
  }
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  assertTestKey(key);

  const stripe = new Stripe(key);
  const amountUsd = Number(process.env.DEMO_SITES_CLAIM_PRICE_USD ?? "9.99");
  const unitAmount = Math.round(amountUsd * 100);

  const existing = await stripe.products.search({
    query: "metadata['lane']:'demo-sites' AND active:'true'",
    limit: 1,
  });

  let product = existing.data[0];
  if (!product) {
    product = await stripe.products.create({
      name: "Valetfy Demo Site",
      description:
        "Monthly subscription to claim a demo website and unlock custom domain DNS.",
      metadata: { lane: "demo-sites", env: "test" },
    });
    console.log("Created product:", product.id);
  } else {
    console.log("Reusing product:", product.id);
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 20,
  });

  for (const p of prices.data) {
    if (p.unit_amount !== unitAmount || p.recurring?.interval !== "month") {
      await stripe.prices.update(p.id, { active: false });
      console.log("Archived old price:", p.id, `($${(p.unit_amount ?? 0) / 100}/mo)`);
    }
  }

  const refreshed = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 20,
  });

  let price = refreshed.data.find(
    (p) =>
      p.unit_amount === unitAmount &&
      p.currency === "usd" &&
      p.recurring?.interval === "month"
  );

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: "usd",
      recurring: { interval: "month" },
      metadata: { lane: "demo-sites", amountUsd: String(amountUsd) },
    });
    console.log("Created price:", price.id);
  } else {
    console.log("Reusing price:", price.id);
  }

  console.log("\nAdd to .env.local / Vercel:");
  console.log(`STRIPE_DEMO_SITES_PRODUCT_ID=${product.id}`);
  console.log(`STRIPE_DEMO_SITES_PRICE_ID=${price.id}`);
  console.log(`DEMO_SITES_CLAIM_PRICE_USD=${amountUsd}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
