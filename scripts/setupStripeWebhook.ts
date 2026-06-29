/**
 * Register Stripe TEST webhook for demo-sites (production Vercel URL).
 * Run: npm run stripe:webhook-setup
 */
import Stripe from "stripe";

const WEBHOOK_URL =
  process.env.DEMO_SITES_WEBHOOK_URL ??
  "https://valetfy-demo-sites.vercel.app/api/stripe/webhook";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!key.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY must be sk_test_*");
  }

  const stripe = new Stripe(key);
  const events: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ];

  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = existing.data.find(
    (w) => w.url === WEBHOOK_URL && w.status !== "disabled"
  );

  if (match) {
    console.log("Existing webhook:", match.id);
    console.log("\nRe-create to retrieve secret, or use Stripe Dashboard.");
    console.log("URL:", match.id);
    return;
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: events,
    description: "valetfy-demo-sites claim unlock (TEST)",
    metadata: { lane: "demo-sites" },
  });

  console.log("Created webhook endpoint:", endpoint.id);
  console.log("URL:", WEBHOOK_URL);
  console.log("\nAdd to .env.local / Vercel:");
  console.log(`STRIPE_DEMO_SITES_WEBHOOK_SECRET=${endpoint.secret}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
