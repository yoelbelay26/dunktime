import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import HeroSection from '../components/HeroSection/HeroSection'
import CourtCard from '../components/CourtCard/CourtCard'
import GameCard from '../components/GameCard/GameCard'
import BottomNav from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAnb8SO8UuL8dhbU_BkBJPw7Z6nJnSIRkB-rZdeswNXnzGXkCUFlp7ZYHpK7FPdbn9RkyNdZT-qn7kZZnWxAzTsU_X64EBTAGEN3qyT89S5ixmxLw2Mzv0hXz0H4MJljlyw-KXGTTovKnOuuTa1U3OSW1Ij1O7sBuoKNOvgwgDk6rCinlvduuh2grX01KkCe3DzvETEd5Ssguw_dMR1hhK5tFSehwgUnT1nt-sn1oSkY9cNk5EnhRn-9jVuGCzpur7_FSWoKvYjgr0'

function getWazeUrl(court) {
  const q = encodeURIComponent(
    [court?.name, court?.address, court?.neighborhood].filter(Boolean).join(' ')
  )
  return `https://waze.com/ul?q=${q}`
}

function deriveGameProps(game) {
  const currentPlayers = game.game_players?.length ?? 0
  const maxPlayers     = game.max_players ?? 10
  const spotsLeft      = maxPlayers - currentPlayers
  const isFull         = spotsLeft <= 0
  const isDanger       = spotsLeft === 1 && !isFull
  const label = isFull ? 'המשחק מלא' : isDanger ? 'מקום אחרון!' : `${spotsLeft} מקומות נותרו`
  return {
    id: game.id, time: game.scheduled_time?.slice(0, 5) ?? '--:--',
    court: game.courts?.name ?? 'מגרש לא ידוע',
    currentPlayers, maxPlayers, label, isFull, isDanger, isHighlight: !isFull && !isDanger,
  }
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile,       setProfile]      = useState(undefined)
  const [courts,        setCourts]       = useState([])
  const [myGames,       setMyGames]      = useState([])
  const [games,         setGames]        = useState([])
  const [loading,       setLoading]      = useState(true)
  const [gamesOpen,      setGamesOpen]     = useState(false)
  const [gamesLoading,   setGamesLoading]  = useState(false)
  const [selectedGame,   setSelectedGame]  = useState(null)
  const [myGameModal,    setMyGameModal]   = useState(null)
  const [joining,        setJoining]       = useState(false)
  const [modalProfiles,  setModalProfiles] = useState({})
  const [msgsOpen,       setMsgsOpen]      = useState(false)
  const [chats,          setChats]         = useState([])
  const [chatsLoading,   setChatsLoading]  = useState(false)
  const [unreadCount,    setUnreadCount]   = useState(0)
  const [activeChat,     setActiveChat]    = useState(null)
  const [chatMessages,   setChatMessages]  = useState([])
  const [chatInput,      setChatInput]     = useState('')
  const [chatSending,    setChatSending]   = useState(false)
  const [chatLoading,    setChatLoading]   = useState(false)
  const chatMsgsRef = useRef(null)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('full_name, avatar_url')
      .eq('id', user.id).single()
      .then(({ data }) => setProfile(data ?? null))
  }, [user])

  useEffect(() => {
    if (!user || profile === undefined) return
    const today = new Date().toISOString().split('T')[0]
    const userCity = profile?.city ?? user?.user_metadata?.city

    let courtsQuery = supabase
      .from('courts').select('id, name, neighborhood, city, has_lights').limit(5)
    if (userCity) courtsQuery = courtsQuery.eq('city', userCity)

    Promise.all([
      courtsQuery,
      supabase
        .from('game_players')
        .select('games(id, scheduled_date, scheduled_time, max_players, note, team_name, courts(name, address, neighborhood), game_players(user_id))')
        .eq('user_id', user.id),
    ]).then(([courtsRes, myGamesRes]) => {
      setCourts(courtsRes.data ?? [])
      const upcoming = (myGamesRes.data ?? [])
        .map(r => r.games).filter(Boolean)
        .filter(g => g.scheduled_date >= today)
        .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date) || a.scheduled_time?.localeCompare(b.scheduled_time))
      setMyGames(upcoming)
      setLoading(false)
    })
  }, [user, profile])

  const loadGames = async () => {
    setGamesLoading(true)
    const today = new Date().toISOString().split('T')[0]
    const userCity = profile?.city ?? user?.user_metadata?.city

    let q = supabase
      .from('games')
      .select('id, scheduled_date, scheduled_time, max_players, note, team_name, city, courts(name, address, neighborhood), game_players(user_id)')
      .gte('scheduled_date', today)
      .order('scheduled_date').order('scheduled_time')
      .limit(20)
    if (userCity) q = q.eq('city', userCity)

    const { data } = await q
    setGames(data ?? [])
    setGamesLoading(false)
  }

  const openSheet = () => {
    setGamesOpen(true)
    setSelectedGame(null)
    setModalProfiles({})
    loadGames()
  }

  const fetchModalProfiles = async (game) => {
    const ids = (game.game_players ?? []).map(p => p.user_id)
    if (!ids.length) return
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', ids)
    const map = {}
    ;(data ?? []).forEach(p => { map[p.id] = p })
    setModalProfiles(map)
  }

  const joinGame = async (game) => {
    if (joining) return
    const alreadyJoined = game.game_players?.some(p => p.user_id === user.id)
    if (alreadyJoined) return
    setJoining(true)
    const { error } = await supabase.from('game_players')
      .insert({ game_id: game.id, user_id: user.id })
    if (!error) {
      const updated = { ...game, game_players: [...(game.game_players ?? []), { user_id: user.id }] }
      setSelectedGame(updated)
      setGames(prev => prev.map(g => g.id === game.id ? updated : g))
    }
    setJoining(false)
  }

  const openMessages = async () => {
    setMsgsOpen(true)
    setChatsLoading(true)
    const { data } = await supabase
      .from('game_players')
      .select('games(id, scheduled_date, scheduled_time, team_name, courts(name), game_players(user_id))')
      .eq('user_id', user.id)
    const games = (data ?? []).map(r => r.games).filter(Boolean)
    const withMsgs = await Promise.all(
      games.map(async g => {
        const { data: msgs } = await supabase
          .from('messages').select('content, created_at, user_id')
          .eq('game_id', g.id).order('created_at', { ascending: false }).limit(1)
        return { ...g, lastMessage: msgs?.[0] ?? null }
      })
    )
    withMsgs.sort((a, b) => {
      const ta = a.lastMessage?.created_at ?? a.scheduled_date ?? ''
      const tb = b.lastMessage?.created_at ?? b.scheduled_date ?? ''
      return tb.localeCompare(ta)
    })
    setChats(withMsgs)
    const unread = withMsgs.filter(c => {
      const last = c.lastMessage
      if (!last || last.user_id === user?.id) return false
      const read = localStorage.getItem(`read_${c.id}`)
      return !read || new Date(last.created_at) > new Date(read)
    }).length
    setUnreadCount(unread)
    setChatsLoading(false)
  }

  useEffect(() => {
    if (!myGames.length) return
    const count = myGames.filter(g => !localStorage.getItem(`read_${g.id}`)).length
    setUnreadCount(count)
  }, [myGames])

  const openChat = async (chat) => {
    setActiveChat(chat)
    setChatLoading(true)
    localStorage.setItem(`read_${chat.id}`, new Date().toISOString())
    setUnreadCount(prev => Math.max(0, prev - 1))
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, _read: true } : c))
    const { data } = await supabase
      .from('messages').select('id, content, created_at, user_id')
      .eq('game_id', chat.id).order('created_at')
    setChatMessages(data ?? [])
    setChatLoading(false)
    setTimeout(() => { if (chatMsgsRef.current) chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight }, 50)
  }

  const sendChatMessage = async () => {
    const text = chatInput.trim()
    if (!text || chatSending || !activeChat) return
    setChatSending(true)
    setChatInput('')
    const { data } = await supabase.from('messages')
      .insert({ game_id: activeChat.id, user_id: user.id, content: text })
      .select('id, content, created_at, user_id').single()
    if (data) setChatMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
    setChatSending(false)
    setTimeout(() => { if (chatMsgsRef.current) chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight }, 50)
  }

  // Real-time for active chat
  useEffect(() => {
    if (!activeChat) return
    const ch = supabase.channel(`modal-chat-${activeChat.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `game_id=eq.${activeChat.id}` },
        payload => {
          setChatMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
          setTimeout(() => { if (chatMsgsRef.current) chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight }, 50)
        })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [activeChat])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const firstName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0] ?? ''
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null
  const city = profile?.city ?? user?.user_metadata?.city ?? null

  return (
    <div dir="rtl" style={{ background: 'var(--color-background)', minHeight: '100dvh', paddingBottom: 96, color: 'var(--color-text-primary)' }}>

      {/* ── Top bar: logo + spinning ball + messages ── */}
      <div dir="rtl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 52, padding: '0 16px', background: '#131313', borderBottom: '1px solid rgba(255,107,0,0.08)' }}>

        {/* Messages */}
        <button onClick={openMessages} style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ color: '#a98a7d', fontSize: 22 }}>chat</span>
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: 3, right: 3, minWidth: 15, height: 15, background: '#ff6b00', borderRadius: 99, border: '1.5px solid #131313', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#561f00', padding: '0 3px' }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Center: spinning basketball */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32"
          style={{ animation: 'bball-spin 3s linear infinite', flexShrink: 0 }}>
          <circle cx="50" cy="50" r="47" fill="#ff6b00"/>
          <path d="M50 3 C72 18 78 38 78 50 C78 62 72 82 50 97" fill="none" stroke="#1a0800" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M50 3 C28 18 22 38 22 50 C22 62 28 82 50 97" fill="none" stroke="#1a0800" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="3" y1="50" x2="97" y2="50" stroke="#1a0800" stroke-width="3.5" stroke-linecap="round"/>
          <ellipse cx="34" cy="30" rx="10" ry="6" fill="white" opacity="0.15" transform="rotate(-35 34 30)"/>
        </svg>

        {/* Logo */}
        <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 18, color: '#ffb693', letterSpacing: '-0.02em' }}>
          DunkTime
        </span>
      </div>

      <style>{`
        @keyframes bball-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Hero: greeting + CTA merged ── */}
      <section style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${HERO_IMG}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,19,19,1) 0%, rgba(19,19,19,0.2) 60%, transparent 100%)' }} />
        <div dir="rtl" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 20px 20px' }}>
          {/* Avatar + name top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,182,147,0.5)', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {avatarUrl
                ? <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={avatarUrl} alt="" />
                : <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#ffb693' }}>person</span>
              }
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#ffb693', margin: 0 }}>
                {firstName ? `שלום, ${firstName}` : 'שלום!'}
              </p>
              {city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, opacity: 0.6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#e5e2e1' }}>location_on</span>
                  <span style={{ fontSize: 11, color: '#e5e2e1' }}>{city}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA bottom */}
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
              {city ? `מצא לי משחק ב${city}` : 'מצא לי משחק'}
            </h2>
            <button onClick={openSheet} style={{ background: '#ff6b00', color: '#561f00', border: 'none', borderRadius: 10, padding: '11px 28px', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,0,0.35)' }}>
              מצא משחק →
            </button>
          </div>
        </div>
      </section>

      <main style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

        {/* ── My upcoming games ── */}
        {!loading && myGames.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <h3 className="t-headline-md" style={{ margin: 0 }}>משחקים קרובים שלי</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myGames.map(game => {
                const players = game.game_players ?? []
                const current = players.length
                const max     = game.max_players ?? 10
                return (
                  <button key={game.id} onClick={() => { setMyGameModal(game); fetchModalProfiles(game) }}
                    dir="rtl"
                    style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 14, padding: '14px', textAlign: 'right', cursor: 'pointer', width: '100%' }}>
                    {/* Time */}
                    <div style={{ minWidth: 58, textAlign: 'center', background: 'rgba(255,107,0,0.12)', borderRadius: 10, padding: '8px 6px', flexShrink: 0 }}>
                      <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#ff6b00', margin: 0 }}>
                        {game.scheduled_time?.slice(0, 5) ?? '--:--'}
                      </p>
                      <p style={{ fontSize: 10, color: '#a98a7d', margin: '2px 0 0' }}>
                        {new Date(game.scheduled_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14, color: '#e5e2e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {game.courts?.name ?? 'מגרש לא ידוע'}
                      </p>
                      {game.team_name && (
                        <p style={{ fontSize: 12, color: '#ff6b00', margin: '2px 0 0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {game.team_name}
                        </p>
                      )}
                      <p style={{ fontSize: 12, color: '#a98a7d', margin: '2px 0 0' }}>
                        {current}/{max} שחקנים
                      </p>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(255,182,147,0.15)', color: '#ffb693', padding: '4px 10px', borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                      רשום ✓
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

      {/* ── FAB ── */}
      <button onClick={() => navigate('/create-game')} className="orange-glow-lg"
        style={{ position: 'fixed', bottom: 96, right: 'var(--space-md)', width: 56, height: 56, background: '#ff6b00', color: '#561f00', borderRadius: 'var(--radius-full)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40, cursor: 'pointer' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>add</span>
      </button>

        {/* ── Courts ── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="t-headline-md" style={{ margin: 0 }}>
              {city ? `מגרשים ב${city}` : 'מגרשים קרובים'}
            </h3>
            <button onClick={() => navigate('/courts')}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)', background: 'rgba(255,107,0,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: 'pointer', flexShrink: 0 }}>
              כל המגרשים ←
            </button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', margin: '0 calc(-1 * var(--space-md))', padding: '8px var(--space-md)', scrollbarWidth: 'none' }} className="no-scrollbar">
            {loading
              ? [1,2,3].map(i => <div key={i} style={{ width: 256, height: 180, flexShrink: 0, borderRadius: 'var(--radius-md)', background: '#201f1f' }} className="animate-pulse" />)
              : courts.length === 0
                ? <p className="t-body-md text-on-surface-variant">אין מגרשים זמינים.</p>
                : courts.map((court, i) => (
                    <CourtCard key={court.id} name={court.name} location={court.neighborhood ?? ''} activePlayers={0} isLive={false} img={null} index={i} onClick={() => navigate(`/courts/${court.id}`)} />
                  ))
            }
          </div>
        </section>
      </main>

      <BottomNav />

      {/* ── Messages modal ── */}
      {msgsOpen && (
        <>
          <div onClick={() => { setMsgsOpen(false); setActiveChat(null) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200 }} />
          <div dir="rtl" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, width: 'min(96vw, 520px)', height: '85dvh', display: 'flex', flexDirection: 'column', background: '#161616', borderRadius: 20, boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,0,0.12)', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #252525', flexShrink: 0 }}>
              <button onClick={() => activeChat ? setActiveChat(null) : setMsgsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a98a7d', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                {activeChat ? '← חזרה' : '✕'}
              </button>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 17, color: '#ffb693', margin: 0 }}>
                {activeChat ? (activeChat.team_name ?? activeChat.courts?.name ?? 'צ\'אט') : 'הודעות'}
              </h2>
            </div>

            {/* ── Chat list ── */}
            {!activeChat && (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {chatsLoading ? (
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2,3].map(i => <div key={i} style={{ height: 68, borderRadius: 12, background: '#252525' }} className="animate-pulse" />)}
                  </div>
                ) : chats.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#5a4136', display: 'block', marginBottom: 12 }}>chat_bubble</span>
                    <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 16, color: '#e5e2e1', margin: 0 }}>אין צ'אטים עדיין</p>
                    <p style={{ fontSize: 13, color: '#a98a7d', marginTop: 6 }}>הצטרף למשחק כדי לשוחח</p>
                  </div>
                ) : chats.map(chat => {
                  const lastMsg   = chat.lastMessage
                  const isMyMsg   = lastMsg?.user_id === user?.id
                  const lastRead  = localStorage.getItem(`read_${chat.id}`)
                  const hasUnread = lastMsg && !isMyMsg && (!lastRead || new Date(lastMsg.created_at) > new Date(lastRead))
                  const name = chat.team_name ?? chat.courts?.name ?? 'משחק'
                  return (
                    <button key={chat.id} onClick={() => openChat(chat)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 18px', background: hasUnread ? '#1a1810' : 'transparent', border: 'none', borderBottom: '1px solid #222', cursor: 'pointer', textAlign: 'right' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#252525', border: hasUnread ? '2px solid #ff6b00' : '2px solid #353534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#ffb693' }}>sports_basketball</span>
                        </div>
                        {hasUnread && <span style={{ position: 'absolute', top: 1, right: 1, width: 13, height: 13, background: '#ff6b00', borderRadius: '50%', border: '2px solid #161616' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: '#5a4136' }}>
                            {lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          <span style={{ fontFamily: 'Montserrat', fontWeight: hasUnread ? 800 : 600, fontSize: 15, color: hasUnread ? '#ffb693' : '#e5e2e1' }}>{name}</span>
                        </div>
                        {lastMsg && (
                          <p style={{ fontSize: 13, color: hasUnread ? '#e5e2e1' : '#9a8a80', margin: '4px 0 0', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: hasUnread ? 600 : 400 }}>
                            {isMyMsg ? 'אתה: ' : ''}{lastMsg.content}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Active chat ── */}
            {activeChat && (
              <>
                <div ref={chatMsgsRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {chatLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: '#ff6b00' }}>progress_activity</span>
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#5a4136' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 44, display: 'block', marginBottom: 10 }}>chat</span>
                      <p style={{ fontSize: 14 }}>היה הראשון לכתוב!</p>
                    </div>
                  ) : chatMessages.map(msg => {
                    const isMe = msg.user_id === user?.id
                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', maxWidth: '78%', alignSelf: isMe ? 'flex-start' : 'flex-end', gap: 2 }}>
                        <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: isMe ? '#ff6b00' : '#2e2e2e', color: isMe ? '#561f00' : '#e5e2e1', fontSize: 14, lineHeight: 1.5, fontWeight: isMe ? 600 : 400 }}>
                          {msg.content}
                        </div>
                        <span style={{ fontSize: 10, color: '#5a4136', alignSelf: isMe ? 'flex-start' : 'flex-end', padding: '0 4px' }}>
                          {new Date(msg.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Input */}
                <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid #252525', background: '#1a1a1a', flexShrink: 0 }}>
                  <button onClick={sendChatMessage} disabled={!chatInput.trim() || chatSending}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: chatInput.trim() ? '#ff6b00' : '#353534', color: chatInput.trim() ? '#561f00' : '#5a4136', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: chatInput.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'background 0.15s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, transform: 'scaleX(-1)' }}>send</span>
                  </button>
                  <input
                    type="text" value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                    placeholder="הקלד הודעה..."
                    style={{ flex: 1, background: '#252525', border: '1px solid #353534', borderRadius: 24, padding: '10px 16px', color: '#e5e2e1', fontSize: 14, outline: 'none' }}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── My game details modal ── */}
      {myGameModal && (() => {
        const players = myGameModal.game_players ?? []
        const current = players.length
        const max     = myGameModal.max_players ?? 10
        const court   = myGameModal.courts
        return (
          <>
            <div onClick={() => setMyGameModal(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }} />
            <div dir="rtl" style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 201, width: 'min(92vw, 460px)', maxHeight: '80dvh',
              display: 'flex', flexDirection: 'column',
              background: '#1c1b1b', borderRadius: 20,
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,0,0.15)',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 14px', borderBottom: '1px solid #2a2a2a' }}>
                <button onClick={() => setMyGameModal(null)}
                  style={{ background: 'none', border: 'none', color: '#a98a7d', cursor: 'pointer', fontSize: 22 }}>✕</button>
                <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#ffb693', margin: 0 }}>פרטי משחק</h2>
              </div>

              <div style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Court */}
                <div style={{ background: '#252525', borderRadius: 14, padding: '14px 16px' }}>
                  <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase' }}>מגרש</p>
                  <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 16, color: '#e5e2e1', margin: 0 }}>{court?.name ?? 'לא ידוע'}</p>
                  {(court?.neighborhood || court?.address) && (
                    <p style={{ fontSize: 13, color: '#ff6b00', margin: '4px 0 0' }}>
                      {[court.neighborhood, court.address].filter(Boolean).join(' — ')}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: '#252525', borderRadius: 14, padding: '12px 14px' }}>
                    <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>תאריך</p>
                    <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#e5e2e1', margin: 0 }}>
                      {new Date(myGameModal.scheduled_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ background: '#252525', borderRadius: 14, padding: '12px 14px' }}>
                    <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>שעה</p>
                    <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#ff6b00', margin: 0 }}>
                      {myGameModal.scheduled_time?.slice(0, 5) ?? '--:--'}
                    </p>
                  </div>
                </div>

                {/* Players */}
                <div style={{ background: '#252525', borderRadius: 14, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: '#ffb693', fontWeight: 700 }}>{max - current} מקומות נותרו</span>
                    <span style={{ fontSize: 13, color: '#a98a7d' }}>{current}/{max} שחקנים</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, background: '#353534', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
                    <div style={{ height: '100%', width: `${Math.round(current/max*100)}%`, background: '#ff6b00', borderRadius: 99 }} />
                  </div>
                  {/* Player list with names */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                    {players.map((p) => {
                      const isMe    = p.user_id === user?.id
                      const profile = modalProfiles[p.user_id]
                      const name    = isMe
                        ? (user?.user_metadata?.full_name ?? profile?.full_name ?? 'אתה')
                        : (profile?.full_name ?? 'שחקן')
                      const avatar  = isMe
                        ? (user?.user_metadata?.avatar_url ?? profile?.avatar_url ?? null)
                        : (profile?.avatar_url ?? null)
                      return (
                        <div key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: isMe ? '2px solid #ff6b00' : '2px solid #4a4a4a', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {avatar
                              ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span className="material-symbols-outlined" style={{ fontSize: 18, color: isMe ? '#ff6b00' : '#a98a7d' }}>person</span>
                            }
                          </div>
                          <span style={{ fontSize: 14, color: isMe ? '#ffb693' : '#e5e2e1', fontWeight: isMe ? 700 : 400 }}>
                            {name}{isMe ? ' (אתה)' : ''}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Team name */}
                {myGameModal.team_name && (
                  <div style={{ background: '#252525', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ color: '#ff6b00', fontSize: 20 }}>shield</span>
                    <div>
                      <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 2px', fontWeight: 600 }}>שם קבוצה</p>
                      <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#e5e2e1', margin: 0 }}>{myGameModal.team_name}</p>
                    </div>
                  </div>
                )}

                {/* Note */}
                {myGameModal.note && (
                  <div style={{ background: '#252525', borderRadius: 14, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>הערה</p>
                    <p style={{ fontSize: 14, color: '#e5e2e1', margin: 0, lineHeight: 1.6 }}>{myGameModal.note}</p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={() => { setMyGameModal(null); navigate(`/messages/${myGameModal.id}`) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, border: 'none', background: '#252525', color: '#e5e2e1', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ffb693' }}>chat</span>
                    הודעות משחק
                  </button>
                  <a
                    href={getWazeUrl(myGameModal.courts)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', borderRadius: 14, background: '#33ccff22', color: '#33ccff', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>navigation</span>
                    נווט בוויז
                  </a>
                </div>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── Games modal (centered) ── */}
      {gamesOpen && (
        <>
          {/* Backdrop */}
          <div onClick={() => { setGamesOpen(false); setSelectedGame(null) }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }} />

          {/* Modal */}
          <div dir="rtl" style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 201, width: 'min(92vw, 480px)',
            maxHeight: '80dvh', display: 'flex', flexDirection: 'column',
            background: '#1c1b1b', borderRadius: 20,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,0,0.15)',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 14px', borderBottom: '1px solid #2a2a2a' }}>
              <button onClick={() => selectedGame ? setSelectedGame(null) : setGamesOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a98a7d', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>
                {selectedGame ? '←' : '✕'}
              </button>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#ffb693', margin: 0 }}>
                {selectedGame ? 'פרטי משחק' : (city ? `משחקים ב${city}` : 'משחקים בעיר שלך')}
              </h2>
            </div>

            {/* Content */}
            <div style={{ overflowY: 'auto', padding: '16px', flex: 1 }}>

              {/* ── Game details view ── */}
              {selectedGame ? (() => {
                const players  = selectedGame.game_players ?? []
                const current  = players.length
                const max      = selectedGame.max_players ?? 10
                const isFull   = current >= max
                const isJoined = players.some(p => p.user_id === user?.id)
                const fill     = Math.round((current / max) * 100)
                const court    = selectedGame.courts

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Court */}
                    <div style={{ background: '#252525', borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 12, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>מגרש</p>
                      <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 17, color: '#e5e2e1', margin: 0 }}>{court?.name ?? 'לא ידוע'}</p>
                      {(court?.neighborhood || court?.address) && (
                        <p style={{ fontSize: 13, color: '#ff6b00', margin: '4px 0 0' }}>{court.neighborhood}{court.neighborhood && court.address ? ' — ' : ''}{court.address}</p>
                      )}
                    </div>

                    {/* Date & Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ background: '#252525', borderRadius: 14, padding: '12px 14px' }}>
                        <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>תאריך</p>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#e5e2e1', margin: 0 }}>
                          {new Date(selectedGame.scheduled_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </p>
                      </div>
                      <div style={{ background: '#252525', borderRadius: 14, padding: '12px 14px' }}>
                        <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>שעה</p>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#ff6b00', margin: 0 }}>
                          {selectedGame.scheduled_time?.slice(0, 5) ?? '--:--'}
                        </p>
                      </div>
                    </div>

                    {/* Players */}
                    <div style={{ background: '#252525', borderRadius: 14, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: isFull ? '#c8c6c5' : '#ffb693', fontWeight: 700 }}>
                          {isFull ? 'המשחק מלא' : `${max - current} מקומות נותרו`}
                        </span>
                        <span style={{ fontSize: 13, color: '#a98a7d' }}>{current}/{max} שחקנים</span>
                      </div>
                      <div style={{ height: 6, background: '#353534', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${fill}%`, background: isFull ? '#c8c6c5' : '#ff6b00', borderRadius: 99, transition: 'width 0.3s' }} />
                      </div>
                      {/* Player list with names */}
                      {players.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {players.map((p) => {
                            const isMe    = p.user_id === user?.id
                            const profile = modalProfiles[p.user_id]
                            const name    = isMe
                              ? (user?.user_metadata?.full_name ?? profile?.full_name ?? 'אתה')
                              : (profile?.full_name ?? 'שחקן')
                            const avatar  = isMe
                              ? (user?.user_metadata?.avatar_url ?? profile?.avatar_url ?? null)
                              : (profile?.avatar_url ?? null)
                            return (
                              <div key={p.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: isMe ? '2px solid #ff6b00' : '2px solid #4a4a4a', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {avatar
                                    ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span className="material-symbols-outlined" style={{ fontSize: 16, color: isMe ? '#ff6b00' : '#a98a7d' }}>person</span>
                                  }
                                </div>
                                <span style={{ fontSize: 13, color: isMe ? '#ffb693' : '#e5e2e1', fontWeight: isMe ? 700 : 400 }}>
                                  {name}{isMe ? ' (אתה)' : ''}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Team name */}
                    {selectedGame.team_name && (
                      <div style={{ background: '#252525', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="material-symbols-outlined" style={{ color: '#ff6b00', fontSize: 20 }}>shield</span>
                        <div>
                          <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 2px', fontWeight: 600 }}>שם קבוצה</p>
                          <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#e5e2e1', margin: 0 }}>{selectedGame.team_name}</p>
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    {selectedGame.note && (
                      <div style={{ background: '#252525', borderRadius: 14, padding: '12px 16px' }}>
                        <p style={{ fontSize: 11, color: '#a98a7d', margin: '0 0 4px', fontWeight: 600 }}>הערה</p>
                        <p style={{ fontSize: 14, color: '#e5e2e1', margin: 0, lineHeight: 1.6 }}>{selectedGame.note}</p>
                      </div>
                    )}

                    {/* Actions row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        onClick={() => { setGamesOpen(false); navigate(`/messages/${selectedGame.id}`) }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 14, border: 'none', background: '#252525', color: '#e5e2e1', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ffb693' }}>chat</span>
                        הודעות
                      </button>
                      <a
                        href={getWazeUrl(selectedGame.courts)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 14, background: '#33ccff22', color: '#33ccff', fontFamily: 'Montserrat', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>navigation</span>
                        נווט בוויז
                      </a>
                    </div>

                    {/* Join button */}
                    <button
                      onClick={() => !isJoined && !isFull && joinGame(selectedGame)}
                      disabled={isJoined || isFull || joining}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                        fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, cursor: isJoined || isFull ? 'default' : 'pointer',
                        background: isJoined ? 'rgba(255,182,147,0.15)' : isFull ? '#353534' : '#ff6b00',
                        color: isJoined ? '#ffb693' : isFull ? '#9a8a80' : '#561f00',
                        boxShadow: (!isJoined && !isFull) ? '0 4px 20px rgba(255,107,0,0.35)' : 'none',
                      }}>
                      {joining ? '...' : isJoined ? '✓ רשום למשחק' : isFull ? 'המשחק מלא' : 'הצטרף למשחק'}
                    </button>
                  </div>
                )
              })() : (
                /* ── Games list ── */
                gamesLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2,3].map(i => <div key={i} style={{ height: 72, borderRadius: 12, background: '#252525' }} className="animate-pulse" />)}
                  </div>
                ) : games.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#5a4136', display: 'block', marginBottom: 14 }}>sports_basketball</span>
                    <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 17, color: '#e5e2e1', margin: '0 0 6px' }}>אין משחקים כרגע בעיר שלך</p>
                    <p style={{ fontSize: 13, color: '#a98a7d', margin: '0 0 22px' }}>היה הראשון ליצור משחק!</p>
                    <button onClick={() => { setGamesOpen(false); navigate('/create-game') }}
                      style={{ background: '#ff6b00', color: '#561f00', border: 'none', borderRadius: 12, padding: '12px 32px', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                      צור משחק
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {games.map(game => {
                      const current  = game.game_players?.length ?? 0
                      const max      = game.max_players ?? 10
                      const isFull   = current >= max
                      const isJoined = game.game_players?.some(p => p.user_id === user?.id)
                      return (
                        <button key={game.id} onClick={() => { setSelectedGame(game); fetchModalProfiles(game) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#252525', border: '1px solid #353534', borderRadius: 14, padding: '14px', textAlign: 'right', cursor: 'pointer', width: '100%', transition: 'border-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#353534'}
                        >
                          {/* Time */}
                          <div style={{ minWidth: 60, textAlign: 'center', background: '#1c1b1b', borderRadius: 10, padding: '8px 6px', flexShrink: 0 }}>
                            <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#ff6b00', margin: 0 }}>
                              {game.scheduled_time?.slice(0, 5) ?? '--:--'}
                            </p>
                            <p style={{ fontSize: 10, color: '#a98a7d', margin: '2px 0 0', textTransform: 'uppercase' }}>
                              {new Date(game.scheduled_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                            </p>
                          </div>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14, color: '#e5e2e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {game.courts?.name ?? 'מגרש לא ידוע'}
                            </p>
                            {game.team_name && (
                              <p style={{ fontSize: 12, color: '#ff6b00', margin: '2px 0 0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {game.team_name}
                              </p>
                            )}
                            <p style={{ fontSize: 12, color: isFull ? '#9a8a80' : '#ffb693', margin: '2px 0 0', fontWeight: 600 }}>
                              {isFull ? 'מלא' : `${max - current} מקומות נותרו`} · {current}/{max} שחקנים
                            </p>
                          </div>
                          {/* Status badge */}
                          <div style={{ flexShrink: 0 }}>
                            {isJoined
                              ? <span style={{ fontSize: 11, background: 'rgba(255,182,147,0.15)', color: '#ffb693', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>רשום</span>
                              : isFull
                                ? <span style={{ fontSize: 11, background: '#2a2a2a', color: '#9a8a80', padding: '4px 10px', borderRadius: 20 }}>מלא</span>
                                : <span style={{ fontSize: 11, background: 'rgba(255,107,0,0.15)', color: '#ff6b00', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>פתוח</span>
                            }
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
