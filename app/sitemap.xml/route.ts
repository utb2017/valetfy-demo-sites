import { NextRequest, NextResponse } from "next/server";

const DEMO_SITE_PATHS = ["/t/lotus-pet-spa-mobile", "/t/woof-wash"];

function originFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  const host = (forwardedHost || request.headers.get("host") || url.host)
    .trim()
    .toLowerCase();
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0];
  const protocol = forwardedProto || url.protocol.replace(":", "") || "https";

  return {
    host,
    origin: `${protocol}://${host}`,
  };
}

function isTenantHost(host: string) {
  return host.includes(".dev.sites.valetfy.com");
}

function isLotusHost(host: string) {
  return (
    host.startsWith("lotus-pet-spa-mobile.") ||
    host.includes("lotuspetspamobile.com")
  );
}

export function GET(request: NextRequest) {
  const { host, origin } = originFromRequest(request);
  const now = new Date().toISOString();
  const urls =
    isTenantHost(host) || isLotusHost(host)
      ? [origin]
      : DEMO_SITE_PATHS.map((path) => `${origin}${path}`);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
