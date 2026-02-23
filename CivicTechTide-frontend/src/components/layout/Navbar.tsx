import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, LogOut, User, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { to: '/map', label: 'Live Map', show: true },
    { to: '/reports', label: 'Reports', show: true },
    { to: '/submit', label: 'Report Issue', show: isAuthenticated },
    { to: '/dashboard', label: 'My Reports', show: isAuthenticated },
    { to: '/admin', label: 'Admin', show: isAuthenticated && user?.is_admin },
  ].filter(link => link.show)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
              <div className="w-8 h-8 bg-wave rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-ocean text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Civic<span className="text-wave">Tide</span>
                </span>
                <span className="hidden sm:block text-[10px] text-ocean/40 leading-none -mt-0.5">
                  by TechTide Stratum
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`font-medium text-sm transition-colors duration-150 px-3 py-1.5 rounded-lg
                    ${isActive(to)
                      ? 'text-wave bg-foam'
                      : 'text-ocean/70 hover:text-wave hover:bg-foam'}`}
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-ocean/70">
                    <div className="w-7 h-7 rounded-full bg-wave flex items-center justify-center text-white text-xs font-bold">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{user?.full_name.split(' ')[0]}</span>
                  </div>
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
            <button
              className="md:hidden p-2 rounded-xl text-ocean hover:bg-foam transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-wave rounded-lg flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold text-ocean" style={{ fontFamily: 'Syne, sans-serif' }}>
              Civic<span className="text-wave">Tide</span>
            </span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-foam text-ocean/50">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        {isAuthenticated && (
          <div className="px-5 py-4 bg-foam border-b border-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-wave flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-ocean text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {user?.full_name}
                </p>
                <p className="text-xs text-ocean/50">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="px-3 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive(to)
                  ? 'bg-wave text-white'
                  : 'text-ocean hover:bg-foam'}`}
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {label}
              <ChevronRight size={16} className="opacity-50" />
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-6 border-t border-blue-50 bg-white">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-wave border-2 border-wave hover:bg-foam transition-colors"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold bg-wave text-white hover:bg-primary-700 transition-colors"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </>
  )
}