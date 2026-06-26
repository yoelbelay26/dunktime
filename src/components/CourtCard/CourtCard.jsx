const GRADIENTS = [
  'linear-gradient(135deg, #1a1200 0%, #3d2800 100%)',
  'linear-gradient(135deg, #0d1a0d 0%, #1a3020 100%)',
  'linear-gradient(135deg, #1a0d1a 0%, #2d1430 100%)',
  'linear-gradient(135deg, #001a1a 0%, #003030 100%)',
  'linear-gradient(135deg, #1a1a00 0%, #2e2e10 100%)',
]

export default function CourtCard({ name, location, activePlayers, isLive, img, onClick, index = 0 }) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <button
      onClick={onClick}
      dir="rtl"
      style={{
        display: 'flex', flexDirection: 'column',
        width: 200, flexShrink: 0,
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'right', cursor: 'pointer',
        background: '#1a1a1a',
      }}
    >
      {/* Visual area */}
      <div style={{ position: 'relative', height: 110, background: img ? undefined : gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {img
          ? <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: 'rgba(255,182,147,0.2)', position: 'absolute' }}>sports_basketball</span>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1a1a1a 0%, transparent 60%)' }} />
            </>
        }
        {isLive && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#ff6b00', color: '#561f00', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
            LIVE · {activePlayers}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontFamily: 'Montserrat', fontSize: 14, fontWeight: 700, color: '#e5e2e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </p>
        {location && (
          <p style={{ fontSize: 11, color: '#9a8a80', margin: '3px 0 0' }}>
            {location}
          </p>
        )}
      </div>
    </button>
  )
}
