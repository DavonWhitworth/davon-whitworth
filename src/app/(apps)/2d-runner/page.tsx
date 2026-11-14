import type { Metadata } from "next";
import { RunnerApp } from "@/features/2d-runner/ui/RunnerApp";

// The game lives at /2d-runner. Its documentation is /projects/2d-runner.
// The Unity build itself is static files in public/games/2d-runner.
export const metadata: Metadata = {
  title: "2D Runner",
  description: "Play 2D Runner, a 2D game made with Unity, in your browser.",
  alternates: { canonical: "/2d-runner" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

export default function RunnerPage() {
  return <RunnerApp />;
}
