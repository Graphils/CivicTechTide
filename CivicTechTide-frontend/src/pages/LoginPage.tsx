import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MapPin, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../hooks/useAuthStore'
import type { LoginForm } from '../types'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authService.login(data)
      setAuth(res.user, res.access_token)
      toast.success(`Welcome back, ${res.user.full_name.split(' ')[0]}!`)
      navigate(res.user.is_admin ? '/admin' : '/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 page-enter">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-wave rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <MapPin size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-ocean" style={{ fontFamily: 'Syne, sans-serif' }}>
            Welcome back
          </h1>
          <p className="text-ocean/60 mt-1">Sign in to your CivicTide account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="input"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean/40 hover:text-ocean">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ocean/60 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-wave font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
