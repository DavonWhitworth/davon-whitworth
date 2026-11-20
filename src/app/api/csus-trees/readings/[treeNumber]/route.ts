import {
  handleDeleteReading,
  handleSaveReading,
  handleUpdateSpecies,
} from "@/features/csus-trees/server/api";

// Add, replace, re-label or delete the signed-in user's entry for one tree number.
// See src/features/csus-trees/README.md.
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ treeNumber: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { treeNumber } = await params;
  return handleSaveReading(request, treeNumber);
}

export async function PATCH(request: Request, { params }: Context) {
  const { treeNumber } = await params;
  return handleUpdateSpecies(request, treeNumber);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { treeNumber } = await params;
  return handleDeleteReading(treeNumber);
}
