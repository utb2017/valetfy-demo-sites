const DEFAULT_TEST_RECIPIENT = "bear@valetfy.com";

export function realRecipientsEnabled(): boolean {
  const v =
    process.env.DEMO_SITES_EMAIL_ENABLE_REAL_RECIPIENTS?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function getTestEmailRecipient(): string {
  const v = process.env.DEMO_SITES_EMAIL_TEST_RECIPIENT?.trim();
  if (!v) {
    throw new Error("DEMO_SITES_EMAIL_TEST_RECIPIENT is not configured");
  }
  return v;
}

export function getPostmarkSenderEmail(): string {
  const v = process.env.DEMO_SITES_EMAIL_SENDER?.trim();
  if (!v) {
    throw new Error("DEMO_SITES_EMAIL_SENDER is not configured");
  }
  return v;
}

export function getPostmarkServerToken(): string {
  const v = process.env.POSTMARK_SERVER_TOKEN?.trim();
  if (!v) {
    throw new Error("POSTMARK_SERVER_TOKEN is not configured");
  }
  return v;
}

export type EmailEnv = {
  token: string;
  sender: string;
  testRecipient: string;
  realRecipientsEnabled: boolean;
};

export function getEmailEnv(): EmailEnv {
  return {
    token: getPostmarkServerToken(),
    sender: getPostmarkSenderEmail(),
    testRecipient: getTestEmailRecipient(),
    realRecipientsEnabled: realRecipientsEnabled(),
  };
}

/**
 * Dev safety: unless DEMO_SITES_EMAIL_ENABLE_REAL_RECIPIENTS is set,
 * customer mail goes to the test inbox.
 */
export function resolveOutboundRecipient(intendedTo?: string | null): {
  to: string;
  devRouted: boolean;
  intendedTo: string | null;
} {
  const intended = intendedTo?.trim() || null;
  if (realRecipientsEnabled() && intended) {
    return { to: intended, devRouted: false, intendedTo: intended };
  }
  return {
    to: getTestEmailRecipient(),
    devRouted: true,
    intendedTo: intended,
  };
}

export function withDevSubjectPrefix(
  subject: string,
  devRouted: boolean
): string {
  if (!devRouted) return subject;
  return subject.startsWith("[DEV]") ? subject : `[DEV] ${subject}`;
}
