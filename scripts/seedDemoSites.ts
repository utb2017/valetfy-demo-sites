import { SEED_TENANTS } from "./seedData";
import { assertDevFirebaseProject, FieldValue, getAdminDb } from "../lib/firebaseAdmin";
import { lookupRegistrarWithFallback } from "../lib/rdapLookup";

async function main() {
  const projectId = assertDevFirebaseProject();
  console.log(`Seeding demoSites in Firebase project: ${projectId}`);

  const db = getAdminDb();

  for (const tenant of SEED_TENANTS) {
    const { siteId, sourceUrl, ...rest } = tenant;
    let registrar: string | null = null;

    if (sourceUrl) {
      process.stdout.write(`RDAP lookup for ${sourceUrl}… `);
      registrar = await lookupRegistrarWithFallback(sourceUrl);
      console.log(registrar ?? "(none)");
    }

    const doc = {
      ...rest,
      sourceUrl: sourceUrl ?? null,
      registrar: registrar ?? tenant.registrar ?? null,
      ownerUid: null,
      subscriptionStatus: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      dnsRevealUnlocked: false,
      customDomain: null,
      status: "demo",
      updatedAt: FieldValue.serverTimestamp(),
    };

    const ref = db.collection("demoSites").doc(siteId);
    const existing = await ref.get();

    await ref.set(
      {
        ...doc,
        createdAt: existing.exists
          ? existing.data()?.createdAt ?? FieldValue.serverTimestamp()
          : FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`✓ demoSites/${siteId} (${tenant.businessName})`);
  }

  console.log("\nDone. Dev URLs:");
  for (const tenant of SEED_TENANTS) {
    console.log(`  https://${tenant.slug}.dev.sites.valetfy.com`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
