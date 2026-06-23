import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const conversations = [
  {
    id: 1,
    name: 'משחק בפארק הירקון',
    lastMsg: 'מישהו מביא כדור חדש?',
    time: '10:45',
    unread: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtHKus1FvQi5oUmgwQ68ldigsjpAsgQkjAsaZMCzPncc17fO2sQJ2jgS9X3T_ElEwVKzPy2oaDKBC8mVuWOW32Df7EtGPhe9HAZz--88znclUI7QG3odRLpPVcC09cz8onDyaSg3dEWNo3uDHcNdow36kofp5vPSbYwPNyqiRhPapSRrgXLWPqbc3tuqAANcQtQDsjRvZEt6haRZeYEvEyDpLQdWNgOVgYiTRzYcusyZGm11-uPxUkCCCIFvQBz-GRGy9CRlV_GBs',
  },
  {
    id: 2,
    name: 'עידו',
    lastMsg: 'סגרנו על 20:00 במגרש הצפוני.',
    time: 'אתמול',
    unread: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7Asx5mk_wvyVct1e2ciH4Tpy5RjgyHPdK2jugyRBC9oKSlYxOH_l-yLzUItv6HLuO19kh23K_eWpt_cVT5WT0LM3C49LUgAbWhwmSO_yDT4tlFw8J3yBHKkHNGQpAqcsLZpQfbpZU0H9H-_wcQE85YkbDXkL7KgI1ND2DzbxFjQXvqo1Cus6IR5iIUKiC27uPvbvYYJZPek4lMgXSh_hh8xPEjlfeK_y8gbw_1iC4iWgbsha2JCS802J1blsO1cWSrbl38TflcY',
  },
  {
    id: 3,
    name: 'נועה',
    lastMsg: 'תוסיף אותי לקבוצה של יום שלישי',
    time: 'אתמול',
    unread: true,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGQxF8tjw0XMpYpw0Nv1lX2aVaTZf6if66TpENmTO2dchjMR8dtpRTk8uLTwfy3EJXgH8B1Sf4mDjQLCdk12hJNAjUorznr8MU8KkXWwpddUCgwQeKRg5WlRfHbrtNhDeTIT4qZ8I2C5TJV61uWVnQQqLlKuLPQyiRSFME0Ha--f8yTNa3dIwwoz3n6HhcFGAm3Gize2RCTDHs1eBTSHwHCWEpDzEisnLLRhWM7TPK1n5wGBiIzK-NTYSqh6ldUlFJFtTgxq2bll0',
  },
  {
    id: 4,
    name: 'ליגת השכונות - גבעתיים',
    lastMsg: 'פורסם לוח המשחקים המעודכן לסופ"ש.',
    time: '02/11',
    unread: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmm9kshfSSNY0jbzk_KRfP4-ZGvs5_JQbXLD8MkPDQ0W5MZPk7NrvOKll8u_6xWUwVbE2ZLqCAElp52MK9MUKv_pWYrLFp3rgx68PTHuraLal1Nwq5pw5Zf_vq1XMPYGuA_ychVCIr8PGv3YdvVrVhIuOJJhZU-cFkpHBdVpMyq0eXpyYnDrPZKRtRvuvVPgB7s5NvLIqJqp83vXk1YW8xaf0OeYaHRXORzbkSyG3RJE5gwphUrm5xfrJfxC8uRp2uMwYyu_o-_zE',
  },
  {
    id: 5,
    name: 'מאמן יוסי',
    lastMsg: 'אימון אישי מחר ב-16:00.',
    time: '28/10',
    unread: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXDek2xw_LffwDAY07B-GU4Xjhs1X5wWozp0C_aWZWq-OMfFNVfv_C_guiqsP2yxpSa_aleW9fI_V8_JoZoJ3b465ETv_peew9AwtX2J4mWZrvfBb8vDHJin-65PnhshfBaF_DZPBc0ZtV-84XSd8StV-8SO2c1FiYHwiltljKxHuORKXwkXUi2-JBhu9FZQkcXjRq2kmkFEQ4ppRAlRzxKxCn7GEuuYu1_69-8VZ1_UuUa5Zh-WzEvGUbshbgZbUq3GQd9PkJQG0',
  },
  {
    id: 6,
    name: 'משחק פתוח - ספורטק',
    lastMsg: 'מי בא?',
    time: '25/10',
    unread: false,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK5AQ3sY9uOpCZvTHAv65xb5xOEDXvaLhXW5bq2o5_SagaplxR3sPe9BUjXapNgAzCo31UGKiG8AE2u9WcHqW8_K9Za0PYz_csLENfu1abVrDMTw9MAPnF_nwZ1JG_Lr1d6dOD-LuYqT6VOOCFP_od9b1lqSd28WymymO7qBeSpjBKsnuUHNhNFy6PaYAqw54lCGGjYcC4DwmgLqpdQWKgiCEyOrxs5GLbc6kBvHo9n47q9fVXSbpdhTC3Gfc1vCGzB3BE9EgnCqI',
  },
]

export default function MessagesList() {
  const navigate = useNavigate()

  return (
    <div className="bg-background flex flex-col min-h-screen text-on-surface">

      {/* ── Page header ── */}
      <div className="flex flex-row-reverse justify-between items-center px-4 pt-4 pb-2">
        <h1 className="t-headline-lg text-primary-container italic" style={{ margin: 0 }}>הודעות</h1>
        <div className="flex items-center gap-3">
          <button className="active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
          <button className="active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant">menu</span>
          </button>
        </div>
      </div>

      {/* ── List ── */}
      <main className="flex-grow pb-24 overflow-y-auto">
        <div className="flex flex-col">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              className="px-4 py-4 flex flex-row-reverse items-center border-b border-white/5 cursor-pointer transition-colors active:bg-surface-variant w-full text-right"
              style={{ backgroundColor: conv.unread ? '#201f1f' : '#131313' }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  className={`w-14 h-14 rounded-full object-cover ${conv.unread ? 'border-2 border-primary-container' : ''}`}
                  src={conv.img}
                  alt={conv.name}
                />
                {conv.unread && (
                  <span
                    className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary-container rounded-full border-2 border-surface"
                    style={{ boxShadow: '0 0 8px rgba(255,107,0,0.4)' }}
                  />
                )}
              </div>

              {/* Text */}
              <div className="flex-grow flex flex-col mr-4 min-w-0">
                <div className="flex justify-between items-center flex-row-reverse">
                  <span
                    className="t-label-lg truncate"
                    style={{ color: conv.unread ? '#ff6b00' : '#e5e2e1' }}
                  >
                    {conv.name}
                  </span>
                  <span className="t-label-sm text-on-surface-variant flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <p
                  className="t-body-md truncate text-right"
                  style={{ color: conv.unread ? '#e5e2e1' : '#c8c6c6', fontWeight: conv.unread ? 700 : 400 }}
                >
                  {conv.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        className="fixed bottom-24 left-6 w-14 h-14 bg-primary-container text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all duration-150 z-40"
        style={{ boxShadow: '0 8px 20px rgba(255,107,0,0.3)' }}
      >
        <span className="material-symbols-outlined text-3xl icon-fill">add_comment</span>
      </button>

      <BottomNav />
    </div>
  )
}
