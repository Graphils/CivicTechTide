import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportService } from '../services/report.service'
import ReportCard from '../components/reports/ReportCard'
import { useAuthStore } from '../hooks/useAuthStore'
import { Plus, FileText } from 'lucide-react'
import type { Report } from '../types'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService.getMyReports()
      .then((data) => setReports(data.reports))
      .finally(() => setLoading(false))
  }, [])

  const resolved = reports.filter(r => r.status === 'resolved').length
  const pending  = reports.filter(r => r.status !== 'resolved' && r.status !== 'rejected').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Welcome, {user?.full_name.split(' ')[0]} 👋</h1>
          <p className="text-ocean/60 mt-1">Track all the issues you've reported</p>
        </div>
        <Link to="/submit" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Reports', value: reports.length, color: 'bg-foam text-wave' },
          { label: 'In Progress', value: pending, color: 'bg-orange-50 text-orange-600' },
          { label: 'Resolved', value: resolved, color: 'bg-green-50 text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card text-center ${color}`}>
            <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
            <div className="text-xs font-medium opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Reports */}
      <h2 className="section-title mb-4">Your Reports</h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-blue-50 rounded mb-2 w-3/4" />
              <div className="h-3 bg-blue-50 rounded w-full mb-1" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={40} className="text-ocean/20 mx-auto mb-3" />
          <p className="font-semibold text-ocean/40" style={{ fontFamily: 'Syne, sans-serif' }}>No reports yet</p>
          <p className="text-sm text-ocean/30 mt-1 mb-4">Be the first to report an issue in your community</p>
          <Link to="/submit" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Submit Your First Report
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {reports.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  )
}
