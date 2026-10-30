"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-fg placeholder:text-muted focus:border-accent";

function field(data: FormData, name: string): string {
  return String(data.get(name) ?? "");
}

function resetTurnstile() {
  const turnstile = (
    window as unknown as { turnstile?: { reset: () => void } }
  ).turnstile;
  turnstile?.reset();
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: field(data, "name"),
          email: field(data, "email"),
          message: field(data, "message"),
          website: field(data, "website"),
          turnstileToken: field(data, "cf-turnstile-response") || undefined,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          result?.error ?? "Something went wrong. Please try again.",
        );
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
      resetTurnstile();
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-card border border-border bg-surface p-5">
        Thanks, your message was sent. I will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-muted">
          Name
          <input
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="block text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={`${inputClass} mt-1`}
          />
        </label>
      </div>

      <label className="block text-sm text-muted">
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={`${inputClass} mt-1`}
        />
      </label>

      {/* Honeypot: real visitors never see or fill this field. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {turnstileSiteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
          <div
            className="cf-turnstile"
            data-sitekey={turnstileSiteKey}
            data-theme="dark"
          />
        </>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-status-archived">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-accent px-5 py-2 font-medium text-accent-contrast transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
