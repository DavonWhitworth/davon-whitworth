import "server-only";

import { getServerEnv } from "./env";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "provider_error" };

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Visitor-supplied text goes into an HTML email, so it must be escaped.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sends the contact form message through the Brevo transactional email API.
export async function sendContactEmail({
  name,
  email,
  message,
}: ContactMessage): Promise<SendResult> {
  const env = getServerEnv();

  if (!env.BREVO_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] Email is not configured. Message received:", {
        name,
        email,
        message,
      });
      return { ok: true };
    }
    return { ok: false, reason: "not_configured" };
  }

  const safeName = name.replace(/[\r\n]+/g, " ");

  try {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // CONTACT_FROM_EMAIL must be a sender or domain verified in Brevo.
        sender: { name: "Portfolio contact form", email: env.CONTACT_FROM_EMAIL },
        to: [{ email: env.CONTACT_TO_EMAIL }],
        // Replying to the email goes to the visitor, not to the sender above.
        replyTo: { email, name: safeName },
        subject: `Portfolio contact from ${safeName}`,
        textContent: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
        // Brevo requires an HTML body when no template is used.
        htmlContent: `<p><strong>Name:</strong> ${escapeHtml(safeName)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space: pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Brevo returned status", response.status);
      return { ok: false, reason: "provider_error" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[contact] Failed to reach Brevo", error);
    return { ok: false, reason: "provider_error" };
  }
}
