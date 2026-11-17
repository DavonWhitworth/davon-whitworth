import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "November 17, 2026";

const heading = "mt-10 text-xl font-semibold text-fg";
const paragraph = "mt-3 max-w-2xl text-muted";

export default function PrivacyPage() {
  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        &larr; Home
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-fg">Privacy</h1>
      <p className="mt-2 text-sm text-muted">Last updated {UPDATED}</p>

      <p className={paragraph}>
        This is a personal portfolio site. It collects as little as it can, and
        this page explains what it does collect.
      </p>

      <h2 className={heading}>Contact form</h2>
      <p className={paragraph}>
        If you send a message, the name, email address and message you type are
        sent by email to the site owner through Brevo, an email delivery
        service. They are used only to read and reply to your message.
      </p>

      <h2 className={heading}>Signing in with Google</h2>
      <p className={paragraph}>
        Some projects on this site let you sign in with your Google account.
        Signing in shares your basic Google profile (name, email address and
        profile picture) with this site. Sign-in is handled by Supabase, which
        stores your account record. The site does not receive your Google
        password and does not ask for access to anything beyond your basic
        profile.
      </p>
      <p className={paragraph}>
        Because sign-in runs through Supabase, the address Google shows on its
        sign-in screen and in its security email may be a long supabase.co
        address instead of davon-whitworth.com. That is expected and is part of
        this site.
      </p>

      <h2 className={heading}>Project data</h2>
      <p className={paragraph}>
        Projects that let signed-in users add content, such as a map of trees,
        store what you add together with an identifier for your account. That
        identifier is used to let you edit or delete your own entries and to
        let the site owner remove entries from accounts that misuse the site.
        It is not shown publicly. A location is read from your device only
        after you give permission and only when you add an entry.
      </p>

      <h2 className={heading}>Hosting and logs</h2>
      <p className={paragraph}>
        The site is hosted on Netlify, which keeps standard server logs, such
        as IP addresses and the pages requested, for security and operation.
        The site does not use advertising or tracking cookies.
      </p>

      <h2 className={heading}>Removing your data</h2>
      <p className={paragraph}>
        To have your account and anything you added deleted, send a message
        through the{" "}
        <Link href="/#contact" className="text-fg underline">
          contact form
        </Link>
        . Your data is not sold or shared with anyone other than the services
        named above.
      </p>
    </>
  );
}
