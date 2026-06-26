import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import styles from './Navbar.module.css'

const links = [
  { to: '/',            end: true,  label: 'בית' },
  { to: '/create-game', end: false, label: 'יצירת משחק' },
  { to: '/messages',    end: false, label: 'הודעות' },
  { to: '/profile',     end: false, label: 'פרופיל' },
]

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className={styles.navbar} dir="rtl">
      <button onClick={() => navigate('/')} className={styles.logo} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        DunkTime
      </button>
      <ul className={styles.links}>
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      {user && (
        <button onClick={handleLogout} className={styles.logout}>
          התנתק
        </button>
      )}
    </nav>
  )
}
