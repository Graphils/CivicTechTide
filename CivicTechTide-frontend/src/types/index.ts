// ── User ──────────────────────────────────────────────

export interface User {
  id: number
  full_name: string
  email: string
  phone?: string
  is_admin: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ── Reports ───────────────────────────────────────────

export type ReportStatus =
  | 'reported'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected'

export type ReportCategory =
  | 'road_damage'
  | 'water_supply'
  | 'sanitation'
  | 'electricity'
  | 'flooding'
  | 'illegal_dumping'
  | 'streetlight'
  | 'other'

export interface Report {
  id: number
  title: string
  description: string
  category: ReportCategory
  status: ReportStatus
  latitude: number
  longitude: number
  address?: string
  image_url?: string
  resolution_notes?: string
  user_id: number
  author_name?: string
  created_at: string
  updated_at?: string
}

export interface ReportListResponse {
  total: number
  reports: Report[]
}

// ── Forms ─────────────────────────────────────────────

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  full_name: string
  email: string
  password: string
  phone?: string
}

export interface ReportForm {
  title: string
  description: string
  category: ReportCategory
  latitude: number
  longitude: number
  address?: string
  image?: FileList
}

// ── Admin ─────────────────────────────────────────────

export interface DashboardStats {
  total_reports: number
  total_users: number
  resolution_rate: number
  by_status: Record<ReportStatus, number>
  by_category: Record<ReportCategory, number>
}
