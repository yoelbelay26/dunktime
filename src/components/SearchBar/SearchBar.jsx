export default function SearchBar({ value, onChange, placeholder = 'חיפוש מגרש...' }) {
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-sm) var(--space-md)',
        border: '1px solid var(--color-outline-subtle)',
      }}
    >
      <span className="material-symbols-outlined" style={{ color: 'var(--color-text-secondary)', fontSize: 20 }}>
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          color: 'var(--color-text-primary)',
          textAlign: 'right',
        }}
      />
    </div>
  )
}
