import { NextRequest, NextResponse } from "next/server";

import { resolveTenantAsset, tenantAssetUrl } from "@/lib/standaloneTenantAssets";

export function GET(request: NextRequest) {
  const manifest = resolveTenantAsset(request, "manifest");
  if (!manifest) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(tenantAssetUrl(request, manifest), 308);
}
