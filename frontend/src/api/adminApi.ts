import axiosClient from './axiosClient'

export interface Company {
  id: string
  name: string
  description: string | null
  website: string | null
  is_approved: boolean
}

export interface Student {
  id: string
  full_name: string
  department: string | null
  cgpa: number | null
}

export interface PlacementStats {
  total_students: number
  total_companies: number
  total_jobs: number
  total_applications: number
  total_selected: number
  pending_company_approvals: number
}

export const getPendingCompanies = async (): Promise<Company[]> => {
  const res = await axiosClient.get('/admin/companies/pending')
  return res.data
}

export const approveCompany = async (companyId: string): Promise<Company> => {
  const res = await axiosClient.patch(`/admin/companies/${companyId}/approve`)
  return res.data
}

export const getStudents = async (): Promise<Student[]> => {
  const res = await axiosClient.get('/admin/students')
  return res.data
}

export const getAnalytics = async (): Promise<PlacementStats> => {
  const res = await axiosClient.get('/admin/analytics')
  return res.data
}