import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { resolveSlugFromHost } from "@/lib/resolveTenantFromHost";

const LOTUS_ROOT_ASSETS: Record<string, string> = {
  "/favicon.ico": "/lotus-pet-spa-mobile/favicon.ico",
  "/apple-touch-icon.png": "/lotus-pet-spa-mobile/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png":
    "/lotus-pet-spa-mobile/apple-touch-icon.png",
  "/site.webmanifest": "/lotus-pet-spa-mobile/site.webmanifest",
  "/manifest.webmanifest": "/lotus-pet-spa-mobile/site.webmanifest",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const slug = resolveSlugFromHost(host);

  if (!slug) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-demo-site-slug", slug);

  const lotusRootAsset =
    slug === "lotus-pet-spa-mobile"
      ? LOTUS_ROOT_ASSETS[request.nextUrl.pathname]
      : null;
  if (lotusRootAsset) {
    return NextResponse.rewrite(
      new URL(lotusRootAsset, request.url),
      { request: { headers: requestHeaders } }
    );
  }

  // Premium templates render through a dedicated route segment (with their own
  // isolated CSS) instead of the generic block renderer. Only rewrite the
  // tenant homepage ("/") — API routes, /connect, etc. must pass through so the
  // claim/subscribe flow keeps working on the same host.
  const CUSTOM_TEMPLATE_SLUGS = new Set([
    "woof-wash",
    "scott",
    "lotus-pet-spa-mobile",
  ]);
  if (CUSTOM_TEMPLATE_SLUGS.has(slug) && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL(`/t/${slug}`, request.url), {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
