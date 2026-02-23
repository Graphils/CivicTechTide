import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import type { Report } from '../../types'
import { categoryColors, statusLabels, categoryLabels, formatRelative } from '../../utils/helpers'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createIcon(color: string) {
  return L.divIcon({
    html: `<div style="
      width:28px;height:28px;background:${color};border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
    className: '',
  })
}

function FlyToLocation({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo(target, 15, { duration: 1.2 })
  }, [target, map])
  return null
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng.lat, e.latlng.lng) }
  })
  return null
}

interface MapProps {
  reports: Report[]
  center?: [number, number]
  zoom?: number
  height?: string
  onMapClick?: (lat: number, lng: number) => void
  selectedLocation?: [number, number] | null
  flyTo?: [number, number] | null
}

export default function CivicMap({
  reports,
  center = [5.6037, -0.187],
  zoom = 12,
  height = '500px',
  onMapClick,
  selectedLocation,
  flyTo,
}: MapProps) {
  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-blue-100 shadow-card">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation target={flyTo ?? null} />
        {onMapClick && <ClickHandler onMapClick={onMapClick} />}

        {selectedLocation && (
          <Marker position={selectedLocation} icon={createIcon('#1a8fe8')}>
            <Popup>📍 Selected location</Popup>
          </Marker>
        )}

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createIcon(categoryColors[report.category])}
          >
            <Popup>
              <div style={{ fontFamily: 'DM Sans, sans-serif', minWidth: '180px' }}>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#0a3a66', marginBottom: '4px' }}>
                  {report.title}
                </p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                  {categoryLabels[report.category]}
                </p>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                  {statusLabels[report.status]} · {formatRelative(report.created_at)}
                </p>
                <a href={`/reports/${report.id}`} style={{ fontSize: '12px', color: '#1a8fe8', fontWeight: 600 }}>
                  View details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
