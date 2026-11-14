// Scheduled function: sends one short email through the Brevo API on the 1st of
// every month (14:17 UTC).
//
// Why: a Brevo API key that is not used for 90 days expires, and the contact
// form would then stop working without any warning. This counts as use. It also
// checks that sending still works: if these emails stop arriving, look at the
// function logs in Netlify (Functions > brevo-keepalive) and at Brevo's
// transactional logs.
//
// Cron cannot express "every 80 days", so this runs monthly instead, which
// leaves a much bigger safety margin. Netlify only runs scheduled functions on
// the published (production) deploy, and they cannot be called from a URL.
//
// This file stays self-contained on purpose: src/server/email.ts imports
// "server-only", which cannot be bundled into a Netlify function.

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const handler = async (): Promise<Response> => {
  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[keepalive] BREVO_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set in Netlify.",
    );
    return new Response("not configured", { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Portfolio contact form", email: from },
        to: [{ email: to }],
        subject: "Portfolio: monthly email check",
        textContent: `Automatic monthly check from davon-whitworth.com (${today}).\n\nIt keeps the Brevo API key active (keys expire after 90 days without use) and confirms that sending still works. You do not need to reply.`,
        htmlContent: `<p>Automatic monthly check from davon-whitworth.com (${today}).</p><p>It keeps the Brevo API key active (keys expire after 90 days without use) and confirms that sending still works. You do not need to reply.</p>`,
      }),
    });

    if (!response.ok) {
      console.error("[keepalive] Brevo returned status", response.status);
      return new Response("provider error", { status: 502 });
    }

    console.log("[keepalive] Sent the monthly check email.");
    return new Response("ok");
  } catch (error) {
    console.error("[keepalive] Failed to reach Brevo", error);
    return new Response("network error", { status: 502 });
  }
};

export default handler;

export const config = {
  // Cron, in UTC: minute hour day-of-month month day-of-week.
  schedule: "17 14 1 * *",
};
