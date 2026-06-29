/**
 * Smoke test: Firebase custom token → checkout session → (optional) webhook unlock.
 * Run: npm run smoke:claim
 */
import { getAuth } from "firebase-admin/auth";

import { assertDevFirebaseProject, getAdminDb } from "../lib/firebaseAdmin";
import { getDemoSiteBySlug } from "../lib/getDemoSite";
import { updateDemoSiteFromSubscription } from "../lib/demoSiteSubscription";
import { assertStripeTestMode } from "../lib/stripe";

const TEST_UID = "demo-sites-smoke-test";
const SITE_ID = process.env.SMOKE_SITE_ID ?? "scott";
const ORIGIN = process.env.DEMO_SITES_SITE_ORIGIN ?? "http://127.0.0.1:3000";

async function exchangeCustomToken(customToken: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/^"|"$/g, "");
  if (!apiKey) throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) {
    throw new Error(JSON.stringify(data));
  }
  return data.idToken as string;
}

async function main() {
  assertDevFirebaseProject();
  assertStripeTestMode();

  const db = getAdminDb();
  await db.collection("demoSites").doc(SITE_ID).set(
    {
      ownerUid: null,
      subscriptionStatus: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      dnsRevealUnlocked: false,
      status: "demo",
    },
    { merge: true }
  );

  const customToken = await getAuth().createCustomToken(TEST_UID, {
    smoke: "demo-sites",
  });
  const idToken = await exchangeCustomToken(customToken);

  const checkoutRes = await fetch(`${ORIGIN}/api/claim/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      Host: "scott.localhost",
    },
    body: JSON.stringify({ siteId: SITE_ID }),
  });
  const checkoutJson = await checkoutRes.json();
  console.log("Checkout API:", checkoutRes.status, checkoutJson);

  if (checkoutJson.url) {
    console.log("\n→ Open this URL and pay with test card 4242 4242 4242 4242:");
    console.log(checkoutJson.url);
  }

  // Simulate webhook unlock (mirrors checkout.session.completed handler)
  await updateDemoSiteFromSubscription({
    siteId: SITE_ID,
    ownerUid: TEST_UID,
    stripeCustomerId: "cus_smoke_demo_sites",
    stripeSubscriptionId: "sub_smoke_demo_sites",
    subscriptionStatus: "active",
    dnsRevealUnlocked: true,
    status: "sold",
  });

  const site = await getDemoSiteBySlug(SITE_ID);
  console.log("\nPost-unlock site:", {
    ownerUid: site?.ownerUid,
    dnsRevealUnlocked: site?.dnsRevealUnlocked,
    subscriptionStatus: site?.subscriptionStatus,
    status: site?.status,
  });

  const accessRes = await fetch(
    `${ORIGIN}/api/connect/access?siteId=${SITE_ID}`,
    { headers: { Authorization: `Bearer ${idToken}`, Host: "scott.localhost" } }
  );
  const accessJson = await accessRes.json();
  console.log("\nConnect access API:", accessRes.status, {
    allowed: accessJson.allowed,
    guide: accessJson.guide?.label,
    domainConnect: accessJson.guide?.supportsDomainConnect,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
