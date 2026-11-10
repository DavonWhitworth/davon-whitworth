import type { Metadata } from "next";
import { LightSightApp } from "@/features/light-sight/ui/LightSightApp";

// The app lives at /light-sight. Its documentation is /projects/light-sight.
// This route group has no site header or footer: the page uses the whole screen.
export const metadata: Metadata = {
  title: "Light Sight",
  description:
    "Turn your screen into a light. Pick a color to illuminate your surroundings.",
  alternates: { canonical: "/light-sight" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

export default function LightSightPage() {
  return <LightSightApp />;
}
