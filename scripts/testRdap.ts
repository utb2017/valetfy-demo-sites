import { lookupRegistrarWithFallback } from "../lib/rdapLookup";

const domains = [
  "scotthomeservices.com",
  "woofwashmobile.com",
  "smallbizpreview.com",
  "hyphly.com",
  "cloudflare.com",
];

async function main() {
  for (const d of domains) {
    const r = await lookupRegistrarWithFallback(`https://${d}`);
    console.log(d, "→", r ?? "(none)");
  }
}

main();
