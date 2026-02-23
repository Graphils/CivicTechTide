import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportService } from '../services/report.service'
import CivicMap from '../components/map/CivicMap'
import { StatusBadge, CategoryBadge } from '../components/ui/Badge'
import { formatDate } from '../utils/helpers'
import type { Report } from '../types'
import { ArrowLeft, MapPin, Clock, User, FileText } from 'lucide-react'
import { VoteButton, CommentsSection } from '../components/reports/Engagement'

export default function ReportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    reportService.getById(Number(id))
      .then(setReport)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-ocean/40">
      Loading report...
    </div>
  )

  if (notFound || !report) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-xl font-bold text-ocean/40" style={{ fontFamily: 'Syne, sans-serif' }}>Report not found</p>
      <button onClick={() => navigate('/reports')} className="btn-primary mt-4">
        Back to Reports
      </button>
    </div>
  )

  const statusSteps = ['reported', 'under_review', 'in_progress', 'resolved']
  const currentStep = statusSteps.indexOf(report.status)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">

      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ocean/60 hover:text-wave mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Reports
      </button>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge status={report.status} />
          <CategoryBadge category={report.category} />
        </div>

        <h1 className="page-title mb-4">{report.title}</h1>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-ocean/60 mb-4">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>Reported by {report.author_name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatDate(report.created_at)}</span>
          </div>
          {report.address && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{report.address}</span>
            </div>
          )}
        </div>

        <p className="text-ocean/70 leading-relaxed mb-5">{report.description}</p>

        {/* Vote button */}
        <div className="pt-4 border-t border-blue-50">
          <VoteButton reportId={report.id} />
        </div>
      </div>

      {/* Progress tracker */}
      {report.status !== 'rejected' && (
        <div className="card mb-6">
          <h2 className="section-title mb-5">Report Progress</h2>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-0 right-0 top-4 h-1 bg-blue-100 z-0" />
            <div
              className="absolute left-0 top-4 h-1 bg-wave z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10 gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                  ${i <= currentStep
                    ? 'bg-wave border-wave text-white'
                    : 'bg-white border-blue-100 text-ocean/30'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium capitalize text-center leading-tight max-w-16
                  ${i <= currentStep ? 'text-wave' : 'text-ocean/30'}`}
                  style={{ fontFamily: 'Syne, sans-serif' }}>
                  {step.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo */}
      {report.image_url && (
        <div className="card mb-6 p-0 overflow-hidden">
          <img
            src={report.image_url}
            alt="Report photo"
            className="w-full max-h-80 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Map */}
      <div className="card mb-6">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-wave" /> Location
        </h2>
        <CivicMap
          reports={[report]}
          center={[report.latitude, report.longitude]}
          zoom={15}
          height="300px"
        />
      </div>

      {/* Resolution notes */}
      {report.resolution_notes && (
        <div className="card mb-6 border-l-4 border-teal-500">
          <h2 className="section-title mb-2 flex items-center gap-2">
            <FileText size={18} className="text-teal-500" /> Resolution Notes
          </h2>
          <p className="text-ocean/70 leading-relaxed">{report.resolution_notes}</p>
        </div>
      )}

      {/* Comments */}
      <CommentsSection reportId={report.id} />

    </div>
  )
}
