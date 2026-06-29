import type { DemoSitePublic } from "@/lib/demoSiteTypes";
import { getClaimPriceUsd } from "@/lib/stripe";
import { subscriptionIsActive } from "@/lib/subscriptionUtils";

export function isGiftMonetization(
  monetization?: string | null
): monetization is "gift" {
  return monetization === "gift";
}

export function getEffectivePriceUsd(site: {
  priceUsd?: number | null;
}): number {
  const override = site.priceUsd;
  if (typeof override === "number" && Number.isFinite(override) && override > 0) {
    return override;
  }
  return getClaimPriceUsd();
}

export function siteConnectUnlocked(
  site: DemoSitePublic,
  userUid: string | null | undefined
): boolean {
  if (!userUid || site.ownerUid !== userUid || !site.dnsRevealUnlocked) {
    return false;
  }
  if (isGiftMonetization(site.monetization) || site.status === "gifted") {
    return true;
  }
  return subscriptionIsActive(site.subscriptionStatus ?? null);
}

export function siteClaimActive(
  site: DemoSitePublic,
  userUid: string | null | undefined
): boolean {
  return siteConnectUnlocked(site, userUid);
}

export function countsTowardMrr(site: {
  monetization?: string | null;
  subscriptionStatus?: string | null;
}): boolean {
  if (isGiftMonetization(site.monetization)) return false;
  return subscriptionIsActive(site.subscriptionStatus ?? null);
}
