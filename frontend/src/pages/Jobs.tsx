import { useEffect, useState } from 'react'
import { getJobs, type Job } from '../api/jobsApi'
import { applyToJob, getMyApplications, type Application } from '../api/applicationsApi'

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const jobsData = await getJobs()
      setJobs(jobsData)
      try {
        const applicationsData = await getMyApplications()
        setApplications(applicationsData)
      } catch {
        setApplications([]) // non-student roles simply won't have applications
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId)
    try {
      await applyToJob(jobId)
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to apply')
    } finally {
      setApplyingId(null)
    }
  }

  const getApplicationForJob = (jobId: string) =>
    applications.find((a) => a.job_id === jobId)

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading jobs...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Available Jobs</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {jobs.length === 0 && <p className="text-gray-500">No jobs posted yet.</p>}

        <div className="space-y-4">
          {jobs.map((job) => {
            const application = getApplicationForJob(job.id)
            return (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-sm text-gray-500">{job.location} • {job.ctc}</p>
                  </div>
                  {application ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 capitalize">
                      {application.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {applyingId === job.id ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-3">{job.description}</p>
                {job.required_skills && (
                  <p className="text-xs text-gray-500 mt-2">Skills: {job.required_skills}</p>
                )}
                {job.deadline && (
                  <p className="text-xs text-gray-500 mt-1">Deadline: {job.deadline}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}