import { Link } from 'react-router-dom'
import { MapPin, Clock, ChevronRight } from 'lucide-react'
import type { Report } from '../../types'
import { StatusBadge, CategoryBadge } from '../ui/Badge'
import { formatRelative } from '../../utils/helpers'

interface Props {
  report: Report
}

export default function ReportCard({ report }: Props) {
  return (
    <Link to={`/reports/${report.id}`} className="block group">
      <div className="card hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 border border-blue-50 group-hover:border-wave/30">

        {/* Image */}
        {report.image_url && (
          <div className="h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
            <img
              src={report.image_url}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge status={report.status} />
          <CategoryBadge category={report.category} />
        </div>

        {/* Title */}
        <h3 className="section-title text-base mb-1.5 group-hover:text-wave transition-colors line-clamp-2">
          {report.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-ocean/60 line-clamp-2 mb-3">
          {report.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-ocean/50 pt-3 border-t border-blue-50">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{report.address || `${report.latitude.toFixed(3)}, ${report.longitude.toFixed(3)}`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatRelative(report.created_at)}</span>
          </div>
        </div>

      </div>
    </Link>
  )
}
