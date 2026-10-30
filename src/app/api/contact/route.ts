import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/server/email";
import { clientIp, rateLimit } from "@/server/rate-limit";
import { verifyTurnstile } from "@/server/turnstile";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: must stay empty. Bots tend to fill every field.
  website: z.string().optional(),
  turnstileToken: z.string().optional(),
});

const ONE_HOUR_MS = 60 * 60 * 1000;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!rateLimit(`contact:${ip}`, 5, ONE_HOUR_MS)) {
    return fail("Too many messages. Please try again later.", 429);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return fail("Please check the form fields and try again.", 400);
  }

  const { name, email, message, website, turnstileToken } = parsed.data;

  // Pretend success so bots get no signal that they were caught.
  if (website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return fail("Spam check failed. Please reload the page and try again.", 400);
  }

  const result = await sendContactEmail({ name, email, message });
  if (!result.ok) {
    return fail(
      result.reason === "not_configured"
        ? "Contact form is not available right now."
        : "Could not send your message. Please try again later.",
      result.reason === "not_configured" ? 503 : 502,
    );
  }

  return NextResponse.json({ ok: true });
}
