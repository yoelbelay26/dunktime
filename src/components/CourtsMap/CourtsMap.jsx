import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'

const CITY_COORDS = {
  'תל אביב':      [32.0853, 34.7818],
  'ירושלים':      [31.7683, 35.2137],
  'חיפה':         [32.7940, 34.9896],
  'באר שבע':      [31.2530, 34.7915],
  'נתניה':        [32.3215, 34.8532],
  'אשדוד':        [31.8044, 34.6553],
  'ראשון לציון':  [31.9730, 34.7925],
  'פתח תקווה':    [32.0879, 34.8867],
  'רמת גן':       [32.0680, 34.8240],
  'הרצליה':       [32.1650, 34.8440],
  'בני ברק':      [32.0830, 34.8338],
  'חולון':        [32.0115, 34.7737],
  'בת ים':        [32.0231, 34.7501],
  'רעננה':        [32.1838, 34.8708],
  'כפר סבא':      [32.1750, 34.9067],
  'הוד השרון':    [32.1500, 34.8900],
  'מודיעין':      [31.8986, 35.0127],
  'אשקלון':       [31.6688, 34.5744],
  'רחובות':       [31.8954, 34.8113],
}

export function getCoords(court) {
  const center = CITY_COORDS[court.city]
  if (!center) return null
  const angle = (court.id * 137.508) % 360
  const radius = 0.003 + (court.id % 6) * 0.0015
  return [
    center[0] + Math.sin(angle * Math.PI / 180) * radius,
    center[1] + Math.cos(angle * Math.PI / 180) * radius,
  ]
}

export default function CourtsMap({ courts, selected, onSelect, userCity }) {
  const mapRef = useRef(null)

  const orangeIcon = useMemo(() => new L.DivIcon({
    html: `<div style="width:12px;height:12px;background:#ff6b00;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(255,107,0,0.7)"></div>`,
    iconSize: [12, 12], iconAnchor: [6, 6], className: '',
  }), [])

  const activeIcon = useMemo(() => new L.DivIcon({
    html: `<div style="width:20px;height:20px;background:#ff6b00;border:3px solid #fff;border-radius:50%;box-shadow:0 0 14px rgba(255,107,0,1)"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10], className: '',
  }), [])

  useEffect(() => {
    if (!selected || !mapRef.current) return
    const coords = getCoords(selected)
    if (coords) mapRef.current.flyTo(coords, 15, { duration: 0.6 })
  }, [selected])

  const center = CITY_COORDS[userCity] ?? [32.0853, 34.7818]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {courts.map(court => {
        const coords = getCoords(court)
        if (!coords) return null
        return (
          <Marker
            key={court.id}
            position={coords}
            icon={selected?.id === court.id ? activeIcon : orangeIcon}
            eventHandlers={{ click: () => onSelect(court) }}
          />
        )
      })}
    </MapContainer>
  )
}
