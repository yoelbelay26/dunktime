import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { to: '/',            end: true,  label: 'בית' },
  { to: '/courts',      end: false, label: 'מגרשים' },
  { to: '/create-game', end: false, label: 'יצירת משחק' },
  { to: '/messages',    end: false, label: 'הודעות' },
  { to: '/profile',     end: false, label: 'פרופיל' },
]

export default function Navbar() {
  return (
    <nav className={styles.navbar} dir="rtl">
      <span className={styles.logo}>DunkTime</span>
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
    </nav>
  )
}
