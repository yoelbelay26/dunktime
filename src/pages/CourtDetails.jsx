import { useNavigate, useParams } from 'react-router-dom'

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBYXV6tzmkjTclo7pyB9zRBl-euTcsLURGl8rIwqnEC1oEmtwf4hRDcHaK1zzxyCeDCYzchPEuXwUqoQh2RpMnLAiCwsu_q7OFygweYTpiEE_me1mkjmLACUEZFUQhxfdb7OUn5StVC-whzZ6JEtDP-8QNTZN3Lp7uPbuaZtoYG-HmgEDGFEbHvXy2KUnNQkH0rn4BOF0K2Hs6mdedKE50zSoqKQqdDEfATEIl2ubNr-SR2WnacHWjhDuhk_G7Q_2VnUsjYFQTkEU'

const playerImgs = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC1FQJJa3SZhxupkGekZUANJ48KnzkrkEjNwdVYV6iZjj_X38qOARarSTeGQV8evfeGF5KdTdV70J4CNLvTtpx_FF12ItNP9Fw-kvXkeP_db3B88Ack53fvevqh7Yz-6eEUq20kQD_90nf_qruQspVb2ilkGNnMyqNvhj0ykAFZp7abfKEbAcyRLr4X-168WybKaF0W-qKCcrHmBIgQu4FJTwKILCUJoXX4XaHqrij3O5OaF01E3vgp9idu-6tpE6nHW6myPHUDLvw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIJ6jcwDwtU4w0d5EqFFUtprfpi5VuI2f7Wo1d6rUvySIDTV4r30tpopt_myfpMkUKOY_StZVCkGDEMrNRpB62v1E_w5m4EiHjKzhSs3esSGPnzD5C_beugAk_j30NAbwwoD5ijfPS1FLpxyJVA2wYQHKsxXXygpheVuoB5lj9SG-9T43d6JImrUvGozfnDbvKAacMvrDJzinenXj_McSHFTL4U89io_aJxT3mgjFWrpFa5CJg2jnmaoa3XzekBVmsc_HLyY-KRv8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCek795nD9bbRU66DO6HGtDgzCQpGnfzVfQVZ406J2xzoTvteLe2ap76veNvdkpg61ZwxJOshtdhLyQyQ1hKfn2aYAWz9_Vc9CqUmBODu2lEBiacebLcbjtBBBbPe2gPYHLxjQZh3KVwJAAnXH8Dk-m6AY-3we3TYQDXbKLQPLnIRiLTekKuP3yKcL0jD623w6ZMZmNyXTDhsdMHWqDd-l9-UszSoVBb-fTsF4ffwIC9b5XjW8dICUgy14Bc4YM3kdAqs4v_TqQmec',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA6zzEub04ctDDWORqRZoSWXtNFVJCzZwWanXQfNzQVIkvz8kpp7a572ANRth8B1-H1HXfQdDWokp5L2yYCMMoYQlKcuqeyGDKTc2u-sX5uI94Y6-N7tr0pgsc2CFBTX7VZc-bwoHamyWRjSD3iv19qtNk3Zrfhcev-KvGFfh0tKZCz-DgGsJe4Ri53Ch7eUxpbnjmudcQniqORgcolTRMJNgKLqr2KEkHvPGsN9afHFOX3aE2VcU3ROefWnjuyRn3yxRwZrbLxhs0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDk9xFlVUDV8L5qCUhFeOiVnqRF8OlRMQLQVV16yhrH9rYeqNd4fO-5I15K7c5w_W-RUg7i3WyzwZ975zCrnvmkHTeKWReLRtG_zS_NVNSqA0jg5dvsoDZOqUmk44A7FqD47QhSTr-PXN3kcOOCDzq71EJqNHhIccEHMM4cR-feT8xDH9jj0Hi1Fh5f8Nc1_wU10sEY6nUA6XKHzhmbkFNaqwFAZHm3GjGcBxNvOEf4B8P7jDEdlIa48AAJQMTh1cBwccyWi1CRoo',
]

const players = [
  { name: 'עידו', active: true },
  { name: 'רוני', active: false },
  { name: 'גיא', active: false },
  { name: 'איתי', active: false },
  { name: 'מאיה', active: false },
]

