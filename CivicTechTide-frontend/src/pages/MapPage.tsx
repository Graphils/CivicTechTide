import { useEffect, useState } from 'react'
import { reportService } from '../services/report.service'
import CivicMap from '../components/map/CivicMap'
import LocationSearch from '../components/map/LocationSearch'
import { categoryLabels, statusLabels } from '../utils/helpers'
import type { Report, ReportCategory, ReportStatus } from '../types'
import { Filter } from 'lucide-react'

const categories = Object.entries(categoryLabels) as [ReportCategory, string][]
const statuses = Object.entries(statusLabels) as [ReportStatus, string][]

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ReportCategory | ''>('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const [searchedPlace, setSearchedPlace] = useState('')

  useEffect(() => {
    setLoading(true)
    reportService.getAll({
      category: category || undefined,
      status: status || undefined,
    })
      .then((data) => setReports(data.reports))
      .finally(() => setLoading(false))
  }, [category, status])

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setFlyTo([lat, lng])
    setSearchedPlace(name.split(',').slice(0, 2).join(','))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Live Community Map</h1>
          <p className="text-ocean/60 text-sm mt-1">
            {loading ? 'Loading...' : `${reports.length} reports`}
            {searchedPlace && <span className="text-wave font-medium"> · Viewing: {searchedPlace}</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <div className="hidden sm:flex items-center text-ocean/20">|</div>
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={15} className="text-ocean/40 shrink-0" />
          <select value={category} onChange={(e) => setCategory(e.target.value as ReportCategory | '')} className="input py-2 text-sm w-auto">
            <option value="">All Categories</option>
            {categories.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | '')} className="input py-2 text-sm w-auto">
            <option value="">All Statuses</option>
            {statuses.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
          {flyTo && (
            <button onClick={() => { setFlyTo(null); setSearchedPlace('') }} className="text-xs text-ocean/50 hover:text-wave underline transition-colors">
              Clear search
            </button>
          )}
        </div>
      </div>

      <CivicMap reports={reports} height="600px" flyTo={flyTo} />

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ocean/50">
        {categories.map(([val, label]) => (
          <span key={val} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-wave" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
