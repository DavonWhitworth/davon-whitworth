import "server-only";

// Simple in-memory sliding-window limiter.
//
// Limitation: on serverless hosting each function instance keeps its own
// memory, so this only slows down casual abuse. For stricter limits, back it
// with a shared store (for example a MongoDB collection or Upstash Redis).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing forever.
  if (hits.size > 5000) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(storedKey);
    }
  }

  return true;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
