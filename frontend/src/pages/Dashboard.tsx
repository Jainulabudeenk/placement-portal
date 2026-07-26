import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLink =
    user?.role === 'student' ? '/jobs' :
    user?.role === 'recruiter' ? '/recruiter' :
    user?.role === 'admin' ? '/admin' :
    '/jobs'

  const roleLabel =
    user?.role === 'student' ? 'View Jobs' :
    user?.role === 'recruiter' ? 'Recruiter Dashboard' :
    user?.role === 'admin' ? 'Admin Dashboard' :
    'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Dashboard</h1>
        {user && (
          <div className="mb-4">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
          </div>
        )}
        <div className="flex gap-3">
          <a href={roleLink} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {roleLabel}
          </a>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}