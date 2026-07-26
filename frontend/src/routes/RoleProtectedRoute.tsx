import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) {
    const fallback =
      user.role === 'student' ? '/jobs' :
      user.role === 'recruiter' ? '/recruiter' :
      user.role === 'admin' ? '/admin' :
      '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}