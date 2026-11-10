import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { TypingTestApp } from "@/features/vocabulary-typing-test/ui/TypingTestApp";

// The app lives at /vocabulary-typing-test. Its documentation is
// /projects/vocabulary-typing-test. This route group has no site header or
// footer: the page keeps the look of the original app.
const roboto = Roboto({ subsets: ["latin"], weight: ["400"], display: "swap" });

export const metadata: Metadata = {
  title: "Vocabulary Typing Test",
  description:
    "Type the dictionary definition of a word and see your words per minute.",
  alternates: { canonical: "/vocabulary-typing-test" },
  // App pages stay out of search results. The documentation page is indexed.
  robots: { index: false },
};

export default function VocabularyTypingTestPage() {
  return (
    <div className={roboto.className}>
      <TypingTestApp />
    </div>
  );
}
