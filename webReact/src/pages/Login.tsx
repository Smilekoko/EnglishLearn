import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pollBiliQr, startBiliQr, type QrStart } from '../api/auth.ts'
import { useAuth } from '../auth/context.ts'
import styles from './Login.module.css'

type Phase = 'loading' | 'pending' | 'scanned' | 'expired' | 'failed' | 'error'

const HINTS: Record<Phase, string> = {
  loading: '正在生成二维码…',
  pending: '打开 B 站 App，用「扫一扫」扫描二维码',
  scanned: '已扫码，请在手机上确认登录',
  expired: '二维码已过期',
  failed: '登录失败',
  error: '二维码生成失败',
}

function Login() {
  const { user, loading, refresh, logout } = useAuth()
  const navigate = useNavigate()
  const [qr, setQr] = useState<QrStart | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const start = useCallback(async () => {
    setPhase('loading')
    setError(null)
    setQr(null)
    try {
      setQr(await startBiliQr())
      setPhase('pending')
    } catch (err) {
      setPhase('error')
      setError(err instanceof Error ? err.message : '生成二维码失败')
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    void start()
  }, [start])

  // 轮询扫码状态；依赖只有 qr，避免状态更新重置计时器
  useEffect(() => {
    if (!qr) return
    const qrKey = qr.key
    const controller = new AbortController()

    function schedule(delay: number) {
      timerRef.current = window.setTimeout(tick, delay)
    }

    async function tick() {
      try {
        const result = await pollBiliQr(qrKey, controller.signal)
        if (controller.signal.aborted) return
        if (result.status === 'ok') {
          await refresh()
          if (!controller.signal.aborted) navigate('/', { replace: true })
          return
        }
        if (result.status === 'expired' || result.status === 'failed') {
          setPhase(result.status)
          setError(result.message || null)
          return
        }
        setPhase(result.status === 'scanned' ? 'scanned' : 'pending')
        schedule(2000)
      } catch {
        if (controller.signal.aborted) return
        schedule(3000)
      }
    }

    schedule(1200)
    return () => {
      controller.abort()
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [qr, refresh, navigate])

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>登录</h1>

        {loading && <p className={styles.hint}>正在检查登录状态…</p>}

        {!loading && user && (
          <div className={styles.signedIn}>
            <p className={styles.signedName}>已登录：{user.nickname}</p>
            {user.mid && (
              <p className={styles.privacy}>
                你的 B 站 UID：<code>{user.mid}</code>
                <br />
                需要后台权限的话，把这个数字加进服务器的 <code>ADMIN_MIDS</code>。
              </p>
            )}
            <div className={styles.actions}>
              <Link to="/" className={styles.primary}>
                查看内容
              </Link>
              <button type="button" className={styles.ghost} onClick={() => void logout()}>
                退出登录
              </button>
            </div>
          </div>
        )}

        {!loading && !user && (
          <>
            <p className={styles.hint}>
              用 B 站 App 扫码即可登录，不需要注册。站内只保存 B 站的昵称和头像，不保存账号密码。
            </p>

            <div className={styles.qrBox}>
              {qr && phase !== 'loading' ? (
                <div
                  className={styles.qr}
                  // 后端返回的是自己生成的 SVG 字符串
                  dangerouslySetInnerHTML={{ __html: qr.svg }}
                />
              ) : (
                <div className={styles.qrPlaceholder}>
                  {phase === 'error' ? '生成失败' : '生成中…'}
                </div>
              )}
            </div>

            <p className={styles.status}>{HINTS[phase]}</p>
            {error && (phase === 'error' || phase === 'failed' || phase === 'expired') && (
              <p className={styles.errorText}>{error}</p>
            )}

            {(phase === 'expired' || phase === 'failed' || phase === 'error') && (
              <button type="button" className={styles.primary} onClick={() => void start()}>
                刷新二维码
              </button>
            )}

            <p className={styles.privacy}>
              登录后可在「我的」里修改昵称。换设备仍用同一个 B 站账号扫码即可。
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default Login
