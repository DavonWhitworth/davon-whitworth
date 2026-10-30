import type { Metadata } from "next";
import Link from "next/link";
import { LightSightApp } from "@/features/light-sight/ui/LightSightApp";

// The app lives at /light-sight. Its documentation is /projects/light-sight.
export const metadata: Metadata = {
  title: "Light Sight",
  description: "Light Sight, a small frontend application.",
  alternates: { canonical: "/light-sight" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

export default function LightSightPage() {
  return (
    <>
      <Link
        href="/projects/light-sight"
        className="text-sm text-muted hover:text-fg"
      >
        &larr; About Light Sight
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-fg">Light Sight</h1>

      <div className="mt-8">
        <LightSightApp />
      </div>
    </>
  );
}
