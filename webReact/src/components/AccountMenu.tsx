import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context.ts'
import styles from './AccountMenu.module.css'

function AccountMenu() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <Link to="/login" className={styles.login}>
        登录
      </Link>
    )
  }

  return (
    <div className={styles.account}>
      {user.avatar ? (
        <img className={styles.avatar} src={user.avatar} alt="" referrerPolicy="no-referrer" />
      ) : (
        <span className={styles.avatarFallback} aria-hidden="true">
          {user.nickname.slice(0, 1)}
        </span>
      )}
      <span className={styles.name}>{user.nickname}</span>
      <button
        type="button"
        className={styles.logout}
        onClick={() => {
          void logout().then(() => navigate('/', { replace: true }))
        }}
      >
        退出
      </button>
    </div>
  )
}

export default AccountMenu
