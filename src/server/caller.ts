import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/server/supabase";

// Who is making this request? Shared by every project with accounts.
//
// Reads the visitor's session cookies and asks Supabase to confirm them
// (getUser checks with the auth server, so banned or deleted users are
// rejected even if their cookie has not expired). Called from a route
// handler, this also refreshes the session cookies when they are about to
// expire, which is why the site needs no proxy (middleware) for sign-in.
export type Caller = {
  userId: string;
  isAdmin: boolean;
  isBlocked: boolean;
};

export async function getCaller(admin: SupabaseClient): Promise<Caller | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("is_admin, is_blocked")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  return {
    userId: data.user.id,
    isAdmin: profile?.is_admin === true,
    isBlocked: profile?.is_blocked === true,
  };
}
