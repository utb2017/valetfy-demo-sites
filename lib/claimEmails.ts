import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import { composeClaimAdminNotificationEmail } from "@/lib/emails/claimAdminNotificationEmail";
import { composeWelcomeEmail } from "@/lib/emails/welcomeEmail";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { getEffectivePriceUsd } from "@/lib/monetization";
import { PostmarkSendError, sendPostmarkEmail } from "@/lib/postmarkSend";

export type ClaimEmailResult = {
  customerSent: boolean;
  adminSent: boolean;
  customerMessageId?: string;
  adminMessageId?: string;
  warnings: string[];
};

export async function sendClaimCompletedEmails(input: {
  siteId: string;
  customerEmail?: string | null;
  claimType: "paid" | "gift";
}): Promise<ClaimEmailResult> {
  const site = await getDemoSiteBySlug(input.siteId);
  if (!site) {
    return { customerSent: false, adminSent: false, warnings: ["Site not found"] };
  }

  const db = getAdminDb();
  const ref = db.collection("demoSites").doc(input.siteId);
  const snap = await ref.get();
  const alreadySent = Boolean(snap.data()?.welcomeEmailSentAt);

  const warnings: string[] = [];
  let customerSent = false;
  let adminSent = false;
  let customerMessageId: string | undefined;
  let adminMessageId: string | undefined;

  const customerEmail = input.customerEmail?.trim() || null;

  if (!alreadySent) {
    const welcome = composeWelcomeEmail({
      businessName: site.businessName,
      slug: site.slug,
    });

    if (customerEmail) {
      try {
        const result = await sendPostmarkEmail({
          intendedTo: customerEmail,
          subject: welcome.subject,
          textBody: welcome.textBody,
          tag: "demo-site-welcome",
        });
        customerSent = true;
        customerMessageId = result.messageId;
      } catch (err) {
        const msg =
          err instanceof PostmarkSendError
            ? `${err.postmarkMessage} (code ${err.errorCode ?? "?"})`
            : err instanceof Error
              ? err.message
              : "Customer welcome email failed";
        console.error("Claim welcome email failed:", err);
        warnings.push(msg);
      }
    } else {
      warnings.push("No customer email — skipped welcome email");
    }

    if (customerSent) {
      await ref.set(
        {
          welcomeEmailSentAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
  }

  const admin = composeClaimAdminNotificationEmail({
    businessName: site.businessName,
    slug: site.slug,
    claimType: input.claimType,
    customerEmail,
    priceUsd:
      input.claimType === "paid" ? getEffectivePriceUsd(site) : null,
  });

  try {
    const result = await sendPostmarkEmail({
      adminNotification: true,
      intendedTo: customerEmail,
      subject: admin.subject,
      textBody: admin.textBody,
      tag: "demo-site-claim-admin",
    });
    adminSent = true;
    adminMessageId = result.messageId;
  } catch (err) {
    const msg =
      err instanceof PostmarkSendError
        ? `${err.postmarkMessage} (code ${err.errorCode ?? "?"})`
        : err instanceof Error
          ? err.message
          : "Admin claim notification failed";
    console.error("Claim admin notification failed:", err);
    warnings.push(msg);
  }

  return {
    customerSent,
    adminSent,
    customerMessageId,
    adminMessageId,
    warnings,
  };
}

/** @deprecated Use sendClaimCompletedEmails */
export async function sendWelcomeEmailForClaim(input: {
  siteId: string;
  customerEmail?: string | null;
}): Promise<void> {
  await sendClaimCompletedEmails({
    siteId: input.siteId,
    customerEmail: input.customerEmail,
    claimType: "paid",
  });
}
