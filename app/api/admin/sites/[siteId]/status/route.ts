import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import type { DemoSiteStatus } from "@/lib/demoSiteTypes";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { updateDemoSiteStatusAdmin } from "@/lib/listDemoSitesAdmin";

export const runtime = "nodejs";

const STATUSES: DemoSiteStatus[] = [
  "draft",
  "demo",
  "live",
  "sold",
  "archived",
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ siteId: string }> }
) {
  const user = await verifyBearerToken(request);
  if (!user || !isAdminUid(user.uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { siteId } = await context.params;
  let body: { status?: DemoSiteStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await updateDemoSiteStatusAdmin(siteId, body.status);
  return NextResponse.json({ ok: true, siteId, status: body.status });
}
