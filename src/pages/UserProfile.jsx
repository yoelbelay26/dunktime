import { useState, useEffect, useRef } from 'react'
import BottomNav from '../components/BottomNav'
import AvatarCropper from '../components/AvatarCropper/AvatarCropper'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const CITIES = [
  'תל אביב','ירושלים','חיפה','ראשון לציון','פתח תקווה',
  'אשדוד','נתניה','באר שבע','בני ברק','רמת גן',
  'הרצליה','כפר סבא','מודיעין','רחובות','חולון',
  'בת ים','אשקלון','רעננה','הוד השרון','לוד',
  'רמלה','נצרת','עפולה','נהריה','עכו',
  'טבריה','צפת','דימונה','אילת','רהט',
]

function formatDate(date, time) {
  const d = date ? new Date(date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }) : ''
  const t = time ? time.slice(0, 5) : ''
  return [d, t].filter(Boolean).join(' · ')
}

export default function UserProfile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('upcoming')
  const [profile, setProfile] = useState(null)
  const [upcoming, setUpcoming] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCity, setSelectedCity] = useState('')
  const [savingCity,   setSavingCity]   = useState(false)
  const [citySaved,    setCitySaved]    = useState(false)
  const [cityError,    setCityError]    = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [cropSrc,         setCropSrc]         = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) return

    async function fetchAll() {
      const today = new Date().toISOString()

      const [profileRes, upcomingRes, historyRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single(),

        // Upcoming: games user created OR joined
        supabase
          .from('game_players')
          .select('games(id, scheduled_date, scheduled_time, max_players, courts(name), game_players(id))')
          .eq('user_id', user.id)
          .gte('games.scheduled_date', today),

        // History: past games user was part of
        supabase
          .from('game_players')
          .select('games(id, scheduled_date, scheduled_time, max_players, courts(name))')
          .eq('user_id', user.id)
          .lt('games.scheduled_date', today),
      ])

      if (profileRes.error && profileRes.error.code !== 'PGRST116') {
        setError(profileRes.error.message)
      } else {
        setProfile(profileRes.data)
      }

      // Extract games from game_players join, filter nulls
      const upcomingGames = (upcomingRes.data ?? [])
        .map(r => r.games).filter(Boolean)
        .sort((a, b) => a.scheduled_date?.localeCompare(b.scheduled_date))
      const historyGames = (historyRes.data ?? [])
        .map(r => r.games).filter(Boolean)
        .sort((a, b) => b.scheduled_date?.localeCompare(a.scheduled_date))

      setUpcoming(upcomingGames)
      setHistory(historyGames)

      // city: prefer profiles table, fallback to auth metadata
      const savedCity = profileRes.data?.city ?? user.user_metadata?.city ?? ''
      if (savedCity) setSelectedCity(savedCity)
      setLoading(false)
    }

    fetchAll()
  }, [user])

  const saveCity = async () => {
    if (!selectedCity || !user) return
    setSavingCity(true)
    setCityError(null)

    const { error } = await supabase.auth.updateUser({
      data: { city: selectedCity },
    })

    if (error) {
      setCityError(error.message)
      setSavingCity(false)
      return
    }

    setProfile(p => ({ ...(p ?? {}), city: selectedCity }))
    setSavingCity(false)
    setCitySaved(true)
    setTimeout(() => setCitySaved(false), 2500)
  }

  // Step 1: user selects file → open cropper
  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result)
    reader.readAsDataURL(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  // Step 2: cropper returns a Blob → upload to Supabase
  const uploadAvatar = async (blob) => {
    if (!blob || !user) return
    setUploadingAvatar(true)

    const path = `${user.id}/avatar.jpg`
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })

    if (upErr) {
      alert('שגיאה בהעלאה: ' + upErr.message)
      setUploadingAvatar(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Save to both — metadata (for self) + profiles table (for others to see)
    await Promise.all([
      supabase.auth.updateUser({ data: { avatar_url: publicUrl } }),
      supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl }, { onConflict: 'id' }),
    ])

    setProfile(p => ({ ...(p ?? {}), avatar_url: publicUrl }))
    setCropSrc(null)
    setUploadingAvatar(false)
  }

  const rows = tab === 'upcoming' ? upcoming : history

  const gamesPlayed  = history.length
  const courtsVisited = new Set(
    history.map(g => g.courts?.name).filter(Boolean)
  ).size

  const displayName = profile?.full_name
    ?? user?.user_metadata?.full_name
    ?? '—'
  const avatarUrl = profile?.avatar_url
    ?? user?.user_metadata?.avatar_url
    ?? null

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">
      <main className="pt-6 px-4 max-w-md mx-auto">

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 40 }}>
              progress_activity
            </span>
            <p className="t-body-md text-on-surface-variant">טוען פרופיל...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-4 text-right t-body-md mb-6">
            שגיאה: {error}
          </div>
        )}

        {!loading && (
          <>
            {/* ── Profile header ── */}
            <section className="flex flex-col items-center mb-8">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFileChange}
              />

              <div className="relative mb-5">
                {/* Avatar */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative block"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <div
                    className="w-32 h-32 p-1 shadow-lg orange-glow"
                    style={{ background: 'linear-gradient(135deg, #ff6b00, #ffb693)', borderRadius: 24 }}
                  >
                    {avatarUrl ? (
                      <img
                        className="w-full h-full object-cover border-4 border-background"
                        style={{ borderRadius: 20 }}
                        src={avatarUrl}
                        alt={displayName}
                      />
                    ) : (
                      <div
                        className="w-full h-full border-4 border-background flex items-center justify-center bg-surface-container-high"
                        style={{ borderRadius: 20 }}
                      >
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>person</span>
                      </div>
                    )}
                  </div>

                  {/* Camera overlay */}
                  <div style={{
                    position: 'absolute', bottom: -4, left: -4,
                    width: 36, height: 36, borderRadius: '50%',
                    background: uploadingAvatar ? '#353534' : '#ff6b00',
                    border: '3px solid #131313',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {uploadingAvatar
                      ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18, color: '#ffb693' }}>progress_activity</span>
                      : <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#561f00' }}>photo_camera</span>
                    }
                  </div>
                </button>

              </div>

              <h2 className="t-headline-lg-m text-on-surface mb-2">{displayName}</h2>

              {/* ── City selector ── */}
              {cityError && (
                <p className="t-label-sm text-error mt-1">{cityError}</p>
              )}
              <div className="flex items-center gap-2 mt-1" dir="rtl">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>location_on</span>
                <select
                  value={selectedCity}
                  onChange={e => { setSelectedCity(e.target.value); setCitySaved(false) }}
                  className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 t-label-lg text-on-surface appearance-none"
                  style={{ color: selectedCity ? '#e5e2e1' : '#9a8a80' }}
                >
                  <option value="" disabled>בחר עיר...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {citySaved ? (
                  <span className="t-label-lg" style={{ color: '#ffb693' }}>✓</span>
                ) : selectedCity && selectedCity !== profile?.city ? (
                  <button
                    onClick={saveCity}
                    disabled={savingCity}
                    className="bg-primary-container text-on-primary px-3 py-1.5 rounded-lg t-label-lg active:scale-95 transition-all disabled:opacity-40"
                  >
                    {savingCity ? '...' : 'שמור'}
                  </button>
                ) : null}
              </div>
            </section>

            {/* ── Stats ── */}
            <section className="grid grid-cols-3 gap-2 mb-8">
              {[
                { value: gamesPlayed,   label: 'משחקים ששוחקו' },
                { value: courtsVisited, label: 'מגרשים שביקרת'  },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-5 flex flex-col items-center text-center">
                  <span className="text-primary-container t-headline-md leading-none mb-1">{s.value}</span>
                  <span className="text-on-surface-variant uppercase font-bold leading-tight" style={{ fontSize: 10 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </section>

            {/* ── Tabs ── */}
            <section className="mb-4">
              <div className="flex border-b border-surface-variant mb-5">
                {[['upcoming', 'משחקים קרובים'], ['history', 'היסטוריית משחקים']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="flex-1 py-3 text-center font-bold transition-all"
                    style={{
                      color: tab === key ? '#ffb693' : '#e2bfb0',
                      borderBottom: tab === key ? '2px solid #ffb693' : '2px solid transparent',
                      marginBottom: -1,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {rows.length === 0 ? (
                <p className="text-on-surface-variant t-body-md text-right py-6">
                  {tab === 'upcoming' ? 'אין משחקים קרובים.' : 'אין היסטוריית משחקים.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {rows.map(row => (
                    <div
                      key={row.id}
                      className="glass-card rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
                      style={{ borderRight: '4px solid rgba(255,107,0,0.6)' }}
                    >
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-primary-container font-black t-label-lg uppercase italic">
                          {tab === 'upcoming' ? 'רשום' : 'שוחק'}
                        </span>
                        {row.max_players && (
                          <span style={{ fontSize: 10 }} className="text-on-surface-variant">
                            עד {row.max_players} שחקנים
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-5">
                        <div>
                          <h4 className="font-bold t-body-lg text-right">
                            {row.courts?.name ?? 'מגרש לא ידוע'}
                          </h4>
                          <div className="flex items-center gap-2 text-on-surface-variant t-label-sm justify-end">
                            <span>{formatDate(row.scheduled_date, row.scheduled_time)}</span>
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-2xl">sports_basketball</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-4">
            </section>
          </>
        )}
      </main>

      {/* ── Logout ── */}
      <div className="px-4 pb-8 max-w-md mx-auto" dir="rtl">
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
          className="w-full py-3 rounded-xl t-label-lg text-on-surface-variant transition-colors active:scale-95"
          style={{ background: 'transparent', border: '1px solid #2a2a2a' }}
        >
          התנתק
        </button>
      </div>

      <BottomNav />

      {/* ── Avatar Cropper ── */}
      {cropSrc && (
        <AvatarCropper
          imageSrc={cropSrc}
          loading={uploadingAvatar}
          onSave={uploadAvatar}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  )
}
