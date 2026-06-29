const DEFAULT_TEST_RECIPIENT = "bear@valetfy.com";

export function realRecipientsEnabled(): boolean {
  const v = process.env.DEMO_SITES_EMAIL_ENABLE_REAL_RECIPIENTS?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function getTestEmailRecipient(): string {
  return (
    process.env.DEMO_SITES_EMAIL_TEST_RECIPIENT?.trim() || DEFAULT_TEST_RECIPIENT
  );
}

export function getPostmarkSenderEmail(): string {
  return process.env.DEMO_SITES_EMAIL_SENDER?.trim() || "bear@valetfy.com";
}

/**
 * Dev safety: unless DEMO_SITES_EMAIL_ENABLE_REAL_RECIPIENTS is set,
 * all outbound mail goes to the test inbox.
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

export function withDevSubjectPrefix(subject: string, devRouted: boolean): string {
  if (!devRouted) return subject;
  return subject.startsWith("[DEV]") ? subject : `[DEV] ${subject}`;
}
