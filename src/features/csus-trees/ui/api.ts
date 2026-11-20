import type {
  DeleteReadingResponse,
  ListMyReadingsResponse,
  ListTreesResponse,
  ReadingInput,
  SaveReadingResponse,
  TreeErrorResponse,
} from "@/features/csus-trees/model";

// Browser-side calls to the CSUS-Trees API. Every call resolves (never throws)
// to either the response body or a TreeErrorResponse the page can show.

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: TreeErrorResponse };

const OFFLINE: TreeErrorResponse = {
  error: "Couldn't reach the server. Check your connection and try again.",
  code: "server_error",
};

const UNKNOWN: TreeErrorResponse = {
  error: "Something went wrong. Please try again.",
  code: "server_error",
};

function isErrorBody(body: unknown): body is TreeErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as TreeErrorResponse).code === "string" &&
    typeof (body as TreeErrorResponse).error === "string"
  );
}

async function call<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    return { ok: false, status: 0, error: OFFLINE };
  }
  const body: unknown = await response.json().catch(() => null);
  if (response.ok) return { ok: true, data: body as T };
  return { ok: false, status: response.status, error: isErrorBody(body) ? body : UNKNOWN };
}

export function fetchTrees() {
  return call<ListTreesResponse>("/api/csus-trees/trees");
}

export function fetchMyReadings() {
  return call<ListMyReadingsResponse>("/api/csus-trees/readings");
}

export function saveReading(treeNumber: number, input: ReadingInput) {
  return call<SaveReadingResponse>(`/api/csus-trees/readings/${treeNumber}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteReading(treeNumber: number) {
  return call<DeleteReadingResponse>(`/api/csus-trees/readings/${treeNumber}`, {
    method: "DELETE",
  });
}
