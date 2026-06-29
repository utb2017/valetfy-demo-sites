"use client";

import { useEffect } from "react";

import type { DemoSiteStatEvent } from "@/lib/demoSiteStats";

export function trackDemoSiteEvent(siteId: string, event: DemoSiteStatEvent) {
  if (!siteId) return;
  try {
    const body = JSON.stringify({ siteId, event });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* ignore analytics failures */
  }
}

export function PageViewTracker({ siteId }: { siteId: string }) {
  useEffect(() => {
    trackDemoSiteEvent(siteId, "views");
  }, [siteId]);
  return null;
}
