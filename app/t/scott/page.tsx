import { notFound } from "next/navigation";

import { ClaimBar } from "@/components/ClaimBar";
import { PageViewTracker } from "@/components/analytics/trackDemoSiteEvent";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";

export const dynamic = "force-dynamic";

// Scott's real site is served verbatim at /scott/ (public/scott/index.html).
// Frame it same-origin and overlay the demo gift/claim bar. Do NOT inject his
// HTML into this React tree — his vanilla CSS collides with the block globals,
// so an iframe is the clean isolation.
export default async function ScottPage() {
  const site = await getDemoSiteBySlug("scott");
  if (!site || site.status === "archived") {
    notFound();
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <PageViewTracker siteId={site.siteId} />
      <iframe
        src="/scott/index.html"
        title="Scott's Mobile Dog Grooming"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
      <ClaimBar site={site} />
    </div>
  );
}