const games = [
  { id: 1, time: '17:30', title: 'משחק פתוח 5 על 5', current: 8, max: 10, organizer: 'עידו (מארגן)', active: true },
  { id: 2, time: '19:45', title: 'אימון קליעות קבוצתי', current: 3, max: 4, organizer: 'יוסי', last: true },
]

const stats = [
  { icon: 'sports_basketball', label: 'סוג משטח',   value: 'אספלט מקצועי' },
  { icon: 'adjust',            label: 'מספר סלים',  value: '4 סלים תקניים' },
  { icon: 'dark_mode',         label: 'תאורה לילית', value: 'פעילה עד 23:00' },
  { icon: 'schedule',          label: 'שעות פתיחה', value: '06:00 - 00:00' },
]

export default function CourtDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="bg-background min-h-screen pb-32 text-on-surface">

      {/* ── Hero ── */}
      <section className="relative h-[397px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(19,19,19,1) 0%, rgba(19,19,19,0.4) 50%, rgba(19,19,19,0) 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-right">
          <h2 className="t-headline-lg-m text-white mb-1">פארק הירקון</h2>
          <div className="flex items-center gap-1 text-on-surface-variant justify-end">
            <span className="t-body-md">שדרות רוקח, תל אביב</span>
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

      {/* ── Players here now ── */}
      <section className="mt-8">
        <div className="px-4 flex justify-between items-center mb-3">
          <span className="bg-primary-container text-on-primary-fixed px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
            LIVE
          </span>
          <h3 className="text-white" style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 700 }}>
            שחקנים כאן עכשיו
          </h3>
        </div>
        <div className="flex flex-row-reverse gap-4 overflow-x-auto px-4 no-scrollbar">
          {players.map((p, i) => (
            <div key={p.name} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`w-16 h-16 rounded-full p-0.5 border-2 ${p.active ? 'border-primary' : 'border-surface-variant'}`}>
                <img className="w-full h-full rounded-full object-cover" src={playerImgs[i]} alt={p.name} />
              </div>
              <span className="t-label-sm text-on-surface">{p.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-surface-variant p-0.5">
              <div className="w-full h-full rounded-full bg-surface-variant flex items-center justify-center t-label-lg text-primary font-bold">
                +12
              </div>
            </div>
            <span className="t-label-sm text-on-surface-variant">נוספים</span>
          </div>
        </div>
      </section>

      {/* ── Upcoming games ── */}
      <section className="mt-8 px-4">
        <h3 className="text-white mb-3" style={{ fontFamily: 'Montserrat', fontSize: 20, fontWeight: 700 }}>
          משחקים קרובים במגרש
        </h3>
        <div className="flex flex-col gap-3">
          {games.map(game => (
            <div
              key={game.id}
              className="bg-surface-container rounded-xl p-4 flex justify-between items-center transition-all active:scale-[0.98] hover:bg-surface-container-high cursor-pointer"
              style={{
                borderRight: game.active ? '4px solid #ffb693' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex flex-col items-end gap-1">
                {game.last && (
                  <span className="text-primary font-bold uppercase" style={{ fontSize: 10 }}>ספוט אחרון!</span>
                )}
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-tighter active:scale-90 transition-transform">
                  הצטרף
                </button>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="t-label-lg text-white">{game.title}</span>
                  <span className="w-1 h-1 bg-on-surface-variant rounded-full" />
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}
                        className={game.active ? 'text-primary' : 'text-on-surface-variant'}>
                    {game.time}
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div className="flex items-center gap-1">
                    <span className="t-label-sm text-on-surface-variant">{game.organizer}</span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>person</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="t-label-sm text-on-surface-variant">{game.current}/{game.max} שחקנים</span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 14 }}>groups</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAB – "Create game here" ── */}
      <button
        onClick={() => navigate('/create-game')}
        className="fixed bottom-24 left-6 bg-primary-container text-on-primary-container flex items-center gap-2 px-6 py-4 rounded-full font-bold z-40 active:scale-90 transition-all hover:brightness-110 orange-glow"
      >
        <span className="material-symbols-outlined font-black">add</span>
        <span className="t-label-lg">צור משחק כאן</span>
      </button>
    </div>
  )
}
