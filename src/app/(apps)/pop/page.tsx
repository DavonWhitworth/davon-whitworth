import type { Metadata } from "next";
import { PopApp } from "@/features/pop/ui/PopApp";

// The game lives at /pop. Its documentation is /projects/pop.
// The Unity build itself is static files in public/games/pop.
export const metadata: Metadata = {
  title: "Pop",
  description:
    "Play Pop, a top-down arcade shooter made with Unity, in your browser.",
  alternates: { canonical: "/pop" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

export default function PopPage() {
  return <PopApp />;
}
