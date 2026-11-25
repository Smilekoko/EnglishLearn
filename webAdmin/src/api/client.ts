/**
 * 极简 API 客户端（管理端）。开发时走 Vite 代理 /api -> localhost:8080，
 * 部署时 Nginx 把 /api 反代到后端；会话用 HttpOnly Cookie，所以统一带 credentials。
 */
const BASE_URL = import.meta.env.VITE_API_BASE ?? ''

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      ...init,
      headers: { Accept: 'application/json', ...(init.headers ?? {}) },
    })
  } catch (error) {
    if (init.signal?.aborted) throw error
    throw new ApiError('无法连接后台服务，请确认 server 已启动')
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ApiError(detail.slice(0, 200) || `请求失败（HTTP ${response.status}）`, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: 'GET', signal })
}

export function apiPost<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    signal,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export function apiPatch<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
