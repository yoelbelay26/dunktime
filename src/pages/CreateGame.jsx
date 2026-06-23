import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'


const COURTS = [
  'ספורטק צפון, תל אביב',
  'מגרש הברזל, רמת גן',
  'אולם הספורט, חולון',
  'פארק הירקון, תל אביב',
]

const LEVELS = ['מתחילים', 'בינוני', 'מתקדמים']

const inputCls =
  'w-full bg-surface-container-high border border-outline-variant rounded-xl px-4 py-4 text-on-surface t-body-md transition-all outline-none'

export default function CreateGame() {
  const navigate = useNavigate()
  const [count, setCount] = useState(10)
  const [skill, setSkill] = useState('בינוני')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">

      {/* ── Page title ── */}
      <div className="flex flex-row-reverse justify-between items-center px-4 pt-5 pb-2">
        <h1 className="t-headline-lg-m text-primary uppercase tracking-tighter italic" style={{ margin: 0 }}>
          יצירת משחק
        </h1>
        <span className="material-symbols-outlined text-on-surface-variant">menu</span>
      </div>

      {/* ── Form ── */}
      <main className="pt-2 px-4 max-w-lg mx-auto">
        <form
          className="space-y-8"
          onSubmit={e => { e.preventDefault(); navigate('/') }}
        >

          {/* Court select */}
          <div className="space-y-2">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container icon-fill">sports_basketball</span>
              בחירת מגרש
            </label>
            <div className="relative">
              <select
                className={`${inputCls} pr-12 appearance-none`}
                style={{ color: '#e5e2e1' }}
                defaultValue=""
              >
                <option value="" disabled>בחר מגרש מהרשימה...</option>
                {COURTS.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary-container pointer-events-none">
                search
              </span>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                תאריך
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputCls}
                style={{ color: '#e5e2e1', colorScheme: 'dark' }}
              />
            </div>
            <div className="space-y-2">
              <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">schedule</span>
                שעה
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className={inputCls}
                style={{ color: '#e5e2e1', colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Player stepper */}
          <div className="space-y-3">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">groups</span>
              מספר שחקנים מקסימלי
            </label>
            <div className="flex items-center justify-between bg-surface-container border border-outline-variant rounded-xl p-2 h-16">
              <button
                type="button"
                onClick={() => setCount(v => Math.max(1, v - 1))}
                className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined font-bold">remove</span>
              </button>
              <div className="flex-1 flex justify-center">
                <span className="t-headline-md text-primary" style={{ width: 64, textAlign: 'center' }}>{count}</span>
              </div>
              <button
                type="button"
                onClick={() => setCount(v => Math.min(20, v + 1))}
                className="w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-lg active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
            </div>
          </div>

          {/* Skill chips */}
          <div className="space-y-4">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">trending_up</span>
              רמת משחק
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSkill(level)}
                  className="flex-shrink-0 px-6 py-3 rounded-full border t-label-lg uppercase transition-all"
                  style={{
                    backgroundColor: skill === level ? '#ff6b00' : 'transparent',
                    color: skill === level ? '#572000' : '#e2bfb0',
                    borderColor: skill === level ? '#ff6b00' : '#5a4136',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="t-label-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">notes</span>
              הערה (אופציונלי)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="הוסף פרטים נוספים על המשחק..."
              rows={3}
              className={`${inputCls} resize-none`}
              style={{ color: '#e5e2e1' }}
            />
          </div>
        </form>
      </main>

      {/* ── Fixed submit ── */}
      <div
        className="fixed left-0 w-full px-4 py-4 z-40"
        style={{
          bottom: 72,
          background: 'linear-gradient(to top, #131313 60%, transparent)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-full bg-primary-container text-on-primary t-headline-md uppercase py-5 rounded-xl active:scale-95 transition-transform duration-200"
          style={{ boxShadow: '0 8px 32px rgba(255,107,0,0.3)' }}
        >
          צור משחק
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
