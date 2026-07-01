/**
 * Smoke: verify Postmark sender signatures and send a test message.
 * Usage: tsx --env-file=.env.production.local scripts/verifyPostmarkSender.ts
 */
const CANDIDATES = [
  process.env.DEMO_SITES_EMAIL_SENDER?.trim(),
  "bear@valetfy.com",
  "hello@valetfy.com",
  "support@valetfy.com",
].filter(Boolean) as string[];

async function trySend(from: string, token: string, to: string) {
  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: `[sender-verify] ${from}`,
      TextBody: `Postmark sender verification probe from ${from}`,
      MessageStream: "outbound",
      Tag: "sender-verify",
    }),
  });

  const data = (await res.json()) as {
    MessageID?: string;
    Message?: string;
    ErrorCode?: number;
  };

  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const token = process.env.POSTMARK_SERVER_TOKEN?.trim();
  const to =
    process.env.DEMO_SITES_EMAIL_TEST_RECIPIENT?.trim() || "bear@valetfy.com";

  if (!token) {
    console.error("POSTMARK_SERVER_TOKEN missing");
    process.exit(1);
  }

  const tried = new Set<string>();
  for (const from of CANDIDATES) {
    if (tried.has(from)) continue;
    tried.add(from);

    const result = await trySend(from, token, to);
    console.log(
      JSON.stringify(
        {
          from,
          to,
          ok: result.ok,
          status: result.status,
          messageId: result.data.MessageID ?? null,
          errorCode: result.data.ErrorCode ?? null,
          message: result.data.Message ?? null,
        },
        null,
        2
      )
    );

    if (result.ok) {
      console.log(`\n✓ Verified sender: ${from}`);
      process.exit(0);
    }
  }

  console.error("\n✗ No candidate sender succeeded");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
