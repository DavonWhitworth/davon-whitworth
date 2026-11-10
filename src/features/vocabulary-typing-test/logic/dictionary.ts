import { words } from "./words";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const MAX_ATTEMPTS = 5;
const REQUEST_TIMEOUT_MS = 8000;
const MIN_DEFINITION_LENGTH = 3;

export interface LoadedTerm {
  /** The lowercase word from the list, used to avoid repeats. */
  word: string;
  /** The word with its first letter capitalized, for display. */
  term: string;
  definition: string;
}

const REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[‘’‚‛′]/g, "'"], // curly single quotes
  [/[“”„‟″]/g, '"'], // curly double quotes
  [/[‐-―−]/g, "-"], //            dashes and minus
  [/…/g, "..."], //                         ellipsis
  [/[       ]/g, " "], // odd spaces
];

/**
 * Turns the text from the API into something a US keyboard can type: smart
 * punctuation becomes plain ASCII, accents are dropped, anything else that
 * cannot be typed is removed, and whitespace is collapsed.
 */
export function normalizeDefinition(raw: string): string {
  let text = raw;
  for (const [pattern, replacement] of REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/\s+/g, " ")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// The API returns [{ meanings: [{ definitions: [{ definition }] }] }].
// This reads the first definition of the first meaning, like the original app.
function firstDefinition(data: unknown): string | null {
  if (!Array.isArray(data) || !isRecord(data[0])) return null;
  const meanings = data[0].meanings;
  if (!Array.isArray(meanings) || !isRecord(meanings[0])) return null;
  const definitions = meanings[0].definitions;
  if (!Array.isArray(definitions) || !isRecord(definitions[0])) return null;
  const definition = definitions[0].definition;
  return typeof definition === "string" ? definition : null;
}

function withTimeout(signal: AbortSignal): AbortSignal {
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]);
  }
  return signal;
}

async function fetchDefinition(
  word: string,
  signal: AbortSignal,
): Promise<string | null> {
  const response = await fetch(`${BASE_URL}${encodeURIComponent(word)}`, {
    signal: withTimeout(signal),
  });
  // Some words in the list (plurals, rare words) return 404.
  if (!response.ok) return null;

  const raw = firstDefinition(await response.json());
  if (raw === null) return null;

  const definition = normalizeDefinition(raw);
  return definition.length >= MIN_DEFINITION_LENGTH ? definition : null;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function pickWord(recent: readonly string[], tried: ReadonlySet<string>): string {
  const fresh = words.filter((word) => !recent.includes(word) && !tried.has(word));
  const fallback = words.filter((word) => !tried.has(word));
  const pool = fresh.length > 0 ? fresh : fallback.length > 0 ? fallback : words;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Picks a random word and fetches its definition. A word that fails (404,
 * no definition, network error) is skipped and another is tried, up to five
 * times. Returns null when every attempt failed. Throws only when `signal`
 * was aborted, so the caller can drop the result.
 */
export async function loadTerm(
  recent: readonly string[],
  signal: AbortSignal,
): Promise<LoadedTerm | null> {
  const tried = new Set<string>();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const word = pickWord(recent, tried);
    tried.add(word);
    try {
      const definition = await fetchDefinition(word, signal);
      if (definition) return { word, term: capitalize(word), definition };
    } catch (error) {
      if (signal.aborted) throw error;
      // Any other failure: try a different word.
    }
  }
  return null;
}
