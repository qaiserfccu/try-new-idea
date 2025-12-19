export type LogLevel = 'info' | 'warn' | 'error'

export type ApiResponseLog = {
  level: LogLevel
  ts: string
  source: 'client' | 'server'
  url?: string
  status?: number
  body?: string
  userId?: string | number | null
  message?: string
  extra?: any
}

const MAX_LOGS = 1000
const logs: ApiResponseLog[] = []

function pushLog(l: ApiResponseLog) {
  logs.push(l)
  if (logs.length > MAX_LOGS) logs.shift()
}

export function getLogs() {
  return [...logs]
}

export function logApiResponse({ source, url, status, body, userId, extra, level = 'warn', message }: Partial<ApiResponseLog> & { source: 'client' | 'server' }) {
  const entry: ApiResponseLog = {
    level: (level as LogLevel) || 'warn',
    ts: new Date().toISOString(),
    source,
    url,
    status,
    body: typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
    userId: userId ?? null,
    message,
    extra,
  }

  pushLog(entry)

  const shortBody = entry.body ? (entry.body.length > 1000 ? entry.body.slice(0, 1000) + '…' : entry.body) : ''
  if (entry.level === 'error') console.error('[api-resp]', entry.ts, entry.source, entry.url, entry.status, entry.message || '', shortBody)
  else if (entry.level === 'warn') console.warn('[api-resp]', entry.ts, entry.source, entry.url, entry.status, entry.message || '', shortBody)
  else console.log('[api-resp]', entry.ts, entry.source, entry.url, entry.status, entry.message || '', shortBody)

  return entry
}

export function logError(err: unknown, context?: { source: 'client' | 'server'; url?: string; userId?: string | number | null; message?: string }) {
  const msg = err && (err as any).message ? (err as any).message : String(err)
  pushLog({ level: 'error', ts: new Date().toISOString(), source: context?.source ?? 'server', url: context?.url, userId: context?.userId ?? null, message: context?.message ?? msg, body: msg })
  console.error('[error]', context?.source ?? 'server', context?.url, msg, err)
}

export default {
  logApiResponse,
  logError,
  getLogs,
}
