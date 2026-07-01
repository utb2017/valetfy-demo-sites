import { demoSiteConnectUrl, demoSitePublicUrl } from "@/lib/demoSiteUrl";

export function composeClaimAdminNotificationEmail(input: {
  businessName: string;
  slug: string;
  claimType: "paid" | "gift";
  customerEmail?: string | null;
  priceUsd?: number | null;
}): { subject: string; textBody: string } {
  const siteUrl = demoSitePublicUrl(input.slug);
  const connectUrl = demoSiteConnectUrl(input.slug);
  const customer = input.customerEmail?.trim() || "(no email on file)";
  const priceLine =
    input.claimType === "gift"
      ? "Monetization: gift (free)"
      : `Monetization: paid${input.priceUsd != null ? ` ($${input.priceUsd.toFixed(2)}/mo)` : ""}`;

  return {
    subject: `[demo-sites] Claim completed — ${input.businessName}`,
    textBody: [
      "A demo site was claimed.",
      "",
      `Business: ${input.businessName}`,
      `Slug: ${input.slug}`,
      `Site: ${siteUrl}`,
      `Connect: ${connectUrl}`,
      `Type: ${input.claimType}`,
      priceLine,
      `Customer email: ${customer}`,
      "",
      "— Valetfy demo-sites",
    ].join("\n"),
  };
}
