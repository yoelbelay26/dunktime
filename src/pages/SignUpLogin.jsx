import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUpLogin() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  const isLogin = mode === 'login'

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
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary-container rounded-md transition-all duration-300"
              style={{ right: isLogin ? '4px' : 'calc(50%)' }}
            />
            <button
              onClick={() => setMode('login')}
              className="flex-1 py-3 text-center t-label-lg relative z-10 transition-colors duration-300"
              style={{ color: isLogin ? '#fff' : '#e2bfb0' }}
            >
              התחברות
            </button>
            <button
              onClick={() => setMode('signup')}
              className="flex-1 py-3 text-center t-label-lg relative z-10 transition-colors duration-300"
              style={{ color: !isLogin ? '#fff' : '#e2bfb0' }}
            >
              הרשמה
            </button>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-5"
            onSubmit={e => { e.preventDefault(); navigate('/') }}
          >
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
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-4 t-body-md text-on-surface placeholder:text-on-surface-variant/40 transition-all"
                    style={{ color: '#e5e2e1' }}
                  />
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

            {/* Skill level – signup only */}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="t-label-sm text-on-surface-variant px-1">רמת משחק</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    sports_basketball
                  </span>
                  <select
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg py-3 pr-10 pl-4 t-body-md text-on-surface appearance-none transition-all"
                    style={{ color: '#e5e2e1' }}
                    defaultValue=""
                  >
                    <option value="" disabled>בחר רמת מיומנות</option>
                    <option value="beginner">מתחיל (Casual)</option>
                    <option value="intermediate">בינוני (Semi-Pro)</option>
                    <option value="advanced">מתקדם (Baller)</option>
                    <option value="pro">מקצוען (Elite)</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary t-label-lg py-4 rounded-lg uppercase tracking-widest active:scale-95 transition-transform hover:brightness-110 mt-2"
            >
              המשך
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="t-label-sm text-on-surface-variant">או</span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          {/* Google */}
          <button className="w-full border border-outline-variant bg-transparent text-on-surface t-label-lg py-3 rounded-lg flex items-center justify-center gap-3 transition-colors active:scale-[0.98] hover:bg-surface-container-highest">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            המשך עם Google
          </button>
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
