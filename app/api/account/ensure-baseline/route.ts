import { NextResponse } from "next/server";

import {
  ensureAccountBaselineForUid,
  parseAccountEnsureBaselineSource,
} from "@/lib/ensureAccountBaselineAdmin";
import { assertDevFirebaseProject } from "@/lib/firebaseAdmin";
import { requireUidFromBearer } from "@/lib/requireUidFromBearer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    assertDevFirebaseProject();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        error: err instanceof Error ? err.message : "Firebase guard failed",
      },
      { status: 500 }
    );
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const sourceRaw =
    typeof body === "object" &&
    body !== null &&
    "source" in body &&
    (body as { source?: unknown }).source !== undefined
      ? (body as { source?: unknown }).source
      : undefined;

  const source = parseAccountEnsureBaselineSource(sourceRaw);
  if (!source) {
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        error: "Missing or invalid source",
      },
      { status: 400 }
    );
  }

  const auth = await requireUidFromBearer(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, code: "UNAUTH", error: auth.error },
      { status: 401 }
    );
  }

  const phoneRaw = auth.decoded.phone_number;
  const phoneE164 =
    typeof phoneRaw === "string" && phoneRaw.trim() ? phoneRaw.trim() : null;

  try {
    const { created } = await ensureAccountBaselineForUid({
      uid: auth.uid,
      phoneE164,
      source,
    });
    return NextResponse.json({ ok: true, created });
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "message" in e
        ? String((e as { message?: unknown }).message)
        : "Server error";
    console.error("[ensure-baseline]", e);
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", error: msg },
      { status: 500 }
    );
  }
}
