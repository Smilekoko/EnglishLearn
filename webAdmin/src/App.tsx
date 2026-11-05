import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import GrammarAdmin from './pages/GrammarAdmin.tsx'
import VowelsAdmin from './pages/VowelsAdmin.tsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="grammar" element={<GrammarAdmin />} />
          <Route path="vowels" element={<VowelsAdmin />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
