import { useEffect, useState } from 'react'
import { getMyJobs, createJob, type Job } from '../api/jobsApi'
import { getApplicantsForJob, updateApplicationStatus, type Applicant } from '../api/applicationsApi'
import { downloadCSV } from '../utils/csvExport'

const STATUS_OPTIONS = ['applied', 'shortlisted', 'interview', 'selected', 'rejected']

const STATUS_STYLES: Record<string, string> = {
  applied: 'border-gray-200 text-gray-700',
  shortlisted: 'border-blue-200 text-blue-700 bg-blue-50',
  interview: 'border-amber-200 text-amber-700 bg-amber-50',
  selected: 'border-green-200 text-green-700 bg-green-50',
  rejected: 'border-red-200 text-red-700 bg-red-50',
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [applicants, setApplicants] = useState<Applicant[]>([])
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

  const viewApplicants = async (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId)
    setSelectedJobTitle(jobTitle)
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
      if (selectedJobId) await viewApplicants(selectedJobId, selectedJobTitle)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update status')
    }
  }

  const handleExportApplicants = () => {
    downloadCSV(
      `${selectedJobTitle || 'applicants'}.csv`,
      applicants.map((a) => ({
        Name: a.student_name,
        'Applied Date': new Date(a.applied_at).toLocaleDateString(),
        Status: a.status,
        'Resume URL': a.resume_url || 'Not uploaded',
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
            <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your job postings and applicants</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
          >
            {showForm ? 'Cancel' : '+ Post Job'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handlePostJob} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6 space-y-3">
            <input
              type="text" placeholder="Job title" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text" placeholder="Required skills (comma-separated)"
              value={form.required_skills}
              onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="CTC"
                value={form.ctc}
                onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                className="border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text" placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
              Post Job
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Jobs</h2>
            <div className="space-y-3">
              {jobs.length === 0 && <p className="text-gray-400 text-sm">No jobs posted yet.</p>}
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => viewApplicants(job.id, job.title)}
                  className={`cursor-pointer rounded-xl px-4 py-3 border transition ${
                    selectedJobId === job.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{job.location} • {job.ctc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Applicants</h2>
              {selectedJobId && applicants.length > 0 && (
                <button
                  onClick={handleExportApplicants}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </button>
              )}
            </div>
            {!selectedJobId && <p className="text-gray-400 text-sm">Select a job to view applicants</p>}
            <div className="space-y-3">
             {applicants.map((app) => (
                <div key={app.id} className="border border-gray-100 rounded-xl px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">{app.student_name}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`border rounded-lg px-3 py-1.5 text-xs font-medium capitalize focus:outline-none ${STATUS_STYLES[app.status] || ''}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {app.resume_url ? (
                      <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-lg px-3 py-1.5">
                        View Resume
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5">
                        No resume
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {selectedJobId && applicants.length === 0 && (
                <p className="text-gray-400 text-sm">No applicants yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}