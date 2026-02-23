import { create } from 'zustand'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('civictide_token'),
  isAuthenticated: !!localStorage.getItem('civictide_token'),

  setAuth: (user, token) => {
    localStorage.setItem('civictide_token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('civictide_token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
