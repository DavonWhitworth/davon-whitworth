import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/server/supabase";

// Google sends the visitor back here (through Supabase) with a one-time code.
// Exchanging it creates the session cookies, then the visitor goes back to the
// page they signed in from.
export const dynamic = "force-dynamic";

// Only allow a path on this site as the return target, so the sign-in link
// cannot be used to bounce someone to another website.
function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  // Behind Netlify the public host arrives in this header.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV !== "development" && forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${base}${next}`);
    } catch {
      // Fall through to the error redirect below.
    }
  }

  return NextResponse.redirect(`${base}/?signin=failed`);
}
