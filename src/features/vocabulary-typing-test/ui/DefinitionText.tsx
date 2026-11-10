import { memo, useMemo } from "react";

type CharStatus = "done" | "active" | "todo";

const MAX_UNIT_LENGTH = 20;

interface Unit {
  start: number;
  text: string;
}

// Splits the definition into pieces that may wrap between each other: a word
// plus its trailing space, with very long words cut into chunks so they can
// never overflow the card.
function splitUnits(text: string): Unit[] {
  const units: Unit[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const endsUnit = text[i] === " " || i - start + 1 >= MAX_UNIT_LENGTH;
    if (endsUnit || i === text.length - 1) {
      units.push({ start, text: text.slice(start, i + 1) });
      start = i + 1;
    }
  }
  return units;
}

// Every character is the same inline-block, so the layout is identical whether
// or not it is the active one. The active character is enlarged with a
// transform and boxed with an outline, neither of which takes up space, so the
// text never reflows as you type.
const Char = memo(function Char({
  char,
  status,
  wrong,
}: {
  char: string;
  status: CharStatus;
  wrong: boolean;
}) {
  const tone =
    status === "done"
      ? "text-typing-done"
      : status === "active"
        ? "relative z-10 scale-110 outline outline-1 outline-offset-1 outline-white"
        : "";
  const flash =
    status === "active" && wrong
      ? "animate-[wrong-flash_0.3s_ease-out]"
      : "";
  // Spaces get a minimum width so the box around an active space is visible.
  const width = char === " " ? "min-w-[0.4em]" : "";

  return (
    <span
      className={`inline-block whitespace-pre leading-[1.2] ${width} ${tone} ${flash}`}
    >
      {char}
    </span>
  );
});

interface DefinitionTextProps {
  definition: string;
  /** Number of characters already typed correctly. */
  typed: number;
  /** Whether a character is currently waiting to be typed. */
  active: boolean;
  /** Whether the last keystroke was wrong. */
  wrong: boolean;
  /** Number of wrong keystrokes; restarts the flash animation each time. */
  errors: number;
}

export function DefinitionText({
  definition,
  typed,
  active,
  wrong,
  errors,
}: DefinitionTextProps) {
  const units = useMemo(() => splitUnits(definition), [definition]);

  return (
    <>
      {/* The per-character display is decorative; read the whole text once. */}
      <span className="sr-only">{definition}</span>
      <span aria-hidden="true">
        {units.map((unit) => (
          <span key={unit.start} className="inline-block whitespace-pre">
            {Array.from(unit.text).map((char, offset) => {
              const index = unit.start + offset;
              const status: CharStatus =
                index < typed ? "done" : index === typed && active ? "active" : "todo";
              const isFlashing = status === "active" && wrong;
              return (
                <Char
                  key={isFlashing ? `${index}-${errors}` : index}
                  char={char}
                  status={status}
                  wrong={isFlashing}
                />
              );
            })}
          </span>
        ))}
      </span>
    </>
  );
}
