import { demoSitePublicUrl } from "@/lib/demoSiteUrl";

export function composeOutreachEmail(input: {
  businessName: string;
  slug: string;
  ownerName?: string | null;
}): { subject: string; textBody: string } {
  const url = demoSitePublicUrl(input.slug);
  const greeting = input.ownerName?.trim()
    ? `Hi ${input.ownerName.split(" ")[0]},`
    : "Hi there,";

  const subject = `A quick site for ${input.businessName}`;
  const textBody = `${greeting}

I spent a little time putting together a simple site for ${input.businessName} — nothing fancy, just something clean you could actually use if you wanted.

Here it is: ${url}

No pressure at all. I thought it might be useful and wanted to share it in case it's helpful.

— Aaron
Valetfy`;

  return { subject, textBody };
}
