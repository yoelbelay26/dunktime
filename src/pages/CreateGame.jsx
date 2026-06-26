import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const inputCls =
  'w-full bg-surface-container-high border border-outline-variant rounded-xl px-4 py-4 text-on-surface t-body-md transition-all outline-none'

export default function CreateGame() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courts, setCourts] = useState([])
  const [courtId,   setCourtId]   = useState('')
  const [teamName,  setTeamName]  = useState('')
  const [count,     setCount]     = useState(10)
  const [date,      setDate]      = useState('')
  const [time,      setTime]      = useState('')
  const [note,      setNote]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const userCity = user?.user_metadata?.city
    let q = supabase.from('courts').select('id, name, city').order('city').order('name')
    // Show only user's city courts by default
    if (userCity) q = q.eq('city', userCity)
    q.then(({ data }) => setCourts(data ?? []))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!courtId || !date || !time || !user) return
    setSubmitting(true)
    setError(null)

    const userCity = user.user_metadata?.city ?? null
    const selectedCourt = courts.find(c => String(c.id) === String(courtId))

    const { data: game, error: gameErr } = await supabase
      .from('games')
      .insert({
        court_id:       courtId,
        created_by:     user.id,
        scheduled_date: date,
        scheduled_time: time,
        max_players:    count,
        note:           note || null,
        city:           selectedCourt?.city ?? userCity,
        team_name:      teamName.trim() || null,
      })
      .select('id')
      .single()

    if (gameErr) {
      setError(gameErr.message)
      setSubmitting(false)
      return
    }

    // Auto-join creator as first player
    await supabase.from('game_players').insert({
      game_id: game.id,
      user_id: user.id,
    })

    navigate('/')
  }

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">

      {/* Page title */}
      <div className="flex flex-row-reverse justify-between items-center px-4 pt-5 pb-2">
        <h1 className="t-headline-lg-m text-primary uppercase tracking-tighter italic" style={{ margin: 0 }}>
          יצירת משחק
        </h1>
        <span className="material-symbols-outlined text-on-surface-variant">menu</span>
      </div>

      {error && (
        <div className="mx-4 bg-error-container text-on-error-container rounded-xl p-3 text-right t-label-lg mb-2">
          {error}
        </div>
      )}

      <main className="pt-2 px-4 max-w-lg mx-auto">
        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* Court select */}
          <div className="space-y-2">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container icon-fill">sports_basketball</span>
              בחירת מגרש
            </label>
            <div className="relative">
              <select
                className={`${inputCls} pr-12 appearance-none`}
                style={{ color: courtId ? '#e5e2e1' : '#9a8a80' }}
                value={courtId}
                onChange={e => setCourtId(e.target.value)}
                required
              >
                <option value="" disabled>בחר מגרש מהרשימה...</option>
                {courts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.city ? ` — ${c.city}` : ''}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary-container pointer-events-none">
                search
              </span>
            </div>
          </div>

          {/* Team name */}
          <div className="space-y-2">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">shield</span>
              שם קבוצה (אופציונלי)
            </label>
            <input
              type="text"
              placeholder="למשל: כדורסל תל אביב FC"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className={inputCls}
              style={{ color: '#e5e2e1' }}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                תאריך
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className={inputCls} style={{ color: '#e5e2e1', colorScheme: 'dark' }} required />
            </div>
            <div className="space-y-2">
              <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">schedule</span>
                שעה
              </label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className={inputCls} style={{ color: '#e5e2e1', colorScheme: 'dark' }} required />
            </div>
          </div>

          {/* Player stepper */}
          <div className="space-y-3">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">groups</span>
              מספר שחקנים מקסימלי
            </label>
            <div className="flex items-center justify-between bg-surface-container border border-outline-variant rounded-xl p-2 h-16">
              <button type="button" onClick={() => setCount(v => Math.max(2, v - 1))}
                className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg active:scale-95 transition-transform">
                <span className="material-symbols-outlined font-bold">remove</span>
              </button>
              <span className="t-headline-md text-primary" style={{ width: 64, textAlign: 'center' }}>{count}</span>
              <button type="button" onClick={() => setCount(v => Math.min(20, v + 1))}
                className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg active:scale-95 transition-transform">
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">notes</span>
              הערה (אופציונלי)
            </label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="הוסף פרטים נוספים על המשחק..."
              rows={3} className={`${inputCls} resize-none`} style={{ color: '#e5e2e1' }} />
          </div>
        </form>
      </main>

      {/* Submit */}
      <div className="fixed left-0 w-full px-4 py-4 z-40"
        style={{ bottom: 72, background: 'linear-gradient(to top, #131313 60%, transparent)' }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || !courtId || !date || !time}
          className="w-full bg-primary-container text-on-primary t-headline-md uppercase py-5 rounded-xl active:scale-95 transition-transform duration-200 disabled:opacity-50"
          style={{ boxShadow: '0 8px 32px rgba(255,107,0,0.3)' }}
        >
          {submitting ? 'יוצר משחק...' : 'צור משחק'}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
