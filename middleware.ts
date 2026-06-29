import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { resolveSlugFromHost } from "@/lib/resolveTenantFromHost";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const slug = resolveSlugFromHost(host);

  if (!slug) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-demo-site-slug", slug);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
