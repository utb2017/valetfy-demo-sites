import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/BlockRenderer";
import { ClaimBar } from "@/components/ClaimBar";
import { PoweredByValetfy } from "@/components/PoweredByValetfy";
import { PageViewTracker } from "@/components/analytics/trackDemoSiteEvent";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import type { DemoSitePublic } from "@/lib/demoSiteTypes";

type Props = {
  site: DemoSitePublic;
};

export function DemoSitePage({ site }: Props) {
  const fontFamily =
    site.theme.fontFamily === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

  return (
    <div
      className="demo-site"
      style={
        {
          "--color-primary": site.theme.primaryColor,
          "--color-accent": site.theme.accentColor,
          "--color-bg": site.theme.backgroundColor ?? "#fafafa",
          fontFamily,
        } as React.CSSProperties
      }
    >
      <PageViewTracker siteId={site.siteId} />
      <header className="site-header">
        <div className="container header-inner">
          {site.theme.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={site.theme.logoUrl} alt="" className="site-logo" />
          ) : null}
          <span className="site-name">{site.businessName}</span>
        </div>
      </header>

      <main>
        <BlockRenderer
          siteId={site.siteId}
          blocks={site.contentBlocks}
          theme={site.theme}
        />
      </main>

      <PoweredByValetfy enabled={site.backlinkEnabled} />
      <ClaimBar site={site} />
    </div>
  );
}

export async function renderDemoSiteForSlug(slug: string) {
  const site = await getDemoSiteBySlug(slug);
  if (!site || site.status === "archived") {
    notFound();
  }
  return <DemoSitePage site={site} />;
}
