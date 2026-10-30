import "server-only";

import { getServerEnv } from "./env";

// Verifies a Cloudflare Turnstile token. When TURNSTILE_SECRET_KEY is not set
// the check is skipped (the honeypot and rate limit still apply).
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = getServerEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
