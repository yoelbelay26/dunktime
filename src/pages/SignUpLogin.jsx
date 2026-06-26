import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה',
  'אשדוד', 'נתניה', 'באר שבע', 'בני ברק', 'רמת גן',
  'הרצליה', 'כפר סבא', 'מודיעין', 'רחובות', 'חולון',
  'בת ים', 'אשקלון', 'רעננה', 'הוד השרון', 'לוד',
  'רמלה', 'נצרת', 'עפולה', 'נהריה', 'עכו',
  'טבריה', 'צפת', 'דימונה', 'אילת', 'רהט',
]

export default function SignUpLogin() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const navigate = useNavigate()

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, city } },
        })
        if (error) throw error
        // If no session, Supabase requires email confirmation
        if (data.user && !data.session) {
          setConfirmationSent(true)
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 text-on-surface" dir="rtl">
        <div className="w-full max-w-md glass-card rounded-xl p-8 flex flex-col items-center gap-4 text-center orange-glow">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>mark_email_read</span>
          <h2 className="t-headline-md text-on-surface">בדוק את תיבת הדואר שלך</h2>
          <p className="t-body-md text-on-surface-variant">
            שלחנו קישור אימות לכתובת <strong style={{ color: '#e5e2e1' }}>{email}</strong>.
            לחץ על הקישור כדי להפעיל את החשבון.
          </p>
          <button
            onClick={() => { setConfirmationSent(false); setMode('login') }}
            className="t-label-lg text-primary uppercase underline mt-2"
          >
            חזרה להתחברות
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 text-on-surface">
      <main className="relative z-10 w-full max-w-md flex flex-col items-center">

        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="t-display text-primary uppercase tracking-tighter mb-2 leading-none"
              style={{ fontSize: 'clamp(20px, 5.5vw, 48px)', wordBreak: 'break-word' }}>
            FULL COURT PRESS
          </h1>
          <p className="t-label-lg text-on-surface-variant uppercase" style={{ letterSpacing: '0.2em' }}>
            הצטרף למשחק
          </p>
        </div>

        {/* Auth card */}
        <div className="w-full glass-card rounded-xl p-6 flex flex-col gap-6 orange-glow">

          {/* Segmented tabs */}
          <div className="relative flex bg-surface-container-low rounded-lg p-1 overflow-hidden">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary-container rounded-md transition-all duration-300"
              style={{ right: isLogin ? '4px' : 'calc(50%)' }}
            />
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className="flex-1 py-3 text-center t-label-lg relative z-10 transition-colors duration-300"
              style={{ color: isLogin ? '#fff' : '#e2bfb0' }}
            >
              התחברות
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null) }}
              className="flex-1 py-3 text-center t-label-lg relative z-10 transition-colors duration-300"
              style={{ color: !isLogin ? '#fff' : '#e2bfb0' }}
            >
              הרשמה
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 t-body-md text-right" dir="rtl">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Full name – signup only */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="t-label-sm text-on-surface-variant px-1">שם מלא</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="הכנס את שמך המלא"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-4 t-body-md text-on-surface placeholder:text-on-surface-variant/40 transition-all"
                    style={{ color: '#e5e2e1' }}
                  />
                </div>
              </div>
            )}

            {/* City – signup only */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="t-label-sm text-on-surface-variant px-1">עיר מגורים</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    location_city
                  </span>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-4 t-body-md text-on-surface appearance-none transition-all"
                    style={{ color: city ? '#e5e2e1' : '#9a8a80' }}
                  >
                    <option value="" disabled>בחר עיר...</option>
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="t-label-sm text-on-surface-variant px-1">אימייל</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-4 t-body-md text-on-surface placeholder:text-on-surface-variant/40 transition-all"
                  style={{ color: '#e5e2e1' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="t-label-sm text-on-surface-variant px-1">סיסמה</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-10 t-body-md text-on-surface placeholder:text-on-surface-variant/40 transition-all"
                  style={{ color: '#e5e2e1' }}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>visibility</span>
                </button>
              </div>
            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-container text-on-primary t-label-lg py-4 rounded-lg uppercase tracking-widest active:scale-95 transition-all hover:brightness-110 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'המשך'}
            </button>
          </form>

        </div>

        <p className="mt-8 text-on-surface-variant t-label-sm text-center opacity-60">
          בשימוש באפליקציה, אתה מסכים ל
          <a href="#" className="underline hover:text-primary">תנאי השימוש</a>
          {' '}ול
          <a href="#" className="underline hover:text-primary">מדיניות הפרטיות</a>
        </p>
      </main>
    </div>
  )
}
