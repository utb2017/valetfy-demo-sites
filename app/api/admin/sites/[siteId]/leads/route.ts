import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { listRecentLeadsForSite } from "@/lib/leadsStore";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ siteId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const user = await verifyBearerToken(request);
  if (!user || !isAdminUid(user.uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { siteId } = await context.params;
  const leads = await listRecentLeadsForSite(siteId, 10);

  return NextResponse.json({ leads });
}
