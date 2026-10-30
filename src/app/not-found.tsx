import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <h1 className="text-3xl font-semibold text-fg">Page not found</h1>
      <p className="mt-3 text-muted">
        That page does not exist. It may have moved or never been here.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-surface-2"
      >
        Back to the home page
      </Link>
    </section>
  );
}
