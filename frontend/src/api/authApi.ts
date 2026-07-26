import axiosClient from './axiosClient'

export interface RegisterPayload {
  email: string
  password: string
  role: 'student' | 'recruiter'
  full_name?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  role: string
  is_verified: boolean
}

export const registerUser = async (payload: RegisterPayload): Promise<UserResponse> => {
  const res = await axiosClient.post('/auth/register', payload)
  return res.data
}

export const loginUser = async (payload: LoginPayload): Promise<{ access_token: string; token_type: string }> => {
  const res = await axiosClient.post('/auth/login', payload)
  return res.data
}

export const getCurrentUser = async (): Promise<UserResponse> => {
  const res = await axiosClient.get('/me')
  return res.data
}