import { demoSiteConnectUrl, demoSitePublicUrl } from "@/lib/demoSiteUrl";

export function composeWelcomeEmail(input: {
  businessName: string;
  slug: string;
}): { subject: string; textBody: string } {
  const siteUrl = demoSitePublicUrl(input.slug);
  const connectUrl = demoSiteConnectUrl(input.slug);

  return {
    subject: `You're in — connect your domain for ${input.businessName}`,
    textBody: `Thanks for claiming ${input.businessName} on Valetfy.

Your demo site: ${siteUrl}

Next step — connect your custom domain (DNS instructions are unlocked):

${connectUrl}

Sign in with the same Valetfy account you used at checkout. If you need to manage billing, use the link on that page.

— Valetfy`,
  };
}
