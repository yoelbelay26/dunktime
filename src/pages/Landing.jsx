import { useNavigate } from 'react-router-dom'

const HERO_IMG   = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnb8SO8UuL8dhbU_BkBJPw7Z6nJnSIRkB-rZdeswNXnzGXkCUFlp7ZYHpK7FPdbn9RkyNdZT-qn7kZZnWxAzTsU_X64EBTAGEN3qyT89S5ixmxLw2Mzv0hXz0H4MJljlyw-KXGTTovKnOuuTa1U3OSW1Ij1O7sBuoKNOvgwgDk6rCinlvduuh2grX01KkCe3DzvETEd5Ssguw_dMR1hhK5tFSehwgUnT1nt-sn1oSkY9cNk5EnhRn-9jVuGCzpur7_FSWoKvYjgr0'
const COURT_IMG1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuARLij33z_3o0owWTW6kGRRg2DvvOeAnp0f8fbQExrOAOpxoMYnGrEeyqS6Ds4-FQqEUKYH3IBHZfRpw5kc8sVWpSKIuHFWIeQ6AELY1nffppsyCXgX4GEMaUfUgy_LfqOhUzcnjrJrZYBCAspQ0iGNNQyvfMlADFZ14YZ_VhlQ1f6v5L0a4EmdqVCTAD57pfSdxi7Td-jEgm8w5quktYDnNPJYXZ4TagbDbcLFcWoaC0q8fXnctx0JZlm-vr8Jup25aJJP6_272Ys'
const COURT_IMG2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLyticVE9SBkC2cA9LZkCc2XpU_EvAqeLNwPtgGfSh76QWNc0ems3DSXICkh9dwy1woeVz7PxSGrysEs3r3pJaa8W5-FjUEjD5RthJdvTrQft3jkL54AY02l4idx1vmkDzqoG9vn7anebVXH5WXdAiY_dI7sy1nQoIsUztBp7wq0iULn8fcacym_ERV7cG_RArs58Q8ygEOtXWxtWPTzjFBqgaUimSwjzdeUUFRCg50FKpSYZ9xTQ1hHZ4fP1bmN-T8jMvLJKxPeI'
const COURT_IMG3 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBYXV6tzmkjTclo7pyB9zRBl-euTcsLURGl8rIwqnEC1oEmtwf4hRDcHaK1zzxyCeDCYzchPEuXwUqoQh2RpMnLAiCwsu_q7OFygweYTpiEE_me1mkjmLACUEZFUQhxfdb7OUn5StVC-whzZ6JEtDP-8QNTZN3Lp7uPbuaZtoYG-HmgEDGFEbHvXy2KUnNQkH0rn4BOF0K2Hs6mdedKE50zSoqKQqdDEfATEIl2ubNr-SR2WnacHWjhDuhk_G7Q_2VnUsjYFQTkEU'

const features = [
  { icon: 'location_on',       title: 'מצא מגרש',      desc: 'גלה מגרשי כדורסל פעילים בעיר שלך, עם כתובת מדויקת ופרטי מגרש' },
  { icon: 'group_add',         title: 'הצטרף למשחק',   desc: 'ראה משחקים קרובים ורשום את עצמך תוך שניות' },
  { icon: 'sports_basketball', title: 'צור משחק',       desc: 'ארגן משחק, קבע שעה ומקום ותן לחברים להצטרף' },
]

