# 2D Runner

Frontend only. The Unity WebGL build is static files in `public/games/2d-runner`
(`index.html` plus `Build/`), shown in an iframe by `ui/RunnerApp.tsx`.

To ship a new build: export WebGL from Unity (Compression Format: Disabled,
WebGL Template: Minimal), then replace the files in `public/games/2d-runner/Build`.
If the file names change, update the four URLs in `public/games/2d-runner/index.html`.
