import { useEffect, useMemo, useReducer, useRef } from "react";
import { loadTerm } from "../logic/dictionary";
import { initialState, reducer } from "../logic/round";
import { averageWPM } from "../logic/wpm";

const RECENT_WORDS = 10;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

// Ctrl, Cmd and Alt combos are browser shortcuts, not typing. AltGr (used by
// some layouts to type characters) is allowed through.
function isShortcut(event: KeyboardEvent): boolean {
  if (event.metaKey) return true;
  return (event.ctrlKey || event.altKey) && !event.getModifierState("AltGraph");
}

export function useTypingTest() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const recentRef = useRef<string[]>([]);
  const phaseRef = useRef(state.phase);

  useEffect(() => {
    phaseRef.current = state.phase;
  }, [state.phase]);

  // Load a word and its definition together. Changing loadId (a new round,
  // Escape, or retry) aborts the request in flight so an old response can
  // never replace a newer one.
  const { loadId } = state;
  useEffect(() => {
    const controller = new AbortController();

    loadTerm(recentRef.current, controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) return;
        if (!loaded) {
          dispatch({ type: "failed", loadId });
          return;
        }
        recentRef.current = [...recentRef.current, loaded.word].slice(
          -RECENT_WORDS,
        );
        dispatch({
          type: "loaded",
          loadId,
          term: loaded.term,
          definition: loaded.definition,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) dispatch({ type: "failed", loadId });
      });

    return () => controller.abort();
  }, [loadId]);

  // Keyboard input. There is no text field: keys are read from the window.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      if (event.key === "Escape") {
        if (!event.repeat) dispatch({ type: "restart" });
        return;
      }

      const phase = phaseRef.current;
      if (phase !== "ready" && phase !== "typing") return;

      if (event.key === "Backspace") {
        event.preventDefault();
        dispatch({ type: "backspace" });
        return;
      }

      // Only single printable characters count as typing. Shift, CapsLock,
      // Tab, arrows, function keys and the like are ignored entirely.
      if (event.key.length !== 1 || isShortcut(event)) return;

      // Space would scroll the page; ' and / open quick-find in Firefox.
      if (event.key === " " || event.key === "'" || event.key === "/") {
        event.preventDefault();
      }
      if (event.repeat) return;

      dispatch({ type: "key", key: event.key, now: performance.now() });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Time spent in another tab is not counted: the clock pauses when the page
  // is hidden and resumes on the next keystroke.
  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) dispatch({ type: "pause", now: performance.now() });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const average = useMemo(() => averageWPM(state.results), [state.results]);

  return {
    state,
    average,
    restart: () => dispatch({ type: "restart" }),
  };
}
