import { apiGet, apiPatch } from './client.ts'

export interface AdminUserRow {
  id: number
  nickname: string
  avatar: string
  role: string
  /** ACTIVE / BANNED */
  status: string
  provider: string
  subject: string
  createdAt: string
  lastLoginAt: string
}

export interface AdminUserPage {
  items: AdminUserRow[]
  total: number
  page: number
  size: number
}

export function fetchUsers(
  params: { q?: string; page?: number; size?: number },
  signal?: AbortSignal,
): Promise<AdminUserPage> {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  query.set('page', String(params.page ?? 1))
  query.set('size', String(params.size ?? 20))
  return apiGet<AdminUserPage>(`/api/admin/users?${query.toString()}`, signal)
}

export function updateUserStatus(id: number, status: 'ACTIVE' | 'BANNED'): Promise<AdminUserRow> {
  return apiPatch<AdminUserRow>(`/api/admin/users/${id}`, { status })
}
