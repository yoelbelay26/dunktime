export default function ChatBubble({ text, time, isMine, avatar }) {
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        justifyContent: isMine ? 'flex-start' : 'flex-end',
        alignItems: 'flex-end',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-sm)',
      }}
    >
      {!isMine && avatar && (
        <img
          src={avatar}
          alt=""
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-full)',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: isMine
            ? 'var(--radius-md) var(--radius-sm) var(--radius-md) var(--radius-md)'
            : 'var(--radius-sm) var(--radius-md) var(--radius-md) var(--radius-md)',
          background: isMine ? 'var(--color-accent)' : 'var(--color-surface)',
          color: isMine ? '#561f00' : 'var(--color-text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          lineHeight: 1.5,
        }}>
          {text}
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          margin: '4px var(--space-xs) 0',
          textAlign: isMine ? 'right' : 'left',
        }}>
          {time}
        </p>
      </div>
    </div>
  )
}
