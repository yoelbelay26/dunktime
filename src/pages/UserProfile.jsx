import { useState } from 'react'
import BottomNav from '../components/BottomNav'

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXtBMimgDnhCl6OX4sBzCAR2ItKUmfsbWBXNt4m6tpTgZLRGhDXLbCZ9RzEpKkdu-DP-lByMFPTJly8Y_hLz6I8vm3dyPDf3DspUrpt0IQy3IDbzmtSbyL7Z2scYdNDg4mxHTVDHu1c9BjNBEV5l30cjYzSjm4pKNm0EJdG_pFjouL-FRKfW6fv-9dEfUc1ZBgE4QBqy187xIvjP53WjSybv9exT72wQXXvR_7yBKXJ2fxHg7RxhW5kW5EqiIGqSbUf5J-0HUhDY'

const stats = [
  { value: '42', label: 'משחקים ששוחקו' },
  { value: '12', label: 'מגרשים שביקרת' },
  { value: '4.9★', label: 'דירוג שחקן' },
]

const upcoming = [
  { id: 1, icon: 'sports_basketball', court: 'פארק הירקון', date: 'מחר, 18:00', count: '8/10' },
  { id: 2, icon: 'stadium',           court: 'ספורטק צפון',  date: "יום ה', 20:30", count: '10/10 מלא' },
  { id: 3, icon: 'location_on',       court: 'מרכז הפיס',   date: "יום א', 19:00", count: '6/10' },
]

const history = [
  { id: 4, icon: 'sports_basketball', court: 'פארק הירקון', date: '15/06, 18:00', count: 'ניצחנו 21-18' },
  { id: 5, icon: 'stadium',           court: 'ספורטק צפון',  date: '12/06, 20:30', count: 'הפסדנו 15-21' },
  { id: 6, icon: 'location_on',       court: 'מרכז הפיס',   date: '08/06, 19:00', count: 'ניצחנו 21-14' },
]

const achievements = [
  { icon: 'workspace_premium', label: 'קלע מוביל', unlocked: true },
  { icon: 'local_fire_department', label: 'רצף 5 משחקים', unlocked: false },
  { icon: 'groups',                label: 'חבר קבוצתי',   unlocked: false },
  { icon: 'military_tech',         label: 'MVP שבועי',     unlocked: false },
]

export default function UserProfile() {
  const [tab, setTab] = useState('upcoming')

  const rows = tab === 'upcoming' ? upcoming : history

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">

      <main className="pt-6 px-4 max-w-md mx-auto">

        {/* ── Profile header ── */}
        <section className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div
              className="w-32 h-32 p-1 shadow-lg orange-glow"
              style={{ background: 'linear-gradient(135deg, #ff6b00, #ffb693)', borderRadius: 24 }}
            >
              <img
                className="w-full h-full object-cover border-4 border-background"
                style={{ borderRadius: 20 }}
                src={AVATAR_URL}
                alt="Profile"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary-container text-on-primary-container px-3 py-1 rounded-full t-label-sm font-bold shadow-md">
              LVL 42
            </div>
          </div>
          <h2 className="t-headline-lg-m text-on-surface mb-2">ג׳ייסון טייטום</h2>
          <span
            className="inline-flex items-center bg-primary-container text-black font-bold px-4 py-1 rounded-lg t-label-lg uppercase tracking-wider"
          >
            מתקדם
          </span>
        </section>

        {/* ── Stats ── */}
        <section className="grid grid-cols-3 gap-2 mb-8">
          {stats.map(s => (
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

          <div className="space-y-3">
            {rows.map(row => (
              <div
                key={row.id}
                className="glass-card rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
                style={{ borderRight: '4px solid rgba(255,107,0,0.6)' }}
              >
                <div className="flex flex-col items-end gap-1">
                  <span className="text-primary-container font-black t-label-lg uppercase italic">
                    {tab === 'upcoming' ? 'רשום' : row.count}
                  </span>
                  {tab === 'upcoming' && (
                    <span style={{ fontSize: 10 }} className="text-on-surface-variant">{row.count}</span>
                  )}
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <h4 className="font-bold t-body-lg text-right">{row.court}</h4>
                    <div className="flex items-center gap-2 text-on-surface-variant t-label-sm justify-end">
                      <span>{row.date}</span>
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">{row.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Achievements ── */}
        <section className="mb-4">
          <div className="flex justify-between items-center mb-5">
            <button className="text-primary-container t-label-sm font-bold uppercase underline">הכל</button>
            <h3 className="t-headline-md text-on-surface">הישגים</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {achievements.map(a => (
              <div
                key={a.label}
                className="flex-shrink-0 w-24 h-24 glass-card rounded-xl flex flex-col items-center justify-center p-2"
                style={{
                  opacity: a.unlocked ? 1 : 0.5,
                  border: a.unlocked ? '1px solid rgba(255,182,147,0.2)' : undefined,
                }}
              >
                <span
                  className={`material-symbols-outlined text-3xl mb-1 ${a.unlocked ? 'text-primary icon-fill' : 'text-on-surface-variant'}`}
                >
                  {a.icon}
                </span>
                <span className="font-bold text-center leading-tight" style={{ fontSize: 8 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
