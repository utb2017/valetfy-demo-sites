import { NextResponse } from "next/server";

import { isAdminUid } from "@/lib/adminAuth";
import { getEmailEnv } from "@/lib/emailRouting";
import { verifyBearerToken } from "@/lib/firebaseAuthServer";
import { PostmarkSendError, sendPostmarkEmail } from "@/lib/postmarkSend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const user = await verifyBearerToken(request);
  if (!user || !isAdminUid(user.uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { to?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = body.to?.trim();
  if (!to || !EMAIL_RE.test(to)) {
    return NextResponse.json(
      { error: 'Valid "to" email is required' },
      { status: 400 }
    );
  }

  let env;
  try {
    env = getEmailEnv();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email env missing" },
      { status: 500 }
    );
  }

  try {
    const result = await sendPostmarkEmail({
      intendedTo: to,
      subject: "Valetfy demo-sites — test email",
      textBody: [
        "This is a test email from valetfy-demo-sites.",
        "",
        `Sender: ${env.sender}`,
        `Real recipients enabled: ${env.realRecipientsEnabled ? "yes" : "no"}`,
        "",
        "— Valetfy",
      ].join("\n"),
      tag: "demo-site-test",
    });

    return NextResponse.json({
      ok: true,
      messageId: result.messageId,
      from: result.from,
      to: result.to,
      devRouted: result.devRouted,
      intendedTo: result.intendedTo,
    });
  } catch (err) {
    const payload: Record<string, unknown> = {
      error: err instanceof Error ? err.message : "Send failed",
    };
    if (err instanceof PostmarkSendError) {
      payload.postmarkMessage = err.postmarkMessage;
      payload.errorCode = err.errorCode;
      payload.status = err.status;
    }
    return NextResponse.json(payload, { status: 502 });
  }
}

export async function GET() {
  try {
    const env = getEmailEnv();
    return NextResponse.json({
      ok: true,
      sender: env.sender,
      testRecipient: env.testRecipient,
      realRecipientsEnabled: env.realRecipientsEnabled,
      tokenConfigured: Boolean(env.token),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Email env missing",
      },
      { status: 500 }
    );
  }
}
