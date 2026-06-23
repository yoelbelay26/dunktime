import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCA1ximxF3Zrvci-0ZXPC5JHLGH1c85w29OVpeurgDSkXDIz0gVGfW1mPbVwqIJFGg08g4CIUlJA4rjhudxS7riiHc6K9GvRqnwSJkdkcpzaBMUFgJfJP1KHPiPPP00DQOXYIyLOeSybXKsqVptuJZCbbA_pn1qG8IfAqrDWRKJCgPHK878YkOZj85_gRRvSlLBFQ0_85T2IpcHtY9Ikwkf7zfajKKzb3pnA3yd-JySObKf8mE94Oj9mCP9h5QmhF85nDZ7z6-LN_8'

const INITIAL_MESSAGES = [
  { id: 1, from: 'other', text: 'אהלן! מתי מתחיל המשחק היום בספורטק?', time: '16:42' },
  { id: 2, from: 'me',    text: 'היי עידו, מתחילים ב-18:00. תביא כדור אם יש לך.', time: '16:45' },
  { id: 3, from: 'other', text: 'סבבה לגמרי. מגיעים חמישה על חמישה?', time: '16:46' },
  { id: 4, from: 'me',    text: 'כן, הסגל מלא. הולך להיות משחק חזק היום!', time: '16:48' },
  { id: 'card', type: 'card' },
  { id: 5, from: 'other', text: 'מעולה, אני כבר בדרך לחימום.', time: '17:05' },
]

export default function ChatView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { id: Date.now(), from: 'me', text, time: now }])
    setInput('')
  }

  return (
    <div className="bg-background flex flex-col text-on-surface" style={{ flex: 1, minHeight: 0 }}>

      {/* ── Chat sub-header ── */}
      <div className="bg-surface-container-low border-b border-white/10 h-14 flex flex-row items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface text-2xl" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>
              arrow_back
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border border-primary-container overflow-hidden">
              <img className="w-full h-full object-cover" src={AVATAR_URL} alt="עידו" />
            </div>
            <div className="flex flex-col">
              <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="text-on-surface leading-tight">
                עידו
              </span>
              <span className="t-label-sm text-primary uppercase tracking-wider">מחובר עכשיו</span>
            </div>
          </div>
        </div>
        <div className="mr-auto flex items-center gap-5">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">videocam</span>
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">call</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <main
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5"
        style={{ paddingBottom: 80, scrollbarWidth: 'thin', scrollbarColor: '#353534 #131313' }}
      >
        {/* Date separator */}
        <div className="flex justify-center my-1">
          <span
            className="px-3 py-1 rounded-full t-label-sm uppercase tracking-widest border border-white/5"
            style={{ backgroundColor: '#2a2a2a', color: '#c8c6c6', fontSize: 10 }}
          >
            היום
          </span>
        </div>

        {messages.map(msg => {
          if (msg.type === 'card') {
            return (
              <div key="card" className="self-center w-full max-w-sm my-5">
                <div className="bg-surface-container border-t-2 border-primary-container p-5 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="bg-primary-container/20 text-primary-container px-2 py-0.5 rounded t-label-sm uppercase font-bold animate-pulse"
                      style={{ fontSize: 10 }}
                    >
                      Live Game Info
                    </span>
                    <span className="t-label-sm text-on-surface-variant">ספורטק צפון</span>
                  </div>
                  <h4 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="text-on-surface mb-2">
                    משחק אימון - קבוצה א׳
                  </h4>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-5">
                    <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                    <span>18:00 - 19:30</span>
                  </div>
                  <button className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-bold uppercase text-sm active:scale-95 transition-all">
                    צפה בפרטי המשחק
                  </button>
                </div>
              </div>
            )
          }

          const isMe = msg.from === 'me'
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] gap-1 ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div
                className="p-3 rounded-xl t-body-md"
                style={{
                  backgroundColor: isMe ? '#ff6b00' : '#393939',
                  color: isMe ? '#572000' : '#e5e2e1',
                  fontWeight: isMe ? 700 : 400,
                  borderBottomLeftRadius: isMe ? 4 : undefined,
                  borderBottomRightRadius: !isMe ? 4 : undefined,
                  boxShadow: isMe ? '0 4px 12px rgba(255,107,0,0.2)' : undefined,
                }}
              >
                {msg.text}
              </div>
              <span className="t-label-sm px-1 opacity-60">{msg.time}</span>
            </div>
          )
        })}
      </main>

      {/* ── Input footer ── */}
      <footer
        dir="rtl"
        className="fixed bottom-0 w-full h-20 bg-surface-container border-t border-white/5 px-4 flex items-center gap-3"
      >
        <button className="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-primary active:scale-90 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="הקלד הודעה..."
            className="w-full bg-surface-container-highest border border-white/10 rounded-full h-11 px-5 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container transition-colors t-body-md"
            style={{ color: '#e5e2e1' }}
          />
        </div>
        <button
          onClick={send}
          disabled={!input.trim()}
          className="flex items-center justify-center w-11 h-11 bg-primary-container rounded-full text-on-primary-container active:scale-90 transition-all disabled:opacity-40"
          style={{ boxShadow: '0 0 15px rgba(255,107,0,0.3)', transform: 'scaleX(-1)' }}
        >
          <span className="material-symbols-outlined font-bold">send</span>
        </button>
      </footer>
    </div>
  )
}
