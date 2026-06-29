import { NextResponse } from "next/server";

import type { DemoSiteStatEvent } from "@/lib/demoSiteStats";
import { DEMO_SITE_STAT_EVENTS } from "@/lib/demoSiteStats";
import { incrementDemoSiteStat } from "@/lib/incrementDemoSiteStat";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { siteId?: string; event?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const siteId = body.siteId?.trim();
  const event = body.event?.trim() as DemoSiteStatEvent | undefined;

  if (!siteId || !event || !DEMO_SITE_STAT_EVENTS.includes(event)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await incrementDemoSiteStat(siteId, event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Track failed" }, { status: 500 });
  }
}
