export default function CourtCard({ name, location, activePlayers, isLive, img, onClick }) {
  return (
    <button
      onClick={onClick}
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 256,
        flexShrink: 0,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: 'rgba(30,30,30,0.8)',
        border: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'right',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative', height: 128 }}>
        {img && (
          <img
            src={img}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {isLive && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'var(--color-accent)',
              color: '#561f00',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            LIVE • {activePlayers} פעילים
          </span>
        )}
      </div>
      <div style={{ padding: 'var(--space-sm)' }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          {name}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          margin: '4px 0 0',
        }}>
          {location}
        </p>
      </div>
    </button>
  )
}
