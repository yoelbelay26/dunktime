export default function StatsBadge({ icon, value, label }) {
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        padding: 'var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-outline-subtle)',
        flex: 1,
      }}
    >
      <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 28 }}>
        {icon}
      </span>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 800,
        color: 'var(--color-text-primary)',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-secondary)',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  )
}
