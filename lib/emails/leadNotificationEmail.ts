import type { DemoSiteLeadDoc } from "@/lib/demoSiteTypes";
import { demoSitePublicUrl } from "@/lib/demoSiteUrl";

export function composeLeadNotificationEmail(input: {
  businessName: string;
  slug: string;
  lead: DemoSiteLeadDoc;
}): { subject: string; textBody: string } {
  const siteUrl = demoSitePublicUrl(input.slug);

  const lines = [
    `New lead for ${input.businessName}`,
    `Site: ${siteUrl}`,
    "",
    `Name: ${input.lead.name}`,
    `Email: ${input.lead.email}`,
  ];
  if (input.lead.phone) lines.push(`Phone: ${input.lead.phone}`);
  lines.push("", "Message:", input.lead.message);

  return {
    subject: `New lead — ${input.businessName}`,
    textBody: lines.join("\n"),
  };
}
