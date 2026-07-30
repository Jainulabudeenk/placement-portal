import axiosClient from './axiosClient'

export interface Application {
  id: string
  student_id: string
  job_id: string
  status: string
  applied_at: string
  resume_snapshot_url: string | null
}

export interface Applicant {
  id: string
  student_id: string
  job_id: string
  status: string
  applied_at: string
  resume_url: string | null
  student_name: string
}

export const applyToJob = async (jobId: string): Promise<Application> => {
  const res = await axiosClient.post('/applications/', { job_id: jobId })
  return res.data
}

export const getMyApplications = async (): Promise<Application[]> => {
  const res = await axiosClient.get('/applications/my')
  return res.data
}

export const getApplicantsForJob = async (jobId: string): Promise<Applicant[]> => {
  const res = await axiosClient.get(`/applications/job/${jobId}`)
  return res.data
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
): Promise<Application> => {
  const res = await axiosClient.patch(`/applications/${applicationId}/status`, { status })
  return res.data
}