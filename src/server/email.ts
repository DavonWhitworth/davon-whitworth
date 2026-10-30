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

// Sends the contact form message through the Resend REST API.
export async function sendContactEmail({
  name,
  email,
  message,
}: ContactMessage): Promise<SendResult> {
  const env = getServerEnv();

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
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
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio contact from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend returned status", response.status);
      return { ok: false, reason: "provider_error" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[contact] Failed to reach Resend", error);
    return { ok: false, reason: "provider_error" };
  }
}
