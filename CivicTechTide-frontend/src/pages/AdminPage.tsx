import { useEffect, useState } from 'react'
import api from '../services/api'
import { reportService } from '../services/report.service'
import { StatusBadge, CategoryBadge } from '../components/ui/Badge'
import { statusLabels, formatRelative } from '../utils/helpers'
import type { Report, DashboardStats, ReportStatus } from '../types'
import toast from 'react-hot-toast'
import { BarChart2, Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        reportService.getAll()
      ])
      setStats(statsRes.data)
      setReports(reportsRes.reports)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const updateStatus = async (id: number, status: ReportStatus) => {
    setUpdatingId(id)
    try {
      await reportService.updateStatus(id, status)
      toast.success('Status updated! Email sent to reporter.')
      loadData()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-2 text-ocean/40">
        <RefreshCw size={18} className="animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-ocean/60 mt-1 text-sm">Manage and resolve community reports</p>
        </div>
        <button onClick={loadData} className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports', value: stats.total_reports, icon: AlertCircle, color: 'text-wave', bg: 'bg-foam' },
            { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-teal-500', bg: 'bg-teal-50' },
            { label: 'Resolved', value: stats.by_status?.resolved || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Resolution Rate', value: `${stats.resolution_rate}%`, icon: BarChart2, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-extrabold text-ocean mb-0.5" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs text-ocean/50">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Reports — Mobile cards view */}
      <div className="block lg:hidden space-y-4 mb-6">
        <h2 className="section-title">All Reports</h2>
        {reports.map((report) => (
          <div key={report.id} className="card">
            <div className="flex flex-wrap gap-2 mb-2">
              <StatusBadge status={report.status} />
              <CategoryBadge category={report.category} />
            </div>
            <h3 className="font-semibold text-ocean text-sm mb-0.5">{report.title}</h3>
            <p className="text-xs text-ocean/40 mb-3">{report.author_name} · {formatRelative(report.created_at)}</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ocean/50 font-medium shrink-0">Update:</label>
              <select
                value={report.status}
                onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                disabled={updatingId === report.id}
                className="input py-1.5 text-xs flex-1"
              >
                {(Object.entries(statusLabels) as [ReportStatus, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {updatingId === report.id && (
                <RefreshCw size={14} className="animate-spin text-wave shrink-0" />
              )}
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="card text-center py-10 text-ocean/30 text-sm">No reports yet.</div>
        )}
      </div>

      {/* Reports — Desktop table view */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
          <h2 className="section-title">All Reports</h2>
          <span className="text-sm text-ocean/40">{reports.length} total</span>
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
                <th className="px-6 py-3 text-left">Update Status</th>
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
                  <td className="px-6 py-4 text-ocean/50 text-xs">{formatRelative(report.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={report.status}
                        onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                        disabled={updatingId === report.id}
                        className="input py-1.5 text-xs w-36"
                      >
                        {(Object.entries(statusLabels) as [ReportStatus, string][]).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      {updatingId === report.id && (
                        <RefreshCw size={14} className="animate-spin text-wave" />
                      )}
                    </div>
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