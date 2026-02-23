import { useEffect, useState } from 'react'
import api from '../services/api'
import { reportService } from '../services/report.service'
import { StatusBadge, CategoryBadge } from '../components/ui/Badge'
import { statusLabels, formatRelative } from '../utils/helpers'
import type { Report, DashboardStats, ReportStatus } from '../types'
import toast from 'react-hot-toast'
import { BarChart2, Users, CheckCircle, AlertCircle, RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_ORDER: ReportStatus[] = ['reported', 'under_review', 'in_progress', 'resolved', 'rejected']

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string; border: string }> = {
  reported:     { label: 'Reported',     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  under_review: { label: 'Under Review', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  in_progress:  { label: 'In Progress',  color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  resolved:     { label: 'Resolved',     color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  rejected:     { label: 'Rejected',     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [clearingStatus, setClearingStatus] = useState<ReportStatus | null>(null)
  const [collapsed, setCollapsed] = useState<Record<ReportStatus, boolean>>({
    reported: false,
    under_review: false,
    in_progress: false,
    resolved: true,
    rejected: true,
  })

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
      toast.success('Status updated!')
      loadData()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteReport = async (id: number) => {
    if (!confirm('Delete this report? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await api.delete(`/reports/${id}`)
      toast.success('Report deleted')
      loadData()
    } catch {
      toast.error('Failed to delete report')
    } finally {
      setDeletingId(null)
    }
  }

  const clearByStatus = async (status: ReportStatus) => {
    const group = groupedReports[status] || []
    if (!confirm(`Clear all ${group.length} ${STATUS_CONFIG[status].label} reports? This cannot be undone.`)) return
    setClearingStatus(status)
    try {
      await Promise.all(group.map(r => api.delete(`/reports/${r.id}`)))
      toast.success(`Cleared all ${STATUS_CONFIG[status].label} reports!`)
      loadData()
    } catch {
      toast.error('Failed to clear reports')
    } finally {
      setClearingStatus(null)
    }
  }

  const toggleCollapse = (status: ReportStatus) => {
    setCollapsed(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const groupedReports = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = reports.filter(r => r.status === status)
    return acc
  }, {} as Record<ReportStatus, Report[]>)

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

      {/* Grouped Reports by Status */}
      <div className="space-y-4">
        {STATUS_ORDER.map((status) => {
          const group = groupedReports[status] || []
          const config = STATUS_CONFIG[status]
          const isCollapsed = collapsed[status]

          return (
            <div key={status} className={`border-2 ${config.border} rounded-2xl overflow-hidden`}>

              {/* Group Header */}
              <div className={`${config.bg} px-5 py-4 flex items-center gap-3`}>
                <button
                  onClick={() => toggleCollapse(status)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span className={`font-bold text-base ${config.color}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                    {config.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${config.color}`}>
                    {group.length}
                  </span>
                  {isCollapsed
                    ? <ChevronDown size={16} className={`${config.color} ml-1`} />
                    : <ChevronUp size={16} className={`${config.color} ml-1`} />
                  }
                </button>

                {/* Clear All button */}
                {group.length > 0 && (
                  <button
                    onClick={() => clearByStatus(status)}
                    disabled={clearingStatus === status}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {clearingStatus === status
                      ? <RefreshCw size={12} className="animate-spin" />
                      : <Trash2 size={12} />
                    }
                    Clear All
                  </button>
                )}
              </div>

              {/* Reports list */}
              {!isCollapsed && (
                <div className="divide-y divide-blue-50 bg-white">
                  {group.length === 0 ? (
                    <div className="px-5 py-8 text-center text-ocean/30 text-sm">
                      No {config.label.toLowerCase()} reports
                    </div>
                  ) : (
                    group.map((report) => (
                      <div key={report.id} className="px-5 py-4 hover:bg-foam/30 transition-colors">

                        {/* Mobile */}
                        <div className="flex flex-col gap-3 sm:hidden">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-ocean text-sm leading-tight">{report.title}</p>
                              <p className="text-xs text-ocean/40 mt-0.5">{report.author_name} · {formatRelative(report.created_at)}</p>
                            </div>
                            <CategoryBadge category={report.category} />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={report.status}
                              onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                              disabled={updatingId === report.id}
                              className="input py-1.5 text-xs flex-1"
                            >
                              {STATUS_ORDER.map(s => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteReport(report.id)}
                              disabled={deletingId === report.id}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            >
                              {deletingId === report.id
                                ? <RefreshCw size={14} className="animate-spin" />
                                : <Trash2 size={14} />
                              }
                            </button>
                          </div>
                        </div>

                        {/* Desktop */}
                        <div className="hidden sm:flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ocean text-sm truncate">{report.title}</p>
                            <p className="text-xs text-ocean/40 mt-0.5">{report.author_name} · {formatRelative(report.created_at)}</p>
                          </div>
                          <CategoryBadge category={report.category} />
                          <select
                            value={report.status}
                            onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                            disabled={updatingId === report.id}
                            className="input py-1.5 text-xs w-36 shrink-0"
                          >
                            {STATUS_ORDER.map(s => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                          {updatingId === report.id && (
                            <RefreshCw size={14} className="animate-spin text-wave shrink-0" />
                          )}
                          <button
                            onClick={() => deleteReport(report.id)}
                            disabled={deletingId === report.id}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            {deletingId === report.id
                              ? <RefreshCw size={14} className="animate-spin" />
                              : <Trash2 size={14} />
                            }
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}