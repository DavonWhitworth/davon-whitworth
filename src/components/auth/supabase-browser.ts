import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Browser-side Supabase client, shared by everything that needs the signed-in
// user in the browser (sign-in button now, apps later). It only ever holds the
// public publishable key; permissions are enforced by the database and by the
// server routes, never by this client.
//
// Returns null when the two public variables are not set, so the rest of the
// site keeps working without sign-in configured.
let client: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (client !== undefined) return client;

  // These must be written out in full so Next.js can inline them at build time.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  client = url && key ? createBrowserClient(url, key) : null;
  return client;
}
