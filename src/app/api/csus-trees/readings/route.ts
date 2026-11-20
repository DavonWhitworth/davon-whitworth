import { handleListMyReadings } from "@/features/csus-trees/server/api";

// The signed-in user's own entries. See src/features/csus-trees/README.md.
export const dynamic = "force-dynamic";

export function GET() {
  return handleListMyReadings();
}
