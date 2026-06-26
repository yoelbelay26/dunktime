import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ChatView() {
  const { id: gameId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [game,        setGame]        = useState(null)
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [authorized,  setAuthorized]  = useState(null) // null=loading, true/false
  const [sending,     setSending]     = useState(false)
  const [profiles,    setProfiles]    = useState({})   // { user_id: { name, avatar } }
  const [playerModal, setPlayerModal] = useState(null) // player profile to show
  const messagesRef = useRef(null)

  // Check if user is a participant + load game info
  useEffect(() => {
    if (!user || !gameId) return

    async function init() {
      const [gameRes, playerRes] = await Promise.all([
        supabase
          .from('games')
          .select('id, scheduled_date, scheduled_time, team_name, courts(name), game_players(user_id)')
          .eq('id', gameId)
          .single(),
        supabase
          .from('game_players')
          .select('user_id')
          .eq('game_id', gameId)
          .eq('user_id', user.id)
          .single(),
      ])

      if (playerRes.error || !playerRes.data) {
        setAuthorized(false)
        return
      }

      setGame(gameRes.data)
      setAuthorized(true)

      // Load profiles for all players
      const playerIds = (gameRes.data?.game_players ?? []).map(p => p.user_id)
      if (playerIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', playerIds)
        const map = {}
        ;(profileData ?? []).forEach(p => { map[p.id] = p })
        setProfiles(map)
      }
    }

    init()
  }, [user, gameId])

  // Load messages
  useEffect(() => {
    if (!authorized || !gameId) return

    // Mark as read
    localStorage.setItem(`read_${gameId}`, new Date().toISOString())

    supabase
      .from('messages')
      .select('id, content, created_at, user_id')
      .eq('game_id', gameId)
      .order('created_at')
      .then(({ data }) => setMessages(data ?? []))
  }, [authorized, gameId])

  // Real-time subscription
  useEffect(() => {
    if (!authorized || !gameId) return

    const channel = supabase
      .channel(`game-chat-${gameId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `game_id=eq.${gameId}`,
      }, payload => {
        setMessages(prev =>
          prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new]
        )
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [authorized, gameId])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')

    const { data, error } = await supabase
      .from('messages')
      .insert({ game_id: gameId, user_id: user.id, content: text })
      .select('id, content, created_at, user_id')
      .single()

    if (!error && data) {
      // Add immediately — real-time will deduplicate
      setMessages(prev =>
        prev.some(m => m.id === data.id) ? prev : [...prev, data]
      )
    }
    setSending(false)
  }

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

  const getDisplayName = (uid) => {
    if (uid === user?.id) {
      return user?.user_metadata?.full_name ?? profiles[uid]?.full_name ?? 'אתה'
    }
    return profiles[uid]?.full_name ?? 'שחקן'
  }

  const openPlayerModal = (uid) => {
    const p = profiles[uid]
    const isMe = uid === user?.id
    setPlayerModal({
      uid,
      name:   isMe ? (user?.user_metadata?.full_name ?? p?.full_name ?? 'אתה') : (p?.full_name ?? 'שחקן'),
      avatar: isMe ? (user?.user_metadata?.avatar_url ?? p?.avatar_url ?? null) : (p?.avatar_url ?? null),
    })
  }

  // ── Loading ──
  if (authorized === null) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 36 }}>progress_activity</span>
      </div>
    )
  }

  // ── Not authorized ──
  if (!authorized) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center gap-4 text-on-surface" dir="rtl">
        <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#5a4136' }}>lock</span>
        <p className="t-headline-md text-on-surface">אין לך גישה לצ'אט הזה</p>
        <p className="t-body-md text-on-surface-variant">רק שחקנים שנרשמו למשחק יכולים לראות את ההודעות</p>
        <button onClick={() => navigate(-1)}
          style={{ background: '#ff6b00', color: '#561f00', border: 'none', borderRadius: 12, padding: '12px 28px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          חזרה
        </button>
      </div>
    )
  }

  const courtName = game?.team_name ?? game?.courts?.name ?? 'משחק'
  const gameDate  = game?.scheduled_date
    ? new Date(game.scheduled_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })
    : ''
  const gameTime  = game?.scheduled_time?.slice(0, 5) ?? ''

  return (
    <div className="bg-background flex flex-col text-on-surface" style={{ flex: 1, minHeight: 0 }}>

      {/* ── Sub-header ── */}
      <div className="bg-surface-container-low border-b border-white/10 h-14 flex flex-row items-center px-4 flex-shrink-0" dir="rtl">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform ml-3">
          <span className="material-symbols-outlined text-on-surface text-2xl" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>
            arrow_back
          </span>
        </button>
        <div className="flex flex-col flex-1">
          <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#e5e2e1' }}>
            {courtName}
          </span>
          <span className="t-label-sm text-on-surface-variant">
            {gameDate} · {gameTime} · {game?.game_players?.length ?? 0} שחקנים
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <main
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ paddingBottom: 80 }}
        dir="rtl"
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#5a4136' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>chat_bubble</span>
            <p className="t-body-md">היה הראשון לכתוב הודעה!</p>
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.user_id === user.id
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', maxWidth: '78%', gap: 3, alignSelf: isMe ? 'flex-start' : 'flex-end' }}>
              <button
                onClick={() => openPlayerModal(msg.user_id)}
                style={{ background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer', fontSize: 11, color: isMe ? '#ff6b00' : '#a98a7d', fontFamily: 'Inter', fontWeight: 600 }}
              >
                {getDisplayName(msg.user_id)}
              </button>
              <div style={{
                padding: '10px 14px', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: isMe ? '#ff6b00' : '#393939',
                color: isMe ? '#561f00' : '#e5e2e1',
                fontWeight: isMe ? 600 : 400,
                fontSize: 15, lineHeight: 1.5,
                boxShadow: isMe ? '0 2px 12px rgba(255,107,0,0.25)' : 'none',
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: 10, color: '#5a4136', alignSelf: isMe ? 'flex-start' : 'flex-end', margin: '0 4px' }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          )
        })}
      </main>

      {/* ── Input ── */}
      <footer dir="rtl" className="fixed bottom-0 w-full bg-surface-container border-t border-white/5 px-4 flex items-center gap-3"
        style={{ height: 68 }}>
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: input.trim() ? '#ff6b00' : '#353534',
            color: input.trim() ? '#561f00' : '#5a4136',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            transition: 'background 0.15s',
            boxShadow: input.trim() ? '0 0 12px rgba(255,107,0,0.4)' : 'none',
          }}>
          <span className="material-symbols-outlined font-bold" style={{ fontSize: 22, transform: 'scaleX(-1)' }}>send</span>
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="הקלד הודעה..."
          className="flex-1 bg-surface-container-highest border border-white/10 rounded-full h-11 px-5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container transition-colors t-body-md"
          style={{ color: '#e5e2e1' }}
        />
      </footer>
      {/* ── Player profile modal ── */}
      {playerModal && (
        <>
          <div onClick={() => setPlayerModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300 }} />
          <div dir="rtl" style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 301, width: 'min(88vw, 320px)',
            background: '#1c1b1b', borderRadius: 20,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,0,0.15)',
            padding: '28px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            {/* Close */}
            <button onClick={() => setPlayerModal(null)}
              style={{ position: 'absolute', top: 14, left: 14, background: 'none', border: 'none', color: '#a98a7d', fontSize: 20, cursor: 'pointer' }}>
              ✕
            </button>

            {/* Avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: 20, overflow: 'hidden',
              border: '3px solid #ff6b00',
              background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {playerModal.avatar
                ? <img src={playerModal.avatar} alt={playerModal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#ff6b00' }}>person</span>
              }
            </div>

            {/* Name */}
            <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 20, color: '#e5e2e1', margin: 0, textAlign: 'center' }}>
              {playerModal.name}
            </p>

            {playerModal.uid === user?.id && (
              <span style={{ fontSize: 12, background: 'rgba(255,107,0,0.15)', color: '#ffb693', padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                זה אתה
              </span>
            )}

            <p style={{ fontSize: 13, color: '#5a4136', margin: '4px 0 0' }}>
              שחקן DunkTime
            </p>
          </div>
        </>
      )}
    </div>
  )
}
