import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { pollBiliQr, startBiliQr, type AuthUser, type QrStart } from '../api/auth.ts'
import { useAuth } from '../auth/context.ts'
import styles from './Login.module.css'

type Phase = 'loading' | 'pending' | 'scanned' | 'expired' | 'failed' | 'error' | 'not-admin'

const HINTS: Record<Phase, string> = {
  loading: '正在生成二维码…',
  pending: '用 B 站 App 扫码登录',
  scanned: '已扫码，请在手机上确认',
  expired: '二维码已过期',
  failed: '登录失败',
  error: '二维码生成失败',
  'not-admin': '这个 B 站账号不在管理员白名单里',
}

function Login() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [qr, setQr] = useState<QrStart | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [rejected, setRejected] = useState<AuthUser | null>(null)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    setPhase('loading')
    setError(null)
    setRejected(null)
    setQr(null)
    startBiliQr()
      .then((data) => {
        setQr(data)
        setPhase('pending')
      })
      .catch((err: unknown) => {
        setPhase('error')
        setError(err instanceof Error ? err.message : '生成二维码失败')
      })
  }

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    start()
  }, [])

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
          const user: AuthUser | null = result.user
          if (!user || user.role !== 'ADMIN') {
            setRejected(user)
            setPhase('not-admin')
            return
          }
          await refresh()
          navigate('/', { replace: true })
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
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            EL
          </span>
          <div>
            <div className={styles.title}>EnglishLearn</div>
            <div className={styles.subtitle}>管理后台</div>
          </div>
        </div>

        <div className={styles.qrBox}>
          {qr && phase !== 'loading' ? (
            <div
              className={styles.qr}
              // 后端生成的 SVG
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
          ) : (
            <Spin />
          )}
        </div>

        <Typography.Text type={phase === 'error' || phase === 'not-admin' ? 'danger' : 'secondary'}>
          {HINTS[phase]}
        </Typography.Text>

        {error && (phase === 'error' || phase === 'failed' || phase === 'expired') && (
          <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />
        )}

        {phase === 'not-admin' && (
          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 12 }}
            message="没有后台权限"
            description={
              <span>
                该 B 站账号
                {rejected?.nickname ? `（${rejected.nickname}）` : ''}不在管理员白名单里。
                {rejected?.mid && (
                  <>
                    <br />
                    它的 B 站 UID 是 <Typography.Text code>{rejected.mid}</Typography.Text>，
                    把它加进服务器的 <Typography.Text code>ADMIN_MIDS</Typography.Text>
                    后重启后端即可。
                  </>
                )}
              </span>
            }
          />
        )}

        {(phase === 'expired' || phase === 'failed' || phase === 'error' || phase === 'not-admin') && (
          <Button type="primary" block style={{ marginTop: 16 }} onClick={start}>
            刷新二维码
          </Button>
        )}
      </div>
    </div>
  )
}

export default Login
