import axiosClient from './axiosClient'

export const uploadResume = async (file: File): Promise<{ resume_url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axiosClient.post('/students/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}