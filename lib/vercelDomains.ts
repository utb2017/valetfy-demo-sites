function safeStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

type AttachResult =
  | { ok: true; domain: string; vercelResponse?: unknown }
  | { ok: false; error: string; todo?: string; detail?: unknown };

/**
 * Attach a custom domain to the valetfy-demo-sites Vercel project.
 * Requires VERCEL_TOKEN + VERCEL_PROJECT_ID (or reads .vercel/project.json locally).
 */
export async function attachCustomDomainToVercel(
  domain: string
): Promise<AttachResult> {
  const token = safeStr(process.env.VERCEL_TOKEN);
  const projectId =
    safeStr(process.env.VERCEL_PROJECT_ID) ||
    safeStr(process.env.VERCEL_PROJECT_NAME);

  if (!token || !projectId) {
    return {
      ok: false,
      error: "Vercel API not configured",
      todo:
        "Set VERCEL_TOKEN and VERCEL_PROJECT_ID on the server, then retry domain attach.",
    };
  }

  const clean = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toLowerCase();

  try {
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: clean }),
      }
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        typeof body?.error?.message === "string"
          ? body.error.message
          : `Vercel API ${res.status}`;
      return { ok: false, error: msg, detail: body };
    }

    return { ok: true, domain: clean, vercelResponse: body };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Vercel attach failed",
    };
  }
}
