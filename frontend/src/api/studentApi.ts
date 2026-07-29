import axiosClient from './axiosClient'

export interface StudentProfile {
  id: string
  full_name: string
  department: string | null
  cgpa: number | null
  resume_url: string | null
}

export interface StudentProfileUpdate {
  full_name?: string
  department?: string
  cgpa?: number
}

export const uploadResume = async (file: File): Promise<{ resume_url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axiosClient.post('/students/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const getMyProfile = async (): Promise<StudentProfile> => {
  const res = await axiosClient.get('/students/me')
  return res.data
}

export const updateMyProfile = async (payload: StudentProfileUpdate): Promise<StudentProfile> => {
  const res = await axiosClient.put('/students/me', payload)
  return res.data
}