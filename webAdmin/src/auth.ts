/**
 * 演示用登录。
 *
 * 后端尚未接入，账号密码写在前端只为让界面能跑通流程。
 * 接入后端后，把 login() 换成 POST /api/auth/login，会话改由服务端下发的
 * HttpOnly Cookie 维护，前端不再保存任何凭据。
 */
const SESSION_KEY = 'englishlearn.admin.session'

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = '123456'

export interface Session {
  username: string
  loginAt: number
}

export async function login(username: string, password: string): Promise<boolean> {
  // 模拟一次网络往返，便于看到按钮 loading 状态
  await new Promise((resolve) => setTimeout(resolve, 350))

  if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    return false
  }

  const session: Session = { username: username.trim(), loginAt: Date.now() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return true
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function session(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    return parsed && parsed.username ? parsed : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return session() !== null
}
