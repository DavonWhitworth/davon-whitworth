import { UnityGameFrame } from "@/components/UnityGameFrame";

// The whole /pop page. The Unity build is static files in public/games/pop
// (see README.md). The game is square, so the frame is 1 by 1.
export function PopApp() {
  return (
    <UnityGameFrame
      title="Pop"
      src="/games/pop/index.html"
      backHref="/projects/pop"
      aspect={{ width: 1, height: 1 }}
    />
  );
}
