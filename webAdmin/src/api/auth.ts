import { apiGet, apiPost } from './client.ts'

export interface AuthUser {
  id: number
  nickname: string
  avatar: string
  /** ADMIN / USER */
  role: string
  status: string
  /** B 站 mid；非管理员被拒时页面会显示出来，方便加进 ADMIN_MIDS */
  mid: string
}

export interface QrStart {
  key: string
  svg: string
  expiresIn: number
}

export type QrStatus = 'pending' | 'scanned' | 'ok' | 'expired' | 'failed'

export interface PollResult {
  status: QrStatus
  user: AuthUser | null
  message: string
}

export function startBiliQr(): Promise<QrStart> {
  return apiPost<QrStart>('/api/auth/bili/qr')
}

export function pollBiliQr(key: string, signal?: AbortSignal): Promise<PollResult> {
  return apiGet<PollResult>(`/api/auth/bili/qr/${encodeURIComponent(key)}`, signal)
}

export function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  return apiGet<AuthUser>('/api/auth/me', signal)
}

export function logout(): Promise<void> {
  return apiPost<void>('/api/auth/logout')
}
