import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['הכל', 'עם תאורה', 'אספלט', 'פרקט', 'בטון']

export default function CourtsList() {
  const { user } = useAuth()
  const [userCity, setUserCity] = useState(null)
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('הכל')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const metaCity = user.user_metadata?.city ?? ''
    if (metaCity) { setUserCity(metaCity); return }
    supabase.from('profiles').select('city').eq('id', user.id).single()
      .then(({ data }) => setUserCity(data?.city ?? ''))
  }, [user])

  useEffect(() => {
    if (!user || userCity === null) return
    let q = supabase
      .from('courts')
      .select('id, name, address, neighborhood, city, surface_type, has_lights')
      .order('neighborhood').order('name')
    if (userCity) q = q.eq('city', userCity)
    q.then(({ data, error }) => {
      if (error) setError(error.message)
      else setCourts(data ?? [])
      setLoading(false)
    })
  }, [user, userCity])

  const filtered = courts.filter(c => {
    const matchSearch = !search ||
      c.name.includes(search) ||
      (c.neighborhood ?? '').includes(search) ||
      (c.address ?? '').includes(search)
    const matchFilter =
      activeFilter === 'הכל'      ? true :
      activeFilter === 'עם תאורה' ? c.has_lights :
      (c.surface_type ?? '') === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <div className="bg-background min-h-screen pb-24 text-on-surface" dir="rtl">

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none">search</span>
          <input
            type="search"
            placeholder="חיפוש לפי שם, שכונה או כתובת"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-full pr-10 pl-4 py-2 t-body-md text-on-surface placeholder:text-on-surface-variant/40"
            style={{ color: '#e5e2e1' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="py-3 overflow-x-auto no-scrollbar whitespace-nowrap flex gap-2 px-4">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-full t-label-lg flex-shrink-0 transition-colors"
            style={{
              backgroundColor: activeFilter === f ? '#ff6b00' : '#353534',
              color: activeFilter === f ? '#572000' : '#e2bfb0',
              border: activeFilter === f ? 'none' : '1px solid rgba(90,65,54,0.3)',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="flex justify-between items-center px-4 mt-2 mb-4">
        <span className="t-label-sm text-primary">{loading ? '' : `${filtered.length} נמצאו`}</span>
        <h2 className="t-headline-lg-m">{userCity ? `מגרשים ב${userCity}` : 'מגרשים'}</h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3 px-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 bg-error-container text-on-error-container rounded-xl p-4 text-right t-body-md">
          שגיאה: {error}
        </div>
      )}

      {/* Court list */}
      {!loading && !error && (
        <div className="flex flex-col gap-3 px-4">
          {filtered.length === 0 ? (
            <p className="text-on-surface-variant t-body-md py-8 text-center">לא נמצאו מגרשים.</p>
          ) : filtered.map(court => (
            <button
              key={court.id}
              onClick={() => navigate(`/courts/${court.id}`)}
              className="w-full text-right rounded-xl transition-all active:scale-[0.98]"
              style={{ background: '#201f1f', border: '1px solid #353534', padding: '12px 14px' }}
            >
              <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 16, color: '#e5e2e1', margin: 0 }}>
                {court.name}
              </p>
              {court.neighborhood && (
                <p style={{ fontSize: 13, color: '#ff6b00', margin: '3px 0 0', fontWeight: 600 }}>
                  {court.neighborhood}
                </p>
              )}
              {court.address && (
                <div className="flex items-center gap-1 justify-end mt-1" style={{ opacity: 0.7 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#a98a7d' }}>location_on</span>
                  <p style={{ fontSize: 12, color: '#c8c6c5', margin: 0 }}>{court.address}</p>
                </div>
              )}
              <div className="flex gap-2 mt-2 justify-end">
                {court.surface_type && (
                  <span style={{ fontSize: 11, background: '#2a2a2a', color: '#e2bfb0', padding: '2px 8px', borderRadius: 20 }}>
                    {court.surface_type}
                  </span>
                )}
                {court.has_lights && (
                  <span style={{ fontSize: 11, background: 'rgba(255,107,0,0.15)', color: '#ffb693', padding: '2px 8px', borderRadius: 20 }}>
                    תאורת לילה
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/create-game')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center z-40 active:scale-90 transition-all orange-glow-lg"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      <BottomNav />
    </div>
  )
}
