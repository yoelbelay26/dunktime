import { useState } from 'react'

const fieldStyle = {
  width: '100%',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-outline-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-md)',
  color: 'var(--color-text-primary)',
  textAlign: 'right',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  fontWeight: 700,
  color: 'var(--color-text-secondary)',
  display: 'block',
  marginBottom: 'var(--space-xs)',
}

export default function GameForm({ onSubmit }) {
  const [form, setForm] = useState({ court: '', date: '', time: '', maxPlayers: 10, notes: '' })

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit?.(form)
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <label style={labelStyle}>מגרש</label>
        <input style={fieldStyle} type="text" placeholder="שם המגרש" value={form.court} onChange={set('court')} required />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>תאריך</label>
          <input style={fieldStyle} type="date" value={form.date} onChange={set('date')} required />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>שעה</label>
          <input style={fieldStyle} type="time" value={form.time} onChange={set('time')} required />
        </div>
      </div>
      <div>
        <label style={labelStyle}>מקסימום שחקנים</label>
        <input style={fieldStyle} type="number" min={2} max={30} value={form.maxPlayers} onChange={set('maxPlayers')} />
      </div>
      <div>
        <label style={labelStyle}>הערות</label>
        <textarea
          style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }}
          placeholder="פרטים נוספים..."
          value={form.notes}
          onChange={set('notes')}
        />
      </div>
      <button
        type="submit"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          fontWeight: 700,
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: 'var(--color-accent)',
          color: '#561f00',
          cursor: 'pointer',
        }}
      >
        צור משחק
      </button>
    </form>
  )
}
