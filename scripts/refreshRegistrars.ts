/**
 * Re-run RDAP registrar detection for demoSites tenants.
 * Run: npm run registrars:refresh
 */
import { assertDevFirebaseProject, FieldValue, getAdminDb } from "../lib/firebaseAdmin";
import { detectRegistrarForDomain } from "../lib/detectRegistrar";
import { REGISTRAR_LOOKUP_DOMAINS } from "./registrarLookupConfig";
import { SEED_TENANTS } from "./seedData";

async function main() {
  assertDevFirebaseProject();
  const db = getAdminDb();

  for (const tenant of SEED_TENANTS) {
    const lookupDomain =
      REGISTRAR_LOOKUP_DOMAINS[tenant.siteId] ??
      tenant.sourceUrl?.replace(/^https?:\/\//, "").split("/")[0];

    if (!lookupDomain || lookupDomain.endsWith(".example")) {
      console.warn(`Skip ${tenant.siteId}: no real lookup domain configured`);
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

    const patch: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (tenant.sourceUrl) {
      patch.sourceUrl = tenant.sourceUrl;
    }
    patch.registrar = registrar;

    await db.collection("demoSites").doc(tenant.siteId).set(patch, {
      merge: true,
    });

    console.log(`✓ demoSites/${tenant.siteId} → ${registrar}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
