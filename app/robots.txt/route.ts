import { NextRequest, NextResponse } from "next/server";

function originFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost || request.headers.get("host") || url.host;
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0];
  const protocol = forwardedProto || url.protocol.replace(":", "") || "https";

  return `${protocol}://${host}`;
}

export function GET(request: NextRequest) {
  const origin = originFromRequest(request);
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin/",
    "Disallow: /connect",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
