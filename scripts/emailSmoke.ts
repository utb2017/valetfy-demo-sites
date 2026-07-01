/**
 * Smoke: verify env + send test email through Postmark.
 * Usage: tsx --env-file=.env.production.local scripts/emailSmoke.ts
 */
import { getEmailEnv } from "../lib/emailRouting";
import { sendPostmarkEmail } from "../lib/postmarkSend";

async function main() {
  const env = getEmailEnv();
  console.log(
    JSON.stringify(
      {
        sender: env.sender,
        testRecipient: env.testRecipient,
        realRecipientsEnabled: env.realRecipientsEnabled,
        tokenConfigured: Boolean(env.token),
      },
      null,
      2
    )
  );

  const result = await sendPostmarkEmail({
    intendedTo: env.testRecipient,
    subject: "Valetfy demo-sites — smoke test",
    textBody: "Postmark smoke test from scripts/emailSmoke.ts",
    tag: "demo-site-smoke",
  });

  console.log(
    JSON.stringify({ ok: true, messageId: result.messageId, to: result.to }, null, 2)
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
