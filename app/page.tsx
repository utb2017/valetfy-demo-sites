import { headers } from "next/headers";

import { renderDemoSiteForSlug } from "@/components/DemoSitePage";
import {
  resolveDevFallbackSlug,
  resolveSlugFromHost,
} from "@/lib/resolveTenantFromHost";

export default async function HomePage() {
  const headerStore = await headers();
  const slug =
    headerStore.get("x-demo-site-slug") ??
    resolveSlugFromHost(headerStore.get("host")) ??
    resolveDevFallbackSlug();

  if (!slug) {
    return (
      <main className="landing-fallback">
        <div className="container">
          <h1>Valetfy Demo Sites</h1>
          <p>
            Visit a tenant subdomain, e.g.{" "}
            <code>scott.dev.sites.valetfy.com</code>
          </p>
        </div>
      </main>
    );
  }

  return renderDemoSiteForSlug(slug);
}
