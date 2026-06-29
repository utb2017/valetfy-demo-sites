/**
 * Re-run RDAP registrar detection from each demoSite's sourceUrl.
 * Run: npm run registrars:refresh
 */
import { assertDevFirebaseProject, FieldValue, getAdminDb } from "../lib/firebaseAdmin";
import { detectRegistrarForDomain } from "../lib/detectRegistrar";
import { domainFromSourceUrl } from "../lib/sourceUrl";
import { SEED_TENANTS } from "./seedData";

async function main() {
  assertDevFirebaseProject();
  const db = getAdminDb();

  for (const tenant of SEED_TENANTS) {
    const lookupDomain = domainFromSourceUrl(tenant.sourceUrl);

    if (!lookupDomain) {
      console.warn(`Skip ${tenant.siteId}: no sourceUrl domain`);
      continue;
    }

    const lookupUrl = `https://${lookupDomain}`;
    process.stdout.write(`RDAP ${tenant.siteId} (${lookupDomain})… `);
    const registrar = await detectRegistrarForDomain(lookupUrl);
    console.log(registrar ?? "(none)");

    if (!registrar) {
      console.warn(`  No registrar returned for ${tenant.siteId}`);
      continue;
    }

    await db.collection("demoSites").doc(tenant.siteId).set(
      {
        sourceUrl: tenant.sourceUrl ?? lookupUrl,
        registrar,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`✓ demoSites/${tenant.siteId} → ${registrar}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
