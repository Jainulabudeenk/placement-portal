import { useEffect, useState } from 'react'
import { getJobs, type Job } from '../api/jobsApi'
import { applyToJob, getMyApplications, type Application } from '../api/applicationsApi'
import { uploadResume, getMyProfile, updateMyProfile, type StudentProfile } from '../api/studentApi'

const STATUS_STYLES: Record<string, string> = {
  applied: 'bg-gray-100 text-gray-700',
  shortlisted: 'bg-blue-100 text-blue-700',
  interview: 'bg-amber-100 text-amber-700',
  selected: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const [editingProfile, setEditingProfile] = useState(false)
  const [department, setDepartment] = useState('')
  const [cgpa, setCgpa] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const loadData = async () => {
    try {
      const jobsData = await getJobs()
      setJobs(jobsData)
      try {
        const applicationsData = await getMyApplications()
        setApplications(applicationsData)
      } catch {
        setApplications([])
      }
      try {
        const profileData = await getMyProfile()
        setProfile(profileData)
        setDepartment(profileData.department || '')
        setCgpa(profileData.cgpa?.toString() || '')
      } catch {
        setProfile(null)
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

  const handleResumeUpload = async () => {
    if (!resumeFile) return
    setUploading(true)
    setUploadSuccess(false)
    try {
      await uploadResume(resumeFile)
      setUploadSuccess(true)
      setResumeFile(null)
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await updateMyProfile({
        department: department || undefined,
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
      })
      setEditingProfile(false)
      await loadData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const getApplicationForJob = (jobId: string) =>
    applications.find((a) => a.job_id === jobId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and apply to open positions</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Profile</h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g. 8.2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
                >
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="text-gray-500 px-4 py-2 text-sm font-medium hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="text-gray-900 font-medium">{profile?.department || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">CGPA</p>
                <p className="text-gray-900 font-medium">{profile?.cgpa ?? 'Not set'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">Resume</h2>
          <p className="text-sm text-gray-500 mb-4">Upload your resume so recruiters can view it with your applications</p>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleResumeUpload}
              disabled={!resumeFile || uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {uploadSuccess && (
            <p className="text-green-600 text-sm mt-3">Resume uploaded successfully.</p>
          )}
          {profile && profile.resume_url ? (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-3">
              View current resume
            </a>
          ) : null}
        </div>

        {jobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No jobs posted yet. Check back soon.</p>
          </div>
        )}

        <div className="space-y-4">
          {jobs.map((job) => {
            const application = getApplicationForJob(job.id)
            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{job.location} • {job.ctc}</p>
                  </div>
                  {application ? (
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
                        STATUS_STYLES[application.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {application.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition whitespace-nowrap"
                    >
                      {applyingId === job.id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
                {job.description && (
                  <p className="text-sm text-gray-600 mt-4">{job.description}</p>
                )}
                {job.required_skills && (
                  <p className="text-xs text-gray-500 mt-3">
                    <span className="font-medium">Skills:</span> {job.required_skills}
                  </p>
                )}
                {job.deadline && (
                  <p className="text-xs text-gray-400 mt-1">Apply before {job.deadline}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}