import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Loader } from 'lucide-react'

interface SearchResult {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

interface Props {
  onLocationSelect: (lat: number, lng: number, name: string) => void
}

export default function LocationSearch({ onLocationSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const searchLocation = async (value: string) => {
    if (value.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=gh`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      setResults(data)
      setShowDropdown(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchLocation(value), 400)
  }

  const handleSelect = (result: SearchResult) => {
    setQuery(result.display_name.split(',').slice(0, 2).join(','))
    setShowDropdown(false)
    onLocationSelect(parseFloat(result.lat), parseFloat(result.lon), result.display_name)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean/40" />
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search area e.g. Accra, Tema..."
          className="input pl-9 pr-10 py-2.5 text-sm"
        />
        {loading && (
          <Loader size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean/40 animate-spin" />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-100 rounded-xl shadow-card overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full flex items-start gap-2.5 px-4 py-3 hover:bg-foam transition-colors text-left border-b border-blue-50 last:border-0"
            >
              <MapPin size={14} className="text-wave mt-0.5 shrink-0" />
              <span className="text-sm text-ocean line-clamp-2 leading-snug">
                {result.display_name}
              </span>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && query.length >= 3 && !loading && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-100 rounded-xl shadow-card px-4 py-3"
          style={{ zIndex: 9999 }}
        >
          <p className="text-sm text-ocean/40 text-center">No locations found in Ghana</p>
        </div>
      )}

    </div>
  )
}