import type { NextRequest } from "next/server";

import { resolveSlugFromHost } from "@/lib/resolveTenantFromHost";

type TenantAsset = {
  favicon: string;
  appleTouchIcon: string;
  manifest: string;
};

const TENANT_ASSETS: Record<string, TenantAsset> = {
  "lotus-pet-spa-mobile": {
    favicon: "/lotus-pet-spa-mobile/favicon.ico",
    appleTouchIcon: "/lotus-pet-spa-mobile/apple-touch-icon.png",
    manifest: "/lotus-pet-spa-mobile/site.webmanifest",
  },
};

function normalizeHost(hostHeader: string | null) {
  return hostHeader?.split(":")[0]?.trim().toLowerCase() || "";
}

function hostFromRequest(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  return (forwardedHost || request.headers.get("host") || "").trim();
}

export function tenantAssetUrl(request: NextRequest, pathname: string) {
  const requestUrl = new URL(request.url);
  const host = hostFromRequest(request) || requestUrl.host;
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol = forwardedProto || requestUrl.protocol.replace(":", "");

  return new URL(pathname, `${protocol}://${host}`);
}

function resolveStandaloneSlug(request: NextRequest) {
  const host = normalizeHost(hostFromRequest(request));
  if (host === "lotuspetspamobile.com" || host === "www.lotuspetspamobile.com") {
    return "lotus-pet-spa-mobile";
  }
  return resolveSlugFromHost(host);
}

export function resolveTenantAsset(
  request: NextRequest,
  asset: keyof TenantAsset
) {
  const slug = resolveStandaloneSlug(request);
  if (!slug) return null;
  return TENANT_ASSETS[slug]?.[asset] ?? null;
}
