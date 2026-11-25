import { Spin } from 'antd'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/context.ts'

function RequireAuth() {
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
        <Spin tip="正在检查登录状态…" />
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
