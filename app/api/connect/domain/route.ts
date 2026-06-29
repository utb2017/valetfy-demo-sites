import { NextResponse } from "next/server";

import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { getDemoSiteBySlug } from "@/lib/getDemoSite";
import {
  setDemoSiteCustomDomain,
} from "@/lib/demoSiteSubscription";
import { subscriptionIsActive } from "@/lib/subscriptionUtils";
import { attachCustomDomainToVercel } from "@/lib/vercelDomains";

export const runtime = "nodejs";

function normalizeDomain(input: string): string | null {
  const clean = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
  if (!clean || !clean.includes(".")) return null;
  return clean;
}

export async function POST(request: Request) {
  const user = await verifyBearerToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { siteId?: string; domain?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const siteId = body.siteId?.trim();
  const domain = body.domain ? normalizeDomain(body.domain) : null;
  if (!siteId || !domain) {
    return NextResponse.json(
      { error: "Missing siteId or valid domain" },
      { status: 400 }
    );
  }

  const site = await getDemoSiteBySlug(siteId);
  if (
    !site ||
    site.ownerUid !== user.uid ||
    !site.dnsRevealUnlocked ||
    !subscriptionIsActive(site.subscriptionStatus ?? null)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const attach = await attachCustomDomainToVercel(domain);
  await setDemoSiteCustomDomain(siteId, domain);

  return NextResponse.json({
    domain,
    vercel: attach,
    message: attach.ok
      ? "Domain attached to Vercel. Add the DNS records shown on the connect page."
      : "Domain saved. Vercel attach pending — add DNS records below.",
  });
}
