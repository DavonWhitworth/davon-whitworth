import { UnityGameFrame } from "@/components/UnityGameFrame";

// The whole /2d-runner page. The Unity build is static files in
// public/games/2d-runner (see README.md). Widescreen, 16 by 9.
export function RunnerApp() {
  return (
    <UnityGameFrame
      title="2D Runner"
      src="/games/2d-runner/index.html"
      backHref="/projects/2d-runner"
      aspect={{ width: 16, height: 9 }}
    />
  );
}
