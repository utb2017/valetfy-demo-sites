import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/woofwash/site-header";
import { HeroSection } from "@/components/woofwash/hero-section";
import { TrustStrip } from "@/components/woofwash/trust-strip";
import { FeaturesSection } from "@/components/woofwash/features-section";
import { PricingSection } from "@/components/woofwash/pricing-section";
import { AboutSection } from "@/components/woofwash/about-section";
import { ContactSection } from "@/components/woofwash/contact-section";
import { CtaBand } from "@/components/woofwash/cta-band";
import { SiteFooter } from "@/components/woofwash/site-footer";
import { MobileStickyBar } from "@/components/woofwash/mobile-sticky-bar";

import { ClaimBar } from "@/components/ClaimBar";
import { PageViewTracker } from "@/components/analytics/trackDemoSiteEvent";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";

// Read the tenant doc live per request so claim/subscription state (and the
// DNS-reveal unlock after payment) is always current — same as block tenants.
export const dynamic = "force-dynamic";

// Custom "premium" template: renders the approved v0 Woof Wash site verbatim,
// wrapped with the demo-sites claim/subscribe machinery (ClaimBar + tracking).
// The v0 components own all content + styling; this file only composes them
// and keeps the product flow attached. Do not re-style or re-content here.
export default async function WoofWashPage() {
  const site = await getDemoSiteBySlug("woof-wash");
  if (!site || site.status === "archived") {
    notFound();
  }

  return (
    <>
      <PageViewTracker siteId={site.siteId} />
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <FeaturesSection />
        <PricingSection />
        <AboutSection />
        <ContactSection />
        <CtaBand />
      </main>
      <SiteFooter />
      <MobileStickyBar />
      <ClaimBar site={site} />
    </>
  );
}
