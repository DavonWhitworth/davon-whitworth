import { handleListTrees } from "@/features/csus-trees/server/api";

// Every production tree (public). See src/features/csus-trees/README.md.
export const dynamic = "force-dynamic";

export function GET() {
  return handleListTrees();
}
