import { useEffect, useState } from 'react'
import api from '../services/api'
import { reportService } from '../services/report.service'
import { StatusBadge, CategoryBadge } from '../components/ui/Badge'
import { statusLabels, formatRelative } from '../utils/helpers'
import type { Report, DashboardStats, ReportStatus } from '../types'
import toast from 'react-hot-toast'
import { BarChart2, Users, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        reportService.getAll()
      ])
      setStats(statsRes.data)
      setReports(reportsRes.reports)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const updateStatus = async (id: number, status: ReportStatus) => {
    try {
      await reportService.updateStatus(id, status)
      toast.success('Status updated!')
      loadData()
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-ocean/40 text-sm">Loading dashboard...</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-ocean/60 mt-1">Manage and resolve community reports</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Reports', value: stats.total_reports, icon: AlertCircle, color: 'text-wave' },
            { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-teal-500' },
            { label: 'Resolved', value: stats.by_status.resolved || 0, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Resolution Rate', value: `${stats.resolution_rate}%`, icon: BarChart2, color: 'text-orange-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <Icon size={22} className={`${color} mb-2`} />
              <div className="text-2xl font-extrabold text-ocean mb-0.5" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs text-ocean/50">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reports Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-blue-50">
          <h2 className="section-title">All Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-foam text-ocean/60 text-xs font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Reported</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, i) => (
                <tr key={report.id} className={`border-b border-blue-50 hover:bg-foam/50 transition-colors ${i % 2 === 0 ? '' : 'bg-blue-50/20'}`}>
                  <td className="px-6 py-4 text-ocean/40 font-mono text-xs">{report.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-ocean line-clamp-1">{report.title}</div>
                    <div className="text-xs text-ocean/40 mt-0.5">{report.author_name}</div>
                  </td>
                  <td className="px-6 py-4"><CategoryBadge category={report.category} /></td>
                  <td className="px-6 py-4"><StatusBadge status={report.status} /></td>
                  <td className="px-6 py-4 text-ocean/50">{formatRelative(report.created_at)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                      className="input py-1.5 text-xs w-36"
                    >
                      {(Object.entries(statusLabels) as [ReportStatus, string][]).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="text-center py-12 text-ocean/30 text-sm">No reports yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
