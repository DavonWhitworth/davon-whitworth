"use client";

import { formatWPM } from "../logic/wpm";
import { DefinitionText } from "./DefinitionText";
import { useTypingTest } from "./useTypingTest";

// The card from the original app: gold text and border on near-black, the term,
// its definition typed character by character, and the WPM figures below.
export function TypingTest() {
  const { state, average, restart } = useTypingTest();
  const { phase, term, definition, typed, errors, lastWrong, lastResult } =
    state;

  const termText = phase === "loading" ? "…" : phase === "error" ? "—" : term;

  return (
    <section
      aria-label="Typing test"
      className="mx-auto w-full rounded-[15px] border-2 border-typing-gold p-[25px] text-center text-[length:120%] leading-9 text-typing-gold md:w-3/5"
    >
      <p>Term = {termText}</p>

      <p className="mt-1">
        Definition ={" "}
        {phase === "loading" ? (
          <span className="opacity-70">Loading&hellip;</span>
        ) : phase === "error" ? (
          <span role="alert">
            Could not load a definition.{" "}
            <button
              type="button"
              onClick={restart}
              className="mt-2 rounded-lg border border-typing-gold px-3 py-1 text-base hover:bg-typing-gold hover:text-typing-bg"
            >
              Try again
            </button>
          </span>
        ) : (
          <DefinitionText
            definition={definition}
            typed={typed}
            active={true}
            wrong={lastWrong}
            errors={errors}
          />
        )}
      </p>

      <div
        aria-live="polite"
        className="m-[5px] flex items-center justify-center p-[10px]"
      >
        <p>
          Net WPM of previous term = {formatWPM(lastResult)}
          <br />
          Average net WPM for session = {formatWPM(average)}
        </p>
      </div>
    </section>
  );
}
