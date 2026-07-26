import { useEffect, useState } from 'react'
import {
  getPendingCompanies,
  approveCompany,
  getStudents,
  getAnalytics,
  type Company,
  type Student,
  type PlacementStats,
} from '../api/adminApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlacementStats | null>(null)
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [statsData, companiesData, studentsData] = await Promise.all([
        getAnalytics(),
        getPendingCompanies(),
        getStudents(),
      ])
      setStats(statsData)
      setPendingCompanies(companiesData)
      setStudents(studentsData)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (companyId: string) => {
    setApprovingId(companyId)
    try {
      await approveCompany(companyId)
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to approve company')
    } finally {
      setApprovingId(null)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            <StatCard label="Students" value={stats.total_students} />
            <StatCard label="Companies" value={stats.total_companies} />
            <StatCard label="Jobs" value={stats.total_jobs} />
            <StatCard label="Applications" value={stats.total_applications} />
            <StatCard label="Selected" value={stats.total_selected} />
            <StatCard label="Pending Approvals" value={stats.pending_company_approvals} highlight />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-3">Pending Company Approvals</h2>
            <div className="space-y-3">
              {pendingCompanies.length === 0 && (
                <p className="text-gray-500 text-sm">No pending approvals.</p>
              )}
              {pendingCompanies.map((company) => (
                <div key={company.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-gray-500">{company.website}</p>
                  </div>
                  <button
                    onClick={() => handleApprove(company.id)}
                    disabled={approvingId === company.id}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {approvingId === company.id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Students</h2>
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="bg-white rounded-lg shadow p-3">
                  <p className="font-medium text-sm">{student.full_name || '(no name set)'}</p>
                  <p className="text-xs text-gray-500">
                    {student.department || 'No department'} • CGPA: {student.cgpa ?? 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg shadow p-4 text-center ${highlight ? 'bg-blue-50' : 'bg-white'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}