import { SiteHeader } from "@/components/lotuspetspa/site-header";
import { HeroSection } from "@/components/lotuspetspa/hero-section";
import { TrustStrip } from "@/components/lotuspetspa/trust-strip";
import { FeaturesSection } from "@/components/lotuspetspa/features-section";
import { PricingSection } from "@/components/lotuspetspa/pricing-section";
import { ReviewsSection } from "@/components/lotuspetspa/reviews-section";
import { AboutSection } from "@/components/lotuspetspa/about-section";
import { ContactSection } from "@/components/lotuspetspa/contact-section";
import { CtaBand } from "@/components/lotuspetspa/cta-band";
import { SiteFooter } from "@/components/lotuspetspa/site-footer";
import { MobileStickyBar } from "@/components/lotuspetspa/mobile-sticky-bar";

import { ClaimBar } from "@/components/ClaimBar";
import { PageViewTracker } from "@/components/analytics/trackDemoSiteEvent";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";

export const dynamic = "force-dynamic";

export default async function LotusPetSpaMobilePage() {
  let site: Awaited<ReturnType<typeof getDemoSiteBySlug>> = null;
  try {
    site = await getDemoSiteBySlug("lotus-pet-spa-mobile");
    if (site?.status === "archived") {
      site = null;
    }
  } catch (err) {
    console.error("[lotus-pet-spa-mobile] demo site lookup failed:", err);
  }

  return (
    <>
      {site ? <PageViewTracker siteId={site.siteId} /> : null}
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <FeaturesSection />
        <PricingSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
        <CtaBand />
      </main>
      <SiteFooter />
      <MobileStickyBar />
      {site ? <ClaimBar site={site} /> : null}
    </>
  );
}
