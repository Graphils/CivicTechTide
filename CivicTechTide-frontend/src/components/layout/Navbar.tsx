import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Bell, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`font-medium text-sm transition-colors duration-150 px-3 py-1.5 rounded-lg
        ${location.pathname === to
          ? 'text-wave bg-foam'
          : 'text-ocean/70 hover:text-wave hover:bg-foam'}`}
      style={{ fontFamily: 'Syne, sans-serif' }}
    >
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-wave rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-ocean text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
                Civic<span className="text-wave">Tide</span>
              </span>
              <span className="hidden sm:block text-[10px] text-ocean/40 leading-none -mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                by TechTide Stratum
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/map', 'Live Map')}
            {navLink('/reports', 'Reports')}
            {isAuthenticated && navLink('/submit', 'Report Issue')}
            {isAuthenticated && user?.is_admin && navLink('/admin', 'Admin')}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-ocean/70 hover:text-wave transition-colors">
                  <User size={16} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{user?.full_name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost flex items-center gap-1.5 text-sm text-red-400 hover:bg-red-50">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-ocean hover:bg-foam" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-50 px-4 pb-4 pt-2 space-y-1">
          {navLink('/map', 'Live Map')}
          {navLink('/reports', 'Reports')}
          {isAuthenticated && navLink('/submit', 'Report Issue')}
          {isAuthenticated && navLink('/dashboard', 'My Reports')}
          {isAuthenticated && user?.is_admin && navLink('/admin', 'Admin Dashboard')}
          <div className="pt-2 border-t border-blue-50 mt-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 font-medium">
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-outline text-sm flex-1 text-center">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm flex-1 text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
