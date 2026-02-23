import type { ReportCategory, ReportStatus } from '../types'

export const categoryLabels: Record<ReportCategory, string> = {
  road_damage:     '🛣️ Road Damage',
  water_supply:    '💧 Water Supply',
  sanitation:      '🗑️ Sanitation',
  electricity:     '⚡ Electricity',
  flooding:        '🌊 Flooding',
  illegal_dumping: '♻️ Illegal Dumping',
  streetlight:     '💡 Streetlight',
  other:           '📌 Other',
}

export const statusLabels: Record<ReportStatus, string> = {
  reported:     'Reported',
  under_review: 'Under Review',
  in_progress:  'In Progress',
  resolved:     'Resolved',
  rejected:     'Rejected',
}

export const categoryColors: Record<ReportCategory, string> = {
  road_damage:     '#e74c3c',
  water_supply:    '#3498db',
  sanitation:      '#8e44ad',
  electricity:     '#f39c12',
  flooding:        '#1a8fe8',
  illegal_dumping: '#27ae60',
  streetlight:     '#f1c40f',
  other:           '#95a5a6',
}

export const statusColors: Record<ReportStatus, string> = {
  reported:     'blue',
  under_review: 'yellow',
  in_progress:  'orange',
  resolved:     'green',
  rejected:     'red',
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GH', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
