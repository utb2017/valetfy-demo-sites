import {
  getPostmarkSenderEmail,
  resolveOutboundRecipient,
  withDevSubjectPrefix,
} from "@/lib/emailRouting";

export type PostmarkSendInput = {
  /** Real-world recipient when real sends are enabled. */
  intendedTo?: string | null;
  subject: string;
  textBody: string;
  htmlBody?: string;
  tag?: string;
};

export type PostmarkSendResult = {
  messageId: string;
  to: string;
  devRouted: boolean;
  intendedTo: string | null;
};

export async function sendPostmarkEmail(
  input: PostmarkSendInput
): Promise<PostmarkSendResult> {
  const token = process.env.POSTMARK_SERVER_TOKEN?.trim();
  if (!token) {
    throw new Error("POSTMARK_SERVER_TOKEN is not configured");
  }

  const { to, devRouted, intendedTo } = resolveOutboundRecipient(
    input.intendedTo
  );
  const subject = withDevSubjectPrefix(input.subject, devRouted);

  let textBody = input.textBody;
  if (devRouted && intendedTo) {
    textBody = `[Dev routing — intended recipient: ${intendedTo}]\n\n${textBody}`;
  }

  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: getPostmarkSenderEmail(),
      To: to,
      Subject: subject,
      TextBody: textBody,
      HtmlBody: input.htmlBody,
      MessageStream: "outbound",
      Tag: input.tag,
    }),
  });

  const data = (await res.json()) as {
    MessageID?: string;
    Message?: string;
    ErrorCode?: number;
  };

  if (!res.ok) {
    throw new Error(data.Message ?? `Postmark send failed (${res.status})`);
  }

  return {
    messageId: data.MessageID ?? "",
    to,
    devRouted,
    intendedTo,
  };
}
