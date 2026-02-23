import type { ReportStatus, ReportCategory } from '../../types'
import { statusLabels, categoryLabels } from '../../utils/helpers'

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabels[status]}
    </span>
  )
}

export function CategoryBadge({ category }: { category: ReportCategory }) {
  return (
    <span className="badge bg-blue-50 text-ocean">
      {categoryLabels[category]}
    </span>
  )
}
