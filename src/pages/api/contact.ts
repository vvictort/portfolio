import type { APIRoute } from "astro";
import { resolveRateLimitKey, takeContactRateLimitSlot } from "../../lib/contactRateLimit";

const CONTACT_EMAIL = "vvictort20@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorFields = {
  name?: string;
  email?: string;
  message?: string;
};

function json(
  payload: {
    message: string;
    fieldErrors?: ErrorFields;
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const resendFromEmail = import.meta.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  if (!resendApiKey) {
    return json({ message: "Email delivery is not configured on the server." }, 500);
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

  const finalSubject = subject || `New portfolio message from ${name}`;
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSubject = escapeHtml(finalSubject);
  const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [CONTACT_EMAIL],
      reply_to: email,
      subject: `Portfolio contact: ${finalSubject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${finalSubject}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">New portfolio contact form submission</h2>
          <p><strong>Name:</strong> ${escapedName}</p>
          <p><strong>Email:</strong> ${escapedEmail}</p>
          <p><strong>Subject:</strong> ${escapedSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${escapedMessage}</p>
        </div>
      `,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("Resend error:", errorText);
    return json({ message: "Unable to send your message right now. Please try again shortly." }, 502);
  }

  return json({ message: "Transmission sent successfully." }, 200);
};
