import type { APIRoute } from "astro";
import {
  releaseContactRateLimitSlot,
  resolveRateLimitKey,
  takeContactRateLimitSlot,
} from "../../lib/contactRateLimit";

const CONTACT_EMAIL = "vvictort20@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_FROM_EMAIL_PATTERN = /^(?:[^<>\r\n]+<[^<>\s@]+@[^\s@]+\.[^\s@]+>|[^<>\s@]+@[^\s@]+\.[^\s@]+)$/;
const RESEND_TIMEOUT_MS = 8000;
const INBOX_SUBJECT_PREFIX = "[ACTION REQUIRED]";

function deliveryUnavailableMessage() {
  return `I can't receive contact form messages right now. Please email me directly at ${CONTACT_EMAIL}.`;
}

function deliveryRateLimitedMessage() {
  return `The contact form is busy right now. Please try again shortly, or email me directly at ${CONTACT_EMAIL}.`;
}

type ErrorFields = {
  name?: string;
  email?: string;
  message?: string;
};

function json(
  payload: {
    message: string;
    fieldErrors?: ErrorFields;
    code?: string;
    fallbackEmail?: string;
  },
  status: number,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function sanitize(input: unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}

function normalizeEnvValue(value: string | undefined) {
  const trimmedValue = value?.trim() || "";

  if (!trimmedValue) return "";

  const hasWrappedDoubleQuotes = trimmedValue.startsWith('"') && trimmedValue.endsWith('"');
  const hasWrappedSingleQuotes = trimmedValue.startsWith("'") && trimmedValue.endsWith("'");

  if (hasWrappedDoubleQuotes || hasWrappedSingleQuotes) {
    return trimmedValue.slice(1, -1).trim();
  }

  return trimmedValue;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function gatewayFailure(message: string, status: number, code = "gateway_unavailable") {
  return json(
    {
      message,
      code,
      fallbackEmail: CONTACT_EMAIL,
    },
    status,
  );
}

async function releaseReservedSlot(key: string, reservedAt: number | undefined) {
  if (typeof reservedAt !== "number") return;

  try {
    await releaseContactRateLimitSlot(key, reservedAt);
  } catch (error) {
    console.error("Failed to release contact rate limit slot:", error);
  }
}

type ContactNotificationPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function buildInboxSubject(subject: string) {
  return `${INBOX_SUBJECT_PREFIX} Portfolio Contact | ${subject}`;
}

function buildReplyHref(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
}

function buildContactEmailText({ name, email, subject, message }: ContactNotificationPayload) {
  const inboxSubject = buildInboxSubject(subject);

  return [
    inboxSubject,
    "",
    "CONTROL TOWER // PRIORITY INBOUND",
    "A new message landed through the portfolio contact form.",
    "",
    `Sender: ${name}`,
    `Reply-To: ${email}`,
    `Message Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

function buildContactEmailHtml({ name, email, subject, message }: ContactNotificationPayload) {
  const inboxSubject = buildInboxSubject(subject);
  const replyHref = buildReplyHref(email, subject);
  const escapedInboxSubject = escapeHtml(inboxSubject);
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSubject = escapeHtml(subject);
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin: 0; padding: 0; background-color: #050505; color: #e4e4e7; font-family: Inter, Arial, sans-serif;">
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
          New inbound portfolio message from ${escapedName}. ${escapedSubject}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505;">
          <tr>
            <td align="center" style="padding: 24px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 24px; overflow: hidden;">
                <tr>
                  <td style="height: 6px; background-color: #facc15; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 32px 32px 18px;">
                    <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #facc15; margin-bottom: 18px;">
                      Control Tower // Priority Inbound
                    </div>
                    <div style="font-size: 32px; line-height: 1.1; font-weight: 700; color: #ffffff; margin-bottom: 12px;">
                      New Transmission Received
                    </div>
                    <div style="font-size: 15px; line-height: 1.7; color: #a1a1aa;">
                      A new message landed through the portfolio contact form and is ready for follow-up.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #facc15; border-radius: 18px;">
                      <tr>
                        <td style="padding: 18px 20px;">
                          <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #000000; opacity: 0.7; margin-bottom: 10px;">
                            Inbox Subject
                          </div>
                          <div style="font-size: 18px; line-height: 1.45; font-weight: 700; color: #000000;">
                            ${escapedInboxSubject}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #111111; border: 1px solid #27272a; border-radius: 18px;">
                      <tr>
                        <td style="padding: 18px 20px; border-bottom: 1px solid #27272a;">
                          <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #facc15; margin-bottom: 8px;">
                            Sender
                          </div>
                          <div style="font-size: 17px; line-height: 1.5; font-weight: 600; color: #ffffff;">
                            ${escapedName}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 18px 20px; border-bottom: 1px solid #27272a;">
                          <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #facc15; margin-bottom: 8px;">
                            Reply-To
                          </div>
                          <a href="mailto:${escapedEmail}" style="font-size: 16px; line-height: 1.5; color: #facc15; text-decoration: none;">
                            ${escapedEmail}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 18px 20px;">
                          <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #facc15; margin-bottom: 8px;">
                            Message Subject
                          </div>
                          <div style="font-size: 16px; line-height: 1.6; color: #ffffff;">
                            ${escapedSubject}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 16px;">
                    <div style="font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: #facc15; margin-bottom: 10px;">
                      Message
                    </div>
                    <div style="background-color: #111111; border: 1px solid #27272a; border-radius: 18px; padding: 20px; font-size: 16px; line-height: 1.8; color: #e4e4e7;">
                      ${escapedMessage}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #facc15; border-radius: 999px;">
                          <a href="${replyHref}" style="display: inline-block; padding: 14px 20px; font-family: 'Share Tech Mono', 'Courier New', monospace; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; color: #000000;">
                            Reply To Sender
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top: 14px; font-size: 13px; line-height: 1.6; color: #71717a;">
                      Replying from your email client will route directly to the sender.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const resendFromEmail = normalizeEnvValue(import.meta.env.RESEND_FROM_EMAIL);

    if (!resendApiKey || !resendFromEmail) {
      return gatewayFailure(deliveryUnavailableMessage(), 503, "gateway_misconfigured");
    }

    if (!RESEND_FROM_EMAIL_PATTERN.test(resendFromEmail)) {
      console.error("Invalid RESEND_FROM_EMAIL value:", resendFromEmail);
      return gatewayFailure(deliveryUnavailableMessage(), 503, "gateway_misconfigured");
    }

    let payload: {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
    };

    try {
      payload = await request.json();
    } catch {
      return json({ message: "Invalid request body." }, 400);
    }

    const name = sanitize(payload.name, 120);
    const email = sanitize(payload.email, 320);
    const subject = sanitize(payload.subject, 160);
    const message = sanitize(payload.message, 5000);

    const fieldErrors: ErrorFields = {};

    if (!name) fieldErrors.name = "Your name is required.";
    if (!email) fieldErrors.email = "Your email is required.";
    if (!message) fieldErrors.message = "A message is required.";

    if (Object.keys(fieldErrors).length > 0) {
      return json(
        {
          message: "Please fill in the required fields.",
          fieldErrors,
        },
        400,
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return json(
        {
          message: "Please enter a valid email address.",
          fieldErrors: {
            email: "Please enter a valid email address.",
          },
        },
        400,
      );
    }

    const rateLimitKey = resolveRateLimitKey(clientAddress, request, email);
    const rateLimitResult = await takeContactRateLimitSlot(rateLimitKey);

    if (!rateLimitResult.allowed) {
      return json(
        {
          message: "Daily message limit reached. Please try again tomorrow.",
        },
        429,
        {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      );
    }

    const reservedAt = rateLimitResult.reservedAt;
    const finalSubject = subject || `New inquiry from ${name}`;
    const notificationPayload = {
      name,
      email,
      subject: finalSubject,
      message,
    };

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), RESEND_TIMEOUT_MS);

    let resendResponse: Response;

    try {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({
          from: resendFromEmail,
          to: [CONTACT_EMAIL],
          reply_to: email,
          subject: buildInboxSubject(finalSubject),
          text: buildContactEmailText(notificationPayload),
          html: buildContactEmailHtml(notificationPayload),
        }),
      });
    } catch (error) {
      await releaseReservedSlot(rateLimitKey, reservedAt);

      const isTimeout = error instanceof DOMException && error.name === "AbortError";
      console.error("Resend request failed:", error);

      if (isTimeout) {
        return gatewayFailure(deliveryUnavailableMessage(), 504, "gateway_timeout");
      }

      return gatewayFailure(deliveryUnavailableMessage(), 502);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!resendResponse.ok) {
      await releaseReservedSlot(rateLimitKey, reservedAt);

      const errorText = await resendResponse.text().catch(() => "");
      console.error("Resend error:", resendResponse.status, errorText);

      if (resendResponse.status === 401 || resendResponse.status === 403 || resendResponse.status === 422) {
        return gatewayFailure(deliveryUnavailableMessage(), 503, "gateway_misconfigured");
      }

      if (resendResponse.status === 429) {
        return gatewayFailure(deliveryRateLimitedMessage(), 503, "gateway_rate_limited");
      }

      return gatewayFailure(deliveryUnavailableMessage(), 502);
    }

    return json({ message: "Transmission sent successfully." }, 200);
  } catch (error) {
    console.error("Unexpected contact API error:", error);
    return gatewayFailure(deliveryUnavailableMessage(), 502, "gateway_unexpected");
  }
};
