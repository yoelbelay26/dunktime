import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CourtDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [court, setCourt] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    Promise.all([
      supabase
        .from('courts')
        .select('id, name, address, neighborhood, city, surface_type, has_lights')
        .eq('id', id)
        .single(),
      supabase
        .from('games')
        .select('id, scheduled_date, scheduled_time, max_players, game_players(id)')
        .eq('court_id', id)
        .gte('scheduled_date', today)
        .order('scheduled_date')
        .order('scheduled_time')
        .limit(5),
    ]).then(([courtRes, gamesRes]) => {
      setCourt(courtRes.data)
      setGames(gamesRes.data ?? [])
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 40 }}>progress_activity</span>
      </div>
    )
  }

  if (!court) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center gap-4 text-on-surface" dir="rtl">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>sports_basketball</span>
        <p className="t-body-md text-on-surface-variant">המגרש לא נמצא.</p>
        <button onClick={() => navigate('/courts')} className="t-label-lg text-primary">חזרה למגרשים</button>
      </div>
    )
  }

  const stats = [
    { icon: 'sports_basketball', label: 'סוג משטח',    value: court.surface_type ?? 'לא ידוע' },
    { icon: 'location_city',     label: 'שכונה',        value: court.neighborhood ?? court.city ?? '—' },
    { icon: 'dark_mode',         label: 'תאורת לילה',   value: court.has_lights ? 'כן' : 'לא' },
    { icon: 'location_on',       label: 'כתובת',        value: court.address ?? '—' },
  ]

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">

      {/* ── Hero ── */}
      <section className="relative h-56 w-full overflow-hidden bg-surface-container-high flex items-end">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(19,19,19,0.95) 0%, rgba(19,19,19,0.2) 100%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: 160, color: '#ff6b00' }}>sports_basketball</span>
        </div>
        <div className="relative p-4 text-right w-full">
          <h2 className="t-headline-lg-m text-white mb-1">{court.name}</h2>
          <div className="flex items-center gap-1 text-on-surface-variant justify-end">
            <span className="t-body-md">{court.address ? `${court.address}, ` : ''}{court.city}</span>
            <span className="material-symbols-outlined text-sm">location_on</span>
          </div>
        </div>
      </section>

      {/* ── Stats bento ── */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-surface-container p-3 rounded-xl border border-white/5 flex flex-col gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
            <div>
              <p className="text-on-surface-variant t-label-sm uppercase tracking-wider" style={{ fontSize: 10 }}>{s.label}</p>
              <p className="t-label-lg text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Upcoming games ── */}
      <section className="mt-8 px-4" dir="rtl">
        <h3 className="text-white mb-3" style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 700 }}>
          משחקים קרובים במגרש
        </h3>

        {games.length === 0 ? (
          <p className="t-body-md text-on-surface-variant">אין משחקים קרובים במגרש זה.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {games.map(game => {
              const current = game.game_players?.length ?? 0
              const max = game.max_players ?? 10
              const spotsLeft = max - current
              const isFull = spotsLeft <= 0
              const time = game.scheduled_time?.slice(0, 5) ?? '--:--'

              return (
                <div
                  key={game.id}
                  className="bg-surface-container rounded-xl p-4 flex justify-between items-center"
                  style={{ borderRight: '4px solid rgba(255,182,147,0.6)' }}
                >
                  <button
                    disabled={isFull}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-tighter active:scale-90 transition-transform disabled:opacity-50"
                  >
                    {isFull ? 'מלא' : 'הצטרף'}
                  </button>
                  <div className="flex flex-col gap-1 text-right">
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 }} className="text-primary">
                      {time}
                    </span>
                    <span className="t-label-sm text-on-surface-variant">
                      {current}/{max} שחקנים
                      {!isFull && ` • עוד ${spotsLeft} מקומות`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── FAB ── */}
      <button
        onClick={() => navigate('/create-game')}
        className="fixed bottom-24 left-6 bg-primary-container text-on-primary-container flex items-center gap-2 px-6 py-4 rounded-full font-bold z-40 active:scale-90 transition-all orange-glow"
      >
        <span className="material-symbols-outlined font-black">add</span>
        <span className="t-label-lg">צור משחק כאן</span>
      </button>
    </div>
  )
}
