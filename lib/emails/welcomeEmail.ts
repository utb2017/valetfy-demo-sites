import { demoSiteConnectUrl, demoSitePublicUrl } from "@/lib/demoSiteUrl";

export function composeWelcomeEmail(input: {
  businessName: string;
  slug: string;
}): { subject: string; textBody: string } {
  const siteUrl = demoSitePublicUrl(input.slug);
  const connectUrl = demoSiteConnectUrl(input.slug);

  return {
    subject: "Your Valetfy demo site",
    textBody: `Your demo site is ready.

${input.businessName}
${siteUrl}

Next step — connect your custom domain. DNS instructions unlock after claim:

${connectUrl}

Sign in with the same Valetfy account you used at checkout.

— Valetfy`,
  };
}
