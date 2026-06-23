import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection/HeroSection'
import CourtCard from '../components/CourtCard/CourtCard'
import GameCard from '../components/GameCard/GameCard'
import BottomNav from '../components/BottomNav'

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYLPUVteqmMo4Nc2_qLX2S8xNkOmVGjTRvnvzH6skr9aWRLfuhE0CofvgeA_db2w4kl1RsewvZGkDA1AEPZutAdEhUZmHT3_N0DOjZdWtN71bUz-YpqvI7cTprm9YZ8tumeNbe9KLs-lBXhksS9y6WcuVhEBH0H7WctiWHYzqrNOqUzAP4W-J_ddBixZOr8q2ru_gzMlW2QGRLiPRCAJlj7EFAFjOvnN_58UBheiXVo83KFFpPez6fVJa49VPKSuG0TLdfYVnnAuw'


const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAnb8SO8UuL8dhbU_BkBJPw7Z6nJnSIRkB-rZdeswNXnzGXkCUFlp7ZYHpK7FPdbn9RkyNdZT-qn7kZZnWxAzTsU_X64EBTAGEN3qyT89S5ixmxLw2Mzv0hXz0H4MJljlyw-KXGTTovKnOuuTa1U3OSW1Ij1O7sBuoKNOvgwgDk6rCinlvduuh2grX01KkCe3DzvETEd5Ssguw_dMR1hhK5tFSehwgUnT1nt-sn1oSkY9cNk5EnhRn-9jVuGCzpur7_FSWoKvYjgr0'

const courts = [
  {
    id: 1,
    name: 'פארק הירקון',
    location: '0.8 ק״מ ממך',
    activePlayers: 8,
    isLive: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARLij33z_3o0owWTW6kGRRg2DvvOeAnp0f8fbQExrOAOpxoMYnGrEeyqS6Ds4-FQqEUKYH3IBHZfRpw5kc8sVWpSKIuHFWIeQ6AELY1nffppsyCXgX4GEMaUfUgy_LfqOhUzcnjrJrZYBCAspQ0iGNNQyvfMlADFZ14YZ_VhlQ1f6v5L0a4EmdqVCTAD57pfSdxi7Td-jEgm8w5quktYDnNPJYXZ4TagbDbcLFcWoaC0q8fXnctx0JZlm-vr8Jup25aJJP6_272Ys',
  },
  {
    id: 2,
    name: 'מגרש הספורטק',
    location: '1.2 ק״מ ממך',
    activePlayers: 4,
    isLive: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6szItFPRMSWY0ZCTa6P5tRF0yZuujrzyduD_ZHS-ebK5tJhhGyUsItPFjasPWb1UxVvNNRa5UuaWOyehdYw6psM65hFhFq8HdUZ8mN4wHbZXSR07dozXulFVDK9PoMa7F-IRErdapMzb1YxZjyOxPVY9ZMNz657ZoVxHt6ysvGnq34kZH0shW3DYka9B0fLTyRTe0zLMla2H8Ulz2DMGa_UPrsvuVFGMuHZVz8MIkWfnalM0cARHh5LKEPG3oIe7n7oiXOQqgjis',
  },
  {
    id: 3,
    name: 'מתחם יד אליהו',
    location: '2.5 ק״מ ממך',
    activePlayers: 12,
    isLive: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLyticVE9SBkC2cA9LZkCc2XpU_EvAqeLNwPtgGfSh76QWNc0ems3DSXICkh9dwy1woeVz7PxSGrysEs3r3pJaa8W5-FjUEjD5RthJdvTrQft3jkL54AY02l4idx1vmkDzqoG9vn7anebVXH5WXdAiY_dI7sy1nQoIsUztBp7wq0iULn8fcacym_ERV7cG_RArs58Q8ygEOtXWxtWPTzjFBqgaUimSwjzdeUUFRCg50FKpSYZ9xTQ1hHZ4fP1bmN-T8jMvLJKxPeI',
  },
]

const games = [
  { id: 1, time: '17:30', court: 'פארק דרום - מגרש 2', currentPlayers: 6,  maxPlayers: 10, label: '4 מקומות נותרו', isHighlight: true,  isFull: false, isDanger: false },
  { id: 2, time: '19:00', court: "תיכון עירוני ד'",    currentPlayers: 9,  maxPlayers: 10, label: 'מקום אחרון!',    isHighlight: false, isFull: false, isDanger: true  },
  { id: 3, time: '20:15', court: 'גן מאיר',             currentPlayers: 10, maxPlayers: 10, label: 'המשחק מלא',     isHighlight: false, isFull: true,  isDanger: false },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div dir="rtl" style={{ background: 'var(--color-background)', minHeight: '100dvh', paddingBottom: 96, color: 'var(--color-text-primary)' }}>

      <main style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

        {/* ── Personal greeting ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{
            position: 'relative', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-full)', background: '#2a2a2a',
            border: 'none', cursor: 'pointer', flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>notifications</span>
            <span style={{
              position: 'absolute', top: 8, right: 8, width: 8, height: 8,
              background: 'var(--color-accent)', borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-surface)',
            }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{ textAlign: 'right' }}>
              <p className="t-headline-md" style={{ color: 'var(--color-primary)', margin: 0, lineHeight: 1.2 }}>שלום, ג׳ייסון</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.7, justifyContent: 'flex-end' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                <span className="t-label-sm">מרכז העיר, תל אביב</span>
              </div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: '12px', overflow: 'hidden',
              border: '2px solid var(--color-accent)', flexShrink: 0,
            }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={AVATAR_URL} alt="פרופיל" />
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        <HeroSection
          img={HERO_IMG}
          title="מצא משחק בקרבתי"
          ctaLabel="לחץ כאן"
          onCta={() => navigate('/courts')}
        />

        {/* ── Live Courts ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <button
              onClick={() => navigate('/courts')}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ראה הכל
            </button>
            <h3 className="t-headline-md" style={{ margin: 0 }}>מגרשים פעילים בקרבת מקום</h3>
          </div>

          <div style={{
            display: 'flex',
            gap: 'var(--space-md)',
            overflowX: 'auto',
            margin: '0 calc(-1 * var(--space-md))',
            padding: '8px var(--space-md)',
            scrollbarWidth: 'none',
          }}
            className="no-scrollbar"
          >
            {courts.map(court => (
              <CourtCard
                key={court.id}
                name={court.name}
                location={court.location}
                activePlayers={court.activePlayers}
                isLive={court.isLive}
                img={court.img}
                onClick={() => navigate(`/courts/${court.id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── Upcoming Games ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <h3 className="t-headline-md" style={{ margin: 0 }}>משחקים קרובים היום</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {games.map(game => (
              <GameCard
                key={game.id}
                time={game.time}
                court={game.court}
                currentPlayers={game.currentPlayers}
                maxPlayers={game.maxPlayers}
                label={game.label}
                isHighlight={game.isHighlight}
                isFull={game.isFull}
                isDanger={game.isDanger}
              />
            ))}
          </div>
        </section>
      </main>

      {/* ── FAB ── */}
      <button
        onClick={() => navigate('/create-game')}
        className="orange-glow-lg"
        style={{
          position: 'fixed',
          bottom: 96,
          right: 'var(--space-md)',
          width: 56, height: 56,
          background: '#ff6b00',
          color: '#561f00',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 40,
          cursor: 'pointer',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>add</span>
      </button>

      <BottomNav />
    </div>
  )
}
