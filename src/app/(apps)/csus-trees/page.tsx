import type { Metadata, Viewport } from "next";
import { CsusTreesApp } from "@/features/csus-trees/ui/CsusTreesApp";

// The app lives at /csus-trees. Its documentation is /projects/csus-trees.
// This route group has no site header or footer: the map uses the whole screen.
export const metadata: Metadata = {
  title: "CSUS-Trees",
  description: "A crowd-sourced map of the trees on the Sacramento State campus.",
  alternates: { canonical: "/csus-trees" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

// On Android, shrink the page when the on-screen keyboard opens, so forms
// near the bottom stay visible. (iOS ignores this; the dialog sits near the top.)
export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export default function CsusTreesPage() {
  return <CsusTreesApp />;
}
