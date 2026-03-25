type RateLimitOptions = {
  key: string
  limit: number
  windowMs: number
}

declare global {
  var __rateLimitStore: Map<string, {count: number; resetAt: number}> | undefined
}

const store =
  globalThis.__rateLimitStore ?? (globalThis.__rateLimitStore = new Map())

export function rateLimit({key, limit, windowMs}: RateLimitOptions) {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    const next = {count: 1, resetAt: now + windowMs}
    store.set(key, next)
    return {ok: true, remaining: limit - 1, resetAt: next.resetAt}
  }

  if (existing.count >= limit) {
    return {ok: false, remaining: 0, resetAt: existing.resetAt}
  }

  existing.count += 1
  store.set(key, existing)
  return {ok: true, remaining: limit - existing.count, resetAt: existing.resetAt}
}

