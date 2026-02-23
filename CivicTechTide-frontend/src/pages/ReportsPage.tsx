import { useEffect, useState } from 'react'
import { reportService } from '../services/report.service'
import ReportCard from '../components/reports/ReportCard'
import { categoryLabels, statusLabels } from '../utils/helpers'
import type { Report, ReportCategory, ReportStatus } from '../types'
import { Search } from 'lucide-react'

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ReportCategory | ''>('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    reportService.getAll({ category: category || undefined, status: status || undefined })
      .then((data) => setReports(data.reports))
      .finally(() => setLoading(false))
  }, [category, status])

  const filtered = reports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <div className="mb-8">
        <h1 className="page-title">Community Reports</h1>
        <p className="text-ocean/60 mt-1">{loading ? 'Loading...' : `${filtered.length} reports found`}</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search reports..."
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value as ReportCategory | '')} className="input sm:w-48">
          <option value="">All Categories</option>
          {(Object.entries(categoryLabels) as [ReportCategory, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | '')} className="input sm:w-44">
          <option value="">All Statuses</option>
          {(Object.entries(statusLabels) as [ReportStatus, string][]).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-36 bg-blue-50 rounded-xl mb-4" />
              <div className="h-4 bg-blue-50 rounded mb-2 w-3/4" />
              <div className="h-3 bg-blue-50 rounded w-full mb-1" />
              <div className="h-3 bg-blue-50 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-ocean/40">
          <p className="text-lg font-semibold" style={{ fontFamily: 'Syne, sans-serif' }}>No reports found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
