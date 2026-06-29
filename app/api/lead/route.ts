import { NextResponse } from "next/server";

import { composeLeadNotificationEmail } from "@/lib/emails/leadNotificationEmail";
import { realRecipientsEnabled } from "@/lib/emailRouting";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import { createDemoSiteLead } from "@/lib/leadsStore";
import { sendPostmarkEmail } from "@/lib/postmarkSend";
import { subscriptionIsActive } from "@/lib/subscriptionUtils";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeStr(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: {
    siteId?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const siteId = safeStr(body.siteId, 64);
  const name = safeStr(body.name, 120);
  const email = safeStr(body.email, 254);
  const phone = safeStr(body.phone, 40);
  const message = safeStr(body.message, 4000);

  if (!siteId || !name || !email || !message) {
    return NextResponse.json(
      { error: "siteId, name, email, and message are required" },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const site = await getDemoSiteBySlug(siteId);
  if (!site || site.status === "archived") {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  try {
    const { leadId, lead } = await createDemoSiteLead(siteId, {
      name,
      email,
      phone: phone || undefined,
      message,
    });

    const claimed = subscriptionIsActive(site.subscriptionStatus ?? null);
    const ownerEmail = site.owner?.email?.includes("@")
      ? site.owner.email
      : null;
    const intendedNotify =
      realRecipientsEnabled() && claimed && ownerEmail ? ownerEmail : null;

    const { subject, textBody } = composeLeadNotificationEmail({
      businessName: site.businessName,
      slug: site.slug,
      lead: { ...lead, sourceSiteId: siteId },
    });

    try {
      await sendPostmarkEmail({
        intendedTo: intendedNotify,
        subject,
        textBody,
        tag: "demo-site-lead",
      });
    } catch (mailErr) {
      console.error("Lead notify email failed:", mailErr);
    }

    return NextResponse.json({ ok: true, leadId });
  } catch (err) {
    console.error("Lead capture failed:", err);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
