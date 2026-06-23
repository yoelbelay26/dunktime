export default function MessageRow({ avatar, name, lastMessage, time, unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        width: '100%',
        padding: 'var(--space-md)',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--color-outline-subtle)',
        cursor: 'pointer',
        textAlign: 'right',
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--color-surface-high)',
        border: unreadCount ? `2px solid var(--color-accent)` : '2px solid transparent',
      }}>
        {avatar && <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
          }}>
            {time}
          </span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-md)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            {name}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--color-accent)',
              color: '#561f00',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              padding: '2px 7px',
              flexShrink: 0,
            }}>
              {unreadCount}
            </span>
          )}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {lastMessage}
          </p>
        </div>
      </div>
    </button>
  )
}
