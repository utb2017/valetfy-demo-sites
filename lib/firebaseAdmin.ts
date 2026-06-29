import * as admin from "firebase-admin";

function safeStr(v: unknown): string {
  const raw =
    typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}

function decodeBase64(b64: string): string {
  const s = safeStr(b64);
  if (!s) return "";
  try {
    return Buffer.from(s, "base64").toString("utf8");
  } catch {
    return "";
  }
}

function getProjectId(): string {
  return (
    safeStr(process.env.FIREBASE_ADMIN_PROJECT_ID) ||
    safeStr(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ||
    ""
  );
}

function ensureApp(): admin.app.App {
  const existing = admin.apps[0];
  if (existing) return existing;

  const projectId = getProjectId();
  const clientEmail = safeStr(process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  const privateKeyRaw =
    decodeBase64(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64 || "") ||
    safeStr(process.env.FIREBASE_ADMIN_PRIVATE_KEY).replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKeyRaw) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKeyRaw,
      }),
      projectId,
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId || undefined,
  });
}

export function getAdminDb(): FirebaseFirestore.Firestore {
  const app = ensureApp();
  const db = admin.firestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

export const FieldValue = admin.firestore.FieldValue;

export function assertDevFirebaseProject(): string {
  const projectId = getProjectId();
  if (projectId !== "valetfy-main-dev") {
    throw new Error(
      `Refusing demo-sites operation: Firebase project is "${projectId || "<unset>"}", expected "valetfy-main-dev".`
    );
  }
  return projectId;
}
