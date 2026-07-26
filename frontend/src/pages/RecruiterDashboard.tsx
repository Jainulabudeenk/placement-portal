import { useEffect, useState } from 'react'
import { getMyJobs, createJob, type Job } from '../api/jobsApi'
import { getApplicantsForJob, updateApplicationStatus, type Application } from '../api/applicationsApi'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = ['applied', 'shortlisted', 'interview', 'selected', 'rejected']

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [applicants, setApplicants] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    required_skills: '',
    ctc: '',
    location: '',
    deadline: '',
  })

 const loadJobs = async () => {
    try {
      const data = await getMyJobs()
      setJobs(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await createJob(form)
      setForm({ title: '', description: '', required_skills: '', ctc: '', location: '', deadline: '' })
      setShowForm(false)
      await loadJobs()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to post job')
    }
  }

  const viewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId)
    setError('')
    try {
      const data = await getApplicantsForJob(jobId)
      setApplicants(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load applicants')
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, newStatus)
      if (selectedJobId) await viewApplicants(selectedJobId)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update status')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Recruiter Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            {showForm ? 'Cancel' : '+ Post Job'}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {showForm && (
          <form onSubmit={handlePostJob} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-3">
            <input
              type="text" placeholder="Job title" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text" placeholder="Required skills (comma-separated)"
              value={form.required_skills}
              onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="CTC"
                value={form.ctc}
                onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text" placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              Post Job
            </button>
          </form>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-3">Your Jobs</h2>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => viewApplicants(job.id)}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer border-2 ${
                    selectedJobId === job.id ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.location} • {job.ctc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Applicants</h2>
            {!selectedJobId && <p className="text-gray-500 text-sm">Select a job to view applicants</p>}
            <div className="space-y-3">
              {applicants.map((app) => (
                <div key={app.id} className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-500 mb-2">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm capitalize"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
              {selectedJobId && applicants.length === 0 && (
                <p className="text-gray-500 text-sm">No applicants yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}