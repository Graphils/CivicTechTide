import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ocean text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-wave rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
                Civic<span className="text-teal-400">Tide</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">Your Voice. Your Community. Your Change.</p>
            <p className="text-xs mt-2 text-white/40">A product by TechTide Stratum</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/map" className="hover:text-teal-400 transition-colors">Live Map</Link></li>
              <li><Link to="/reports" className="hover:text-teal-400 transition-colors">All Reports</Link></li>
              <li><Link to="/submit" className="hover:text-teal-400 transition-colors">Report an Issue</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>About</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/50">BSc Software Engineering</li>
              <li className="text-white/50">Ghana Communication Technology University</li>
              <li className="text-white/50">© {new Date().getFullYear()} TechTide Stratum</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}
