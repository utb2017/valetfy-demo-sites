import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { renderDemoSiteForSlug } from "@/components/DemoSitePage";
import { resolveSiteIdFromRequest } from "@/lib/resolveSiteFromRequest";

export default async function HomePage() {
  const siteId = await resolveSiteIdFromRequest();

  if (siteId === "admin") {
    redirect("/admin");
  }

  if (!siteId) {
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

  return renderDemoSiteForSlug(siteId);
}
