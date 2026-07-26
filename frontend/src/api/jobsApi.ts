import axiosClient from './axiosClient'

export interface Job {
  id: string
  company_id: string
  posted_by: string
  title: string
  description: string | null
  required_skills: string | null
  ctc: string | null
  location: string | null
  deadline: string | null
  created_at: string
}

export interface JobCreatePayload {
  title: string
  description?: string
  required_skills?: string
  ctc?: string
  location?: string
  deadline?: string
}

export const getJobs = async (): Promise<Job[]> => {
  const res = await axiosClient.get('/jobs/')
  return res.data
}

export const createJob = async (payload: JobCreatePayload): Promise<Job> => {
  const res = await axiosClient.post('/jobs/', payload)
  return res.data
}
export const getMyJobs = async (): Promise<Job[]> => {
  const res = await axiosClient.get('/jobs/my')
  return res.data
}