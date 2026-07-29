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
import { downloadCSV } from '../utils/csvExport'

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

  const handleExportStudents = () => {
    downloadCSV(
      'students.csv',
      students.map((s) => ({
        Name: s.full_name || '',
        Department: s.department || '',
        CGPA: s.cgpa ?? '',
      }))
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Placement overview and management</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            <StatCard label="Students" value={stats.total_students} />
            <StatCard label="Companies" value={stats.total_companies} />
            <StatCard label="Jobs" value={stats.total_jobs} />
            <StatCard label="Applications" value={stats.total_applications} />
            <StatCard label="Selected" value={stats.total_selected} accent="green" />
            <StatCard label="Pending Approvals" value={stats.pending_company_approvals} accent="amber" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Pending Company Approvals</h2>
            <div className="space-y-3">
              {pendingCompanies.length === 0 && (
                <p className="text-gray-400 text-sm">No pending approvals.</p>
              )}
              {pendingCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.website}</p>
                  </div>
                  <button
                    onClick={() => handleApprove(company.id)}
                    disabled={approvingId === company.id}
                    className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-xs font-medium transition"
                  >
                    {approvingId === company.id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Students</h2>
              <button
                onClick={handleExportStudents}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
            </div>
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="border border-gray-100 rounded-xl px-4 py-3">
                  <p className="font-medium text-gray-900 text-sm">{student.full_name || '(no name set)'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
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

function StatCard({ label, value, accent }: { label: string; value: number; accent?: 'green' | 'amber' }) {
  const colors =
    accent === 'green'
      ? 'bg-green-50 text-green-700'
      : accent === 'amber'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-white text-gray-900'
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-100 p-4 text-center ${colors}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70 mt-1">{label}</p>
    </div>
  )
}