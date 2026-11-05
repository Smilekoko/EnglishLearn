import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../auth.ts'

function RequireAuth() {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth
