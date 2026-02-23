import api from './api'
import type { LoginForm, RegisterForm } from '../types'

export const authService = {
  async login(data: LoginForm) {
    const res = await api.post('/auth/login', data)
    return res.data
  },

  async register(data: RegisterForm) {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  async getMe() {
    const res = await api.get('/auth/me')
    return res.data
  },
}
