import { Link } from 'react-router-dom'
import { MapPin, Camera, Bell, Shield, ArrowRight, Users, CheckCircle, AlertCircle } from 'lucide-react'

export default function HomePage() {
  const stats = [
    { label: 'Issues Reported', value: '1,200+', icon: AlertCircle },
    { label: 'Resolved', value: '840+', icon: CheckCircle },
    { label: 'Communities', value: '32', icon: Users },
  ]

  const steps = [
    { icon: Camera, title: 'Snap & Report', desc: 'Take a photo of the issue, add a description and your GPS location is auto-detected.' },
    { icon: MapPin, title: 'Goes on the Map', desc: 'Your report appears instantly on the public community map for everyone to see.' },
    { icon: Bell, title: 'Track Progress', desc: 'Get email updates as local authorities review and resolve your report.' },
    { icon: Shield, title: 'Accountability', desc: 'All reports are public and timestamped — no issue gets buried or forgotten.' },
  ]

  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ocean via-primary-700 to-wave text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #2ec4b6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #9dcff5 0%, transparent 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span style={{ fontFamily: 'DM Sans, sans-serif' }}>Live community reporting — Ghana</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Your Voice.<br />
              Your <span className="text-teal-400">Community.</span><br />
              Your Change.
            </h1>

            <p className="text-xl text-white/75 mb-10 leading-relaxed max-w-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Report broken roads, burst pipes, illegal dumping and more — with photos and your GPS location. Hold local authorities accountable.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-ocean font-bold px-7 py-3.5 rounded-xl hover:bg-foam transition-colors text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                Report an Issue <ArrowRight size={18} />
              </Link>
              <Link to="/map" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                <MapPin size={18} /> View Live Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-foam rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-wave" />
                </div>
                <div className="text-3xl font-extrabold text-ocean mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
                <div className="text-sm text-ocean/60">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-ocean mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>How CivicTide Works</h2>
          <p className="text-ocean/60 text-lg max-w-xl mx-auto">Three simple steps to make your community's problems visible and impossible to ignore.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
              <div className="absolute top-4 right-4 text-5xl font-black text-ocean/5 select-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="w-12 h-12 bg-foam rounded-2xl flex items-center justify-center mb-4 group-hover:bg-wave transition-colors duration-200">
                <Icon size={22} className="text-wave group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="section-title text-base mb-2">{title}</h3>
              <p className="text-sm text-ocean/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ocean text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to make a difference?
          </h2>
          <p className="text-white/70 text-lg mb-8">Join thousands of Ghanaians holding their communities accountable.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-wave text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-600 transition-colors text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
