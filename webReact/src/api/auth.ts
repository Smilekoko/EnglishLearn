import { apiGet, apiPatch, apiPost } from './client.ts'

export interface AuthUser {
  id: number
  nickname: string
  avatar: string
  /** ADMIN / USER */
  role: string
  status: string
  /** B 站 mid，登录页显示出来方便配置管理员白名单 */
  mid: string
}

export interface QrStart {
  key: string
  /** 已渲染好的 SVG，直接内嵌 */
  svg: string
  expiresIn: number
}

export type QrStatus = 'pending' | 'scanned' | 'ok' | 'expired' | 'failed'

export interface PollResult {
  status: QrStatus
  user: AuthUser | null
  /** 失败时后端给的说明（如「扫码成功但获取账号信息失败」） */
  message: string
}

/** 生成 B 站扫码登录二维码 */
export function startBiliQr(): Promise<QrStart> {
  return apiPost<QrStart>('/api/auth/bili/qr')
}

/** 轮询扫码状态；status 为 ok 时服务端已下发会话 cookie */
export function pollBiliQr(key: string, signal?: AbortSignal): Promise<PollResult> {
  return apiGet<PollResult>(`/api/auth/bili/qr/${encodeURIComponent(key)}`, signal)
}

export function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  return apiGet<AuthUser>('/api/auth/me', signal)
}

export function logout(): Promise<void> {
  return apiPost<void>('/api/auth/logout')
}

export function renameMe(nickname: string): Promise<AuthUser> {
  return apiPatch<AuthUser>('/api/auth/me', { nickname })
}