const steps = [
  { num: '1', title: 'נרשם',       desc: 'הצטרף תוך פחות מדקה עם אימייל' },
  { num: '2', title: 'בחר עיר',    desc: 'ראה מגרשים ומשחקים קרובים אליך' },
  { num: '3', title: 'שחק',        desc: 'הצטרף למשחק קיים או צור חדש' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div dir="rtl" style={{ background: '#131313', color: '#e5e2e1', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── Top Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', height: 56,
        background: 'rgba(19,19,19,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,107,0,0.15)',
      }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'transparent', border: '1px solid #ff6b00',
            color: '#ff6b00', borderRadius: 8, padding: '7px 18px',
            fontFamily: 'Inter', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
        >
          הצטרפות / כניסה
        </button>
        <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#ffb693', letterSpacing: '-0.02em' }}>
          DunkTime
        </span>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '92dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 80px', textAlign: 'center' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.25)',
        }} />
        {/* Orange glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.12) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 480 }}>
          {/* Ball icon */}
          <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🏀</div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(40px, 10vw, 64px)',
            color: '#ffb693', margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.03em',
          }}>
            DunkTime
          </h1>
          <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 'clamp(14px, 4vw, 20px)', color: '#ff6b00', margin: '0 0 24px', letterSpacing: '0.05em' }}>
            ברוכים הבאים
          </p>

          {/* Tagline */}
          <p style={{ fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: 800, fontFamily: 'Montserrat', margin: '0 0 12px', color: '#fff', lineHeight: 1.3 }}>
            מוצאים.&nbsp;מצטרפים.&nbsp;משחקים.
          </p>
          <p style={{ fontSize: 16, color: '#c8c6c5', margin: '0 0 48px', lineHeight: 1.6, maxWidth: 360, marginInline: 'auto' }}>
            הצטרף לאלפי שחקנים שמוצאים משחקי כדורסל פעילים בכל עיר בישראל
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#ff6b00', color: '#561f00',
              border: 'none', borderRadius: 14, padding: '16px 48px',
              fontFamily: 'Montserrat', fontWeight: 900, fontSize: 18,
              cursor: 'pointer', letterSpacing: '0.02em',
              boxShadow: '0 8px 32px rgba(255,107,0,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,107,0,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,0,0.4)' }}
          >
            התחילו לשחק ↓
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2, opacity: 0.5, animation: 'bounce 2s infinite' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ffb693' }}>keyboard_arrow_down</span>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px', background: '#161616' }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 'clamp(24px, 6vw, 36px)', textAlign: 'center', color: '#ffb693', marginBottom: 48 }}>
          למה DunkTime?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480, margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(30,30,30,0.8)', border: '1px solid rgba(255,107,0,0.15)',
              borderRadius: 16, padding: '24px 20px',
              display: 'flex', alignItems: 'flex-start', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,107,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#ff6b00' }}>{f.icon}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#e5e2e1', margin: '0 0 6px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#a98a7d', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Court photos ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <img src={COURT_IMG1} alt="מגרש כדורסל" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
          <img src={COURT_IMG2} alt="מגרש כדורסל" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 'clamp(20px, 5vw, 28px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.4 }}>
            מגרשים אמיתיים בכל עיר
          </p>
          <p style={{ fontSize: 15, color: '#c8c6c5', maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>
            מאגר מלא של מגרשי כדורסל בתל אביב, ירושלים, חיפה ועוד 15 ערים ברחבי הארץ — כולל כתובות, סוג משטח ותאורת לילה
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: '#161616' }}>
        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 'clamp(24px, 6vw, 36px)', textAlign: 'center', color: '#ffb693', marginBottom: 48 }}>
          איך זה עובד?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: '#ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#561f00',
              }}>
                {s.num}
              </div>
              <div style={{ textAlign: 'right', flex: 1 }}>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#e5e2e1', margin: '0 0 4px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#a98a7d', margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final photo + CTA ── */}
      <section style={{ position: 'relative' }}>
        <img src={COURT_IMG3} alt="מגרש כדורסל" style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block', filter: 'brightness(0.35)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: 24,
        }}>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(24px, 6vw, 36px)', color: '#fff', margin: '0 0 16px' }}>
            מוכן לשחק?
          </h2>
          <p style={{ fontSize: 15, color: '#c8c6c5', margin: '0 0 28px' }}>הצטרף עכשיו — בחינם לחלוטין</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#ff6b00', color: '#561f00',
              border: 'none', borderRadius: 12, padding: '14px 40px',
              fontFamily: 'Montserrat', fontWeight: 900, fontSize: 16,
              cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,0,0.5)',
            }}
          >
            הצטרף עכשיו
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #2a2a2a' }}>
        <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 18, color: '#ffb693', margin: '0 0 8px' }}>DunkTime</p>
        <p style={{ fontSize: 12, color: '#5a4136', margin: 0 }}>© 2026 כל הזכויות שמורות</p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  )
}
