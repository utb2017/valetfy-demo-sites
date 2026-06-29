/**
 * Server-only: idempotent create-or-patch for accounts/{uid} guest baseline.
 * Ported from valetfy main app (trimmed — no admin-broadcast / PostHog here).
 */
import type { Firestore } from "firebase-admin/firestore";

import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";

const serverTs = () => FieldValue.serverTimestamp();

function isApplicationIntentMissing(raw: unknown): boolean {
  if (raw === undefined || raw === null) return true;
  if (typeof raw === "string" && raw.trim() === "") return true;
  return false;
}

function isApplicationStatusMissing(raw: unknown): boolean {
  return raw === undefined || raw === null;
}

export const ACCOUNT_ENSURE_BASELINE_SOURCES = [
  "self-signin",
  "self-signin-ticket",
  "self-signup",
  "self-signin-ticket-legacy",
  "demo-test-login",
] as const;

export type AccountEnsureBaselineSource =
  (typeof ACCOUNT_ENSURE_BASELINE_SOURCES)[number];

export function parseAccountEnsureBaselineSource(
  raw: unknown
): AccountEnsureBaselineSource | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  return (ACCOUNT_ENSURE_BASELINE_SOURCES as readonly string[]).includes(s)
    ? (s as AccountEnsureBaselineSource)
    : null;
}

export async function ensureAccountBaselineForUid(args: {
  uid: string;
  phoneE164: string | null;
  source: AccountEnsureBaselineSource;
  db?: Firestore;
}): Promise<{ created: boolean }> {
  const { uid, phoneE164, source } = args;
  const db = args.db ?? getAdminDb();
  const ref = db.collection("accounts").doc(uid);
  const snap = await ref.get();

  if (snap.exists) {
    const d = snap.data() as Record<string, unknown> | undefined;
    const patch: Record<string, unknown> = {
      lastLoginAt: serverTs(),
      lastLoginMethod: "phone",
      updatedAt: serverTs(),
    };

    const existingPhone =
      typeof d?.phoneE164 === "string" && d.phoneE164.trim()
        ? d.phoneE164.trim()
        : "";
    if (!existingPhone && phoneE164) {
      patch.phoneE164 = phoneE164;
    }

    const ph = existingPhone || phoneE164 || "";
    if (d && d.smsNotificationsEnabled === undefined && ph) {
      patch.smsNotificationsEnabled = true;
    }
    if (d && d.emailNotificationsEnabled === undefined) {
      patch.emailNotificationsEnabled = false;
    }
    if (
      d &&
      (d.source === undefined || d.source === null || d.source === "") &&
      source
    ) {
      patch.source = source;
    }
    if (d && isApplicationIntentMissing(d.applicationIntent)) {
      patch.applicationIntent = "staff";
    }
    if (d && isApplicationStatusMissing(d.applicationStatus)) {
      patch.applicationStatus = "drafting";
    }

    await ref.set(patch, { merge: true });
    return { created: false };
  }

  await ref.set(
    {
      uid,
      phoneE164,
      land: "guest",
      staff: false,
      role: { guest: true },
      roleList: ["guest"],
      smsNotificationsEnabled: !!phoneE164,
      emailNotificationsEnabled: false,
      createdAt: serverTs(),
      updatedAt: serverTs(),
      lastLoginAt: serverTs(),
      lastLoginMethod: "phone",
      source,
      applicationIntent: "staff",
      applicationStatus: "drafting",
    },
    { merge: true }
  );
  return { created: true };
}
