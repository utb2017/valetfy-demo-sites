import type { DecodedIdToken } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";

import { getAdminDb } from "@/lib/firebaseAdmin";

type AuthSuccess = { ok: true; uid: string; decoded: DecodedIdToken };
type AuthFailure = { ok: false; error: string };
export type AuthResult = AuthSuccess | AuthFailure;

export async function requireUidFromBearer(
  req: Request
): Promise<AuthResult> {
  getAdminDb();

  const authz = (req.headers.get("authorization") ?? "").trim();
  const m = authz.match(/^Bearer\s+(.+)$/i);
  const token = m?.[1]?.trim() ?? "";
  if (!token) return { ok: false, error: "Missing bearer token." };

  try {
    const decoded = await getAuth().verifyIdToken(token);
    return { ok: true, uid: decoded.uid, decoded };
  } catch (e: unknown) {
    if (process.env.NODE_ENV !== "production") {
      const err = e as { code?: unknown; message?: unknown };
      console.warn("[auth] verifyIdToken failed", {
        code: typeof err.code === "string" ? err.code : undefined,
        message: typeof err.message === "string" ? err.message : undefined,
      });
    }
    return { ok: false, error: "Invalid auth token." };
  }
}
