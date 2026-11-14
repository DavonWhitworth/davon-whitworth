# Pop

Frontend only. The Unity WebGL build is static files in `public/games/pop`
(`index.html`, `Build/`, `webAssets/`), shown in an iframe by `ui/PopApp.tsx`
through the shared `UnityGameFrame` component. The game is square, so the frame
is square; in fullscreen `index.html` keeps a centered square with dark bars
instead of stretching.

The game calls `UnityHasLoaded()` (Assets/Plugins/webgl.jslib in the Unity
project), which removes the `#loadingSplash` element. `index.html` must keep an
element with that id.

To ship a new build: export WebGL from Unity with the `custom` template
(Compression Format: Disabled), then replace `Build/` (and `webAssets/` if it
changed). The Unity template hard-codes the file names `pop.*`, so
`index.html` here uses the real names (`Pop_build.*`); if the build folder is
named differently, update the four URLs in `index.html`.
