import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const MAP_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBP9hYT4fae1R6FZwoR92xl8wrQBrT-VgHGfNnCxlqkcSGYWEf_I1TgQvr_PwO7Mvji8jyG3iqQ8NAKRjRVPX1tBkFZFqCUfby8qFOCi8DUJZUrdvgQMfLadfiClFYhIIdCDn9uzDdM0JRGnj_WaF3zM-JLd0Y4YHWDcusBBXc-CJ_ggw_u_7SgNKoNR9E-UEN5cUIlyqZiehXqzbovVNNqtspk-jOMtuoQCvJ5WbJzTOp4nWcbmTFgzhjM8OjFOL-KlLzHn1WorR8'

const courts = [
  {
    id: 1,
    name: 'פארק הירקון',
    area: 'תל אביב - צפון',
    distance: '0.8 ק"מ',
    players: 8,
    live: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWI6dapmDWVQlCAeSLKdiGsEiuZ815TljgdgOJlzILkZPSG1MAJOH9GDPc8A_4ry72tSpK56mtVYl1VFBx5y1plg8Wen0JY1vOBktYPW6lg7EXjusSTQ_h3tU9U355ZscONY5VnXkCGROc2imFQIcsEyycGnAeeuELBaK4P_rO2KGt81DLxLPAB2g6PBfSY5iT7Remf3rqPL2_WPLRfWxyEGoYxNnuxF49hhkmPMF0H_1mdi5KNV8wws6a2aMMKDsk5D0V6iPim9c',
  },
  {
    id: 2,
    name: 'מגרש "הכלוב"',
    area: 'יד אליהו',
    distance: '1.2 ק"מ',
    players: 2,
    live: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0fk7FV2VM8zpi9BSJU-40k9CAcuhHnWlvLTKhqTTOd8XCA8auvhOoU5lBAAWCiVCBTQpC9ZABumPMl3UbfW0hzVQ48bbxXcVIxsO9Q1JC4WkHDX95wdtDt0Fe-JP1LGQfJRZLl-sRqIlZLNoqFCN96dm9ntMmLf3b6KnDhrhw4ZQ0Sxzm2Yvu8sSCOWyY8wJmnW6jRH4sCj-hxS2ZKZXYNCxTYNbzTfAZgvyePzGK6MU9fl410f8Fvx2XZ6o_gxlqwdOtYcdB9iI',
  },
  {
    id: 3,
    name: 'ספורטק דרום',
    area: 'דרך הטייסים',
    distance: '2.5 ק"מ',
    players: 14,
    live: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmq5BIcmCBRARiQ0YRsjFZfcAeDr3TyDeM0WZMeoM0jnwvIHHleec3wLKVz6bewzfExdn03DIpiodInnwu9oUJkpq_TwXzNFhhIg-GNuOLiZugxsSK96hkPXpzkrfk-eDQwpBkNRdmflF-Lksyq4uaPl6F4ptsCbxme8jXVkaFevdz2ex1vrjPmQvVn-JCcpOJuRe1e6wIz0mf8crfp5NQ6wxmivrrFY79Q6Aeo9BRwrMqAMOO6T1Q0Db3aP7ZX0OT7h_fk4utOgI',
  },
  {
    id: 4,
    name: 'מרכז הספורט אבני',
    area: 'רמת גן',
    distance: '3.1 ק"מ',
    players: 0,
    live: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzRkWYMb4-Bh2aTy_lyp29yxa-1OCLq5ofbpJJDvctEoJKC3c1G-nw5gayvoCzVTxsE6LRqECzt8oQZIFju9UAPNueFTrYhML6MWzjsEtoazAQtrRyOhsUW9yYlAV6-FLj-J5lOeYLk7uq9L2-MnhSGK1xbZeRBLEScNIaxjWBrNtzSRhwpuWVCE2j-5H--6I1ChKMj4--dhPBL0fdNKkFo8Kp632bIVAWGT17Vb0og0C3xDixg-f66FZZwJjP0eGLtQq6ioTHp5o',
  },
]

