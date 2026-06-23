export default function GameCard({ time, court, currentPlayers, maxPlayers, label, isFull, isDanger, isHighlight, onJoin }) {
  const fill = Math.round((currentPlayers / maxPlayers) * 100)

  return (
    <div
      dir="rtl"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        opacity: isFull ? 0.8 : 1,
      }}
    >
      {/* Time box */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(53,53,52,0.3)',
        border: `1px solid ${isHighlight ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.05)'}`,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: isHighlight ? 'var(--color-accent)' : 'var(--color-text-primary)',
        }}>
          {time}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
        }}>
          היום
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--space-xs)',
        }}>
          {court}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            color: isDanger ? 'var(--color-error)' : isFull ? 'var(--color-text-secondary)' : 'var(--color-primary)',
          }}>
            {label}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            {currentPlayers}/{maxPlayers} שחקנים
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--color-surface-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${fill}%`,
            background: isFull ? 'var(--color-text-secondary)' : 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
          }} />
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={onJoin}
        disabled={isFull}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          cursor: isFull ? 'not-allowed' : 'pointer',
          background: isFull ? 'var(--color-surface-high)' : '#fff',
          color: isFull ? 'var(--color-text-secondary)' : '#000',
          flexShrink: 0,
        }}
      >
        {isFull ? 'מלא' : 'הצטרף'}
      </button>
    </div>
  )
}
