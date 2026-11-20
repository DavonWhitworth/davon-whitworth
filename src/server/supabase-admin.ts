import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/server/env";

// Supabase client with the secret key. It bypasses row level security, so it
// is only for server code that has ALREADY decided the caller may do this
// (see getCaller in ./caller.ts). Never import it into browser code; the
// "server-only" import above makes that fail the build.
//
// Returns null when the URL or secret key is not set, so routes can answer
// "not available" instead of crashing.
let admin: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = getServerEnv().SUPABASE_SECRET_KEY;

  admin =
    url && secretKey
      ? createClient(url, secretKey, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        })
      : null;
  return admin;
}
