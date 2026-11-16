/**
 * 极简 API 客户端。
 *
 * 开发环境走 Vite 代理（/api -> http://localhost:8080，见 vite.config.ts），
 * 生产环境通过 VITE_API_BASE 指定后端地址，例如：
 *   VITE_API_BASE=https://api.example.com npm run build
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

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('无法连接后台服务，请确认 server 已启动')
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ApiError(detail.slice(0, 200) || `请求失败（HTTP ${response.status}）`, response.status)
  }

  return (await response.json()) as T
}
