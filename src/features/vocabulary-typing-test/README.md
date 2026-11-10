# Vocabulary Typing Test

Frontend only (it calls the Free Dictionary API straight from the browser), so this feature has `ui/` and `logic/` and no `server/` folder.

- App page: `src/app/(apps)/vocabulary-typing-test/page.tsx` (URL: `/vocabulary-typing-test`). The `(apps)` route group has no site header or footer.
- Documentation: `src/content/docs/vocabulary-typing-test.md` (URL: `/projects/vocabulary-typing-test`). It describes the original app (Create React App, styled-components, axios).
- `logic/` plain TypeScript with no React: `words.ts` (word list), `dictionary.ts` (fetch, retry, clean up the definition), `wpm.ts` (net WPM), `round.ts` (the reducer: phases, errors, timer).
- `ui/` `useTypingTest.ts` (loading, keyboard, tab visibility), `TypingTest.tsx` (the card), `DefinitionText.tsx` (per-character display), `TypingTestApp.tsx` (page layout and the link back to the docs).
- Colors are the `--color-typing-*` tokens in `src/app/globals.css`.

Rules: each round has its own timer that starts on the first keystroke and stops on the last correct character. Wrong keys never advance the cursor and each adds one error that Backspace cannot undo. Escape gives a new term without recording a result.
