import { notFound } from "next/navigation";

import { ConnectPageClient } from "@/components/connect/ConnectPageClient";
import { loadSiteForRequest } from "@/lib/resolveSiteFromRequest";

export default async function ConnectPage() {
  const site = await loadSiteForRequest();
  if (!site) notFound();
  return <ConnectPageClient site={site} />;
}
