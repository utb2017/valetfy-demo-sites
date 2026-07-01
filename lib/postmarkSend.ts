import {
  getEmailEnv,
  getPostmarkSenderEmail,
  resolveOutboundRecipient,
  withDevSubjectPrefix,
} from "@/lib/emailRouting";

export type PostmarkSendInput = {
  /** Real-world recipient when real sends are enabled. */
  intendedTo?: string | null;
  /** Bypass dev routing — always deliver to test/admin inbox. */
  adminNotification?: boolean;
  subject: string;
  textBody: string;
  htmlBody?: string;
  tag?: string;
};

export type PostmarkSendResult = {
  messageId: string;
  to: string;
  from: string;
  devRouted: boolean;
  intendedTo: string | null;
};

export class PostmarkSendError extends Error {
  readonly status: number;
  readonly errorCode: number | null;
  readonly postmarkMessage: string;

  constructor(input: {
    message: string;
    status: number;
    errorCode?: number | null;
    postmarkMessage?: string;
  }) {
    super(input.message);
    this.name = "PostmarkSendError";
    this.status = input.status;
    this.errorCode = input.errorCode ?? null;
    this.postmarkMessage = input.postmarkMessage ?? input.message;
  }
}

export async function sendPostmarkEmail(
  input: PostmarkSendInput
): Promise<PostmarkSendResult> {
  const { token, testRecipient } = getEmailEnv();
  const from = getPostmarkSenderEmail();

  const routing = input.adminNotification
    ? {
        to: testRecipient,
        devRouted: false,
        intendedTo: input.intendedTo?.trim() || null,
      }
    : resolveOutboundRecipient(input.intendedTo);

  const { to, devRouted, intendedTo } = routing;
  const subject = withDevSubjectPrefix(input.subject, devRouted);

  let textBody = input.textBody;
  if (devRouted && intendedTo) {
    textBody = `[Dev routing — intended recipient: ${intendedTo}]\n\n${textBody}`;
  } else if (input.adminNotification && intendedTo) {
    textBody = `[Customer: ${intendedTo}]\n\n${textBody}`;
  }

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
    const postmarkMessage = data.Message ?? `Postmark send failed (${res.status})`;
    throw new PostmarkSendError({
      message: postmarkMessage,
      status: res.status,
      errorCode: data.ErrorCode ?? null,
      postmarkMessage,
    });
  }

  return {
    messageId: data.MessageID ?? "",
    to,
    from,
    devRouted,
    intendedTo,
  };
}
