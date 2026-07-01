import { NextRequest, NextResponse } from "next/server";

import { resolveTenantAsset, tenantAssetUrl } from "@/lib/standaloneTenantAssets";

export function GET(request: NextRequest) {
  const icon = resolveTenantAsset(request, "appleTouchIcon");
  if (!icon) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(tenantAssetUrl(request, icon), 308);
}
