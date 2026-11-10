// Shortest time a round can count for. It keeps a very short definition from
// producing an absurd (or infinite) words-per-minute figure.
export const MIN_ELAPSED_MS = 250;

/**
 * Net words per minute, the same formula the original app used:
 *
 *   netWords = (characters / 5) - errors, never below 1
 *   netWPM   = netWords / minutes
 *
 * `errors` is every wrong keystroke in the round, and Backspace never reduces it.
 */
export function calcNetWPM(
  characters: number,
  errors: number,
  elapsedMs: number,
): number {
  const minutes = Math.max(elapsedMs, MIN_ELAPSED_MS) / 60_000;
  let netWords = characters / 5 - errors;
  if (netWords <= 0) netWords = 1;
  return netWords / minutes;
}

/** Mean of the completed rounds, or null before any round is finished. */
export function averageWPM(results: readonly number[]): number | null {
  if (results.length === 0) return null;
  return results.reduce((sum, value) => sum + value, 0) / results.length;
}

/** Two decimals, or an em dash when there is nothing to show yet. */
export function formatWPM(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}
