import Link from "next/link";
import { TypingTest } from "./TypingTest";

// The whole /vocabulary-typing-test page: the near-black background of the
// original, the instructions, the typing card and a link back to the docs.
export function TypingTestApp() {
  return (
    <main className="min-h-dvh bg-typing-bg px-4 pb-16 text-center">
      <div className="pt-4 text-left">
        <Link
          href="/projects/vocabulary-typing-test"
          className="inline-block rounded-full border border-white/30 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
        >
          <span aria-hidden="true">&larr; </span>About this project
        </Link>
      </div>

      <h1 className="sr-only">Vocabulary Typing Test</h1>

      <p className="mx-auto mt-10 max-w-[500px] text-white">
        Start typing to begin. WPM is calculated per term. Press{" "}
        <kbd className="font-[inherit]">Escape</kbd> for a new term (it does not
        affect your average WPM).
      </p>

      <p className="mx-auto mt-4 hidden max-w-[500px] text-sm text-white/70 pointer-coarse:block">
        This typing test needs a physical keyboard.
      </p>

      <div className="mt-8">
        <TypingTest />
      </div>
    </main>
  );
}
