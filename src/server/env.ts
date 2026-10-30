import "server-only";

import { z } from "zod";

// Treat empty strings (as in .env.example) the same as "not set".
const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalEmail = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().email().optional(),
);

const schema = z.object({
  RESEND_API_KEY: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
});

export type ServerEnv = z.infer<typeof schema>;

// Read lazily so the build does not fail when variables are not set yet.
export function getServerEnv(): ServerEnv {
  return schema.parse(process.env);
}
