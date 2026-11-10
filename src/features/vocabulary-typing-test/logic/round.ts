import { calcNetWPM } from "./wpm";

// loading -> ready -> typing -> (round complete) -> loading ...
// "error" is entered when no definition could be loaded.
export type Phase = "loading" | "ready" | "typing" | "error";

export interface TypingState {
  phase: Phase;
  /** Increases every time a new term is requested; guards against stale responses. */
  loadId: number;
  term: string;
  definition: string;
  /** Number of accepted characters. The typed text is definition.slice(0, typed). */
  typed: number;
  /** Wrong keystrokes this round. Backspace never reduces it. */
  errors: number;
  /** True while the most recent attempt was wrong (drives the red flash). */
  lastWrong: boolean;
  /** performance.now() of the first typing attempt, or null before it. */
  startedAt: number | null;
  /** Time spent hidden or away this round, excluded from the elapsed time. */
  pausedMs: number;
  pausedAt: number | null;
  /** Net WPM of every completed round this session. */
  results: number[];
  lastResult: number | null;
}

export type Action =
  | { type: "loaded"; loadId: number; term: string; definition: string }
  | { type: "failed"; loadId: number }
  | { type: "key"; key: string; now: number }
  | { type: "backspace" }
  | { type: "pause"; now: number }
  | { type: "restart" };

export const initialState: TypingState = {
  phase: "loading",
  loadId: 0,
  term: "",
  definition: "",
  typed: 0,
  errors: 0,
  lastWrong: false,
  startedAt: null,
  pausedMs: 0,
  pausedAt: null,
  results: [],
  lastResult: null,
};

// Clears the round and asks for a new term. Results are kept.
function startLoading(state: TypingState): TypingState {
  return {
    ...state,
    phase: "loading",
    loadId: state.loadId + 1,
    term: "",
    definition: "",
    typed: 0,
    errors: 0,
    lastWrong: false,
    startedAt: null,
    pausedMs: 0,
    pausedAt: null,
  };
}

export function reducer(state: TypingState, action: Action): TypingState {
  switch (action.type) {
    case "loaded":
      if (action.loadId !== state.loadId) return state;
      return {
        ...state,
        phase: "ready",
        term: action.term,
        definition: action.definition,
        typed: 0,
        errors: 0,
        lastWrong: false,
        startedAt: null,
        pausedMs: 0,
        pausedAt: null,
      };

    case "failed":
      if (action.loadId !== state.loadId) return state;
      return { ...state, phase: "error" };

    case "restart":
      // Escape or "Try again": a new term, nothing recorded, average untouched.
      return startLoading(state);

    case "pause":
      if (state.phase !== "typing" || state.pausedAt !== null) return state;
      return { ...state, pausedAt: action.now };

    case "backspace":
      if (state.phase !== "ready" && state.phase !== "typing") return state;
      if (state.typed === 0) return state;
      return { ...state, typed: state.typed - 1, lastWrong: false };

    case "key": {
      if (state.phase !== "ready" && state.phase !== "typing") return state;

      // Typing again after the page was hidden resumes the clock.
      const pausedMs =
        state.pausedAt === null
          ? state.pausedMs
          : state.pausedMs + (action.now - state.pausedAt);
      const startedAt = state.startedAt ?? action.now;
      const base = {
        ...state,
        phase: "typing" as const,
        startedAt,
        pausedMs,
        pausedAt: null,
      };

      if (action.key !== state.definition[state.typed]) {
        return { ...base, errors: state.errors + 1, lastWrong: true };
      }

      const typed = state.typed + 1;
      if (typed < state.definition.length) {
        return { ...base, typed, lastWrong: false };
      }

      // Last character typed correctly: the round is over.
      const wpm = calcNetWPM(
        state.definition.length,
        state.errors,
        action.now - startedAt - pausedMs,
      );
      return {
        ...startLoading(base),
        results: [...state.results, wpm],
        lastResult: wpm,
      };
    }
  }
}
