import { SEED_TENANTS } from "./seedData";
import { REGISTRAR_LOOKUP_DOMAINS } from "./registrarLookupConfig";
import { assertDevFirebaseProject, FieldValue, getAdminDb } from "../lib/firebaseAdmin";
import { detectRegistrarForDomain } from "../lib/detectRegistrar";

async function main() {
  const projectId = assertDevFirebaseProject();
  console.log(`Seeding demoSites in Firebase project: ${projectId}`);

  const db = getAdminDb();

  for (const tenant of SEED_TENANTS) {
    const { siteId, sourceUrl, ...rest } = tenant;
    let registrar: string | null = null;
    const lookupDomain =
      REGISTRAR_LOOKUP_DOMAINS[siteId] ??
      sourceUrl?.replace(/^https?:\/\//, "").split("/")[0];

    if (lookupDomain && !lookupDomain.endsWith(".example")) {
      const lookupUrl = lookupDomain.startsWith("http")
        ? lookupDomain
        : `https://${lookupDomain}`;
      process.stdout.write(`RDAP lookup for ${lookupUrl}… `);
      registrar = await detectRegistrarForDomain(lookupUrl);
      console.log(registrar ?? "(none)");
    }

    const doc: Record<string, unknown> = {
      ...rest,
      sourceUrl: sourceUrl ?? null,
      ownerUid: null,
      subscriptionStatus: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      dnsRevealUnlocked: false,
      customDomain: null,
      status: "demo",
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (registrar) {
      doc.registrar = registrar;
    }

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
