import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import { composeWelcomeEmail } from "@/lib/emails/welcomeEmail";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { sendPostmarkEmail } from "@/lib/postmarkSend";

export async function sendWelcomeEmailForClaim(input: {
  siteId: string;
  customerEmail?: string | null;
}): Promise<void> {
  const site = await getDemoSiteBySlug(input.siteId);
  if (!site) return;

  const db = getAdminDb();
  const ref = db.collection("demoSites").doc(input.siteId);
  const snap = await ref.get();
  if (snap.data()?.welcomeEmailSentAt) return;

  const { subject, textBody } = composeWelcomeEmail({
    businessName: site.businessName,
    slug: site.slug,
  });

  await sendPostmarkEmail({
    intendedTo: input.customerEmail,
    subject,
    textBody,
    tag: "demo-site-welcome",
  });

  await ref.set(
    {
      welcomeEmailSentAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}
