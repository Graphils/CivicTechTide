import api from './api'
import type { ReportCategory, ReportStatus } from '../types'

export const reportService = {
  async getAll(params?: { category?: ReportCategory; status?: ReportStatus }) {
    const res = await api.get('/reports/', { params })
    return res.data
  },

  async getById(id: number) {
    const res = await api.get(`/reports/${id}`)
    return res.data
  },

  async getMyReports() {
    const res = await api.get('/reports/my/reports')
    return res.data
  },

  async create(formData: FormData) {
    const res = await api.post('/reports/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async updateStatus(id: number, status: ReportStatus, resolution_notes?: string) {
    const res = await api.patch(`/reports/${id}/status`, { status, resolution_notes })
    return res.data
  },

  async delete(id: number) {
    await api.delete(`/reports/${id}`)
  },
}