const FILTERS = ['מרחק', 'מקורה/פתוח', 'מספר שחקנים פעילים', 'דירוג']

export default function CourtsList() {
  const [activeFilter, setActiveFilter] = useState('מרחק')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = courts.filter(c =>
    c.name.includes(search) || c.area.includes(search)
  )

  return (
    <div className="bg-background min-h-screen pb-20 text-on-surface overflow-x-hidden">

      {/* ── Search bar ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none">search</span>
          <input
            type="search"
            placeholder="חיפוש מגרש"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-full pr-10 pl-4 py-2 t-body-md text-on-surface placeholder:text-on-surface-variant/40"
            style={{ color: '#e5e2e1' }}
          />
        </div>
      </div>

      <main>

        {/* ── Filter chips ── */}
        <section className="py-4 bg-surface-container/50 border-b border-surface-variant/30 overflow-x-auto no-scrollbar whitespace-nowrap flex gap-3 px-4">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full t-label-lg flex items-center gap-2 flex-shrink-0 transition-colors"
              style={{
                backgroundColor: activeFilter === f ? '#ff6b00' : '#353534',
                color: activeFilter === f ? '#572000' : '#e2bfb0',
                border: activeFilter === f ? 'none' : '1px solid rgba(90,65,54,0.3)',
              }}
            >
              {f}
              {activeFilter === f && (
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>keyboard_arrow_down</span>
              )}
            </button>
          ))}
        </section>

        {/* ── Map preview ── */}
        <section className="relative w-full h-[220px] overflow-hidden">
          <div
            className="absolute inset-0 bg-surface-container-lowest bg-cover bg-center"
            style={{ backgroundImage: `url('${MAP_IMG}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          <div className="absolute bottom-4 right-4 glass-card px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>map</span>
            <span className="t-label-lg text-on-surface">צפה במפה המלאה</span>
          </div>
        </section>

        {/* ── Court list ── */}
        <section className="px-4 mt-8">
          <div className="flex justify-between items-end mb-5">
            <span className="t-label-sm text-primary">12 נמצאו</span>
            <h2 className="t-headline-lg-m text-on-surface">מגרשים בסביבה</h2>
          </div>

          <div className="flex flex-col gap-5">
            {filtered.map(court => (
              <button
                key={court.id}
                onClick={() => navigate(`/courts/${court.id}`)}
                className="relative bg-surface-container rounded-xl overflow-hidden border border-surface-variant transition-all hover:border-primary-container/50 active:scale-[0.98] text-right w-full"
              >
                <div className="flex h-32">
                  {/* Image (left in RTL = end) */}
                  <div className="w-1/3 relative flex-shrink-0">
                    <img className="w-full h-full object-cover" src={court.img} alt={court.name} />
                    <div className="absolute inset-0 bg-gradient-to-l from-surface-container to-transparent" />
                  </div>
                  {/* Info */}
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="t-label-sm text-on-surface-variant">{court.distance}</span>
                        <h3 style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 700 }} className="text-on-surface leading-tight">
                          {court.name}
                        </h3>
                      </div>
                      <p className="t-body-md text-on-surface-variant text-right">{court.area}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      {court.live ? (
                        <>
                          <span className="t-label-lg text-primary">{court.players} שחקנים פעילים</span>
                          <div className="w-2.5 h-2.5 bg-primary-container rounded-full pulse-orange" />
                        </>
                      ) : (
                        <>
                          <span className="t-label-lg text-on-surface-variant">{court.players} שחקנים כרגע</span>
                          <div className="w-2.5 h-2.5 bg-secondary rounded-full opacity-50" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {court.live && (
                  <div className="absolute top-2 left-2 bg-primary-container text-on-primary-container px-2 py-0.5 rounded t-label-sm uppercase font-bold">
                    Live
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
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
