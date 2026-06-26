import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MessagesList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    supabase
      .from('game_players')
      .select('games(id, scheduled_date, scheduled_time, team_name, courts(name), game_players(user_id))')
      .eq('user_id', user.id)
      .then(async ({ data }) => {
        const games = (data ?? []).map(r => r.games).filter(Boolean)
          .sort((a, b) => a.scheduled_date?.localeCompare(b.scheduled_date))

        // Fetch last message for each game
        const withLastMsg = await Promise.all(
          games.map(async game => {
            const { data: msgs } = await supabase
              .from('messages')
              .select('content, created_at, user_id')
              .eq('game_id', game.id)
              .order('created_at', { ascending: false })
              .limit(1)
            return { ...game, lastMessage: msgs?.[0] ?? null }
          })
        )

        setChats(withLastMsg)
        setLoading(false)
      })
  }, [user])

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })
  }

  const formatTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-background flex flex-col min-h-screen text-on-surface" dir="rtl">

      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 pb-3">
        <h1 className="t-headline-lg text-primary-container italic" style={{ margin: 0 }}>הודעות</h1>
      </div>

      {/* List */}
      <main className="flex-grow pb-24 overflow-y-auto">

        {loading && (
          <div className="flex flex-col">
            {[1,2,3].map(i => (
              <div key={i} className="px-4 py-4 flex items-center gap-4 border-b border-white/5">
                <div className="w-14 h-14 rounded-full bg-surface-container animate-pulse flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-surface-container rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-surface-container rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && chats.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 56 }}>chat_bubble</span>
            <p className="t-headline-md text-on-surface">אין צ'אטים עדיין</p>
            <p className="t-body-md text-on-surface-variant">הצטרף למשחק כדי להתחיל לשוחח עם השחקנים</p>
            <button onClick={() => navigate('/')}
              className="bg-primary-container text-on-primary t-label-lg px-6 py-3 rounded-xl mt-2 active:scale-95 transition-transform">
              מצא משחק
            </button>
          </div>
        )}

        {!loading && chats.map(chat => {
          const court     = chat.courts?.name ?? 'משחק'
          const players   = chat.game_players?.length ?? 0
          const lastMsg   = chat.lastMessage
          const isMyMsg   = lastMsg?.user_id === user?.id
          const lastRead  = localStorage.getItem(`read_${chat.id}`)
          const hasUnread = lastMsg && !isMyMsg && (
            !lastRead || new Date(lastMsg.created_at) > new Date(lastRead)
          )

          return (
            <button
              key={chat.id}
              onClick={() => navigate(`/messages/${chat.id}`)}
              className="w-full px-4 py-4 flex items-center gap-4 border-b border-white/5 active:bg-surface-variant transition-colors text-right"
              style={{ background: hasUnread ? '#1a1810' : lastMsg ? '#201f1f' : '#131313' }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center"
                  style={{ border: hasUnread ? '2px solid #ff6b00' : '2px solid #353534' }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>sports_basketball</span>
                </div>
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary-container rounded-full border-2 border-surface" />
                )}
              </div>

              {/* Info */}
              <div className="flex-grow flex flex-col min-w-0">
                <div className="flex justify-between items-center">
                  <span className="t-label-sm text-on-surface-variant flex-shrink-0">
                    {lastMsg ? formatTime(lastMsg.created_at) : formatDate(chat.scheduled_date)}
                  </span>
                  <div className="flex flex-col items-end min-w-0">
                    <span className="t-label-lg text-on-surface truncate">{court}</span>
                    {chat.team_name && (
                      <span style={{ fontSize: 11, color: '#ff6b00', fontWeight: 600 }}>{chat.team_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="t-label-sm text-on-surface-variant">{players} שחקנים</span>
                  {lastMsg ? (
                    <p className="t-body-md truncate text-right" style={{ color: '#c8c6c6', maxWidth: '60%' }}>
                      {isMyMsg ? 'אתה: ' : ''}{lastMsg.content}
                    </p>
                  ) : (
                    <p className="t-body-md text-on-surface-variant" style={{ fontSize: 13 }}>
                      {chat.scheduled_time?.slice(0,5)} · {formatDate(chat.scheduled_date)}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </main>

      <BottomNav />
    </div>
  )
}
