import { NavLink } from 'react-router-dom'

const items = [
  { to: '/',            end: true,  icon: 'home',             label: 'בית' },
  { to: '/courts',      end: false, icon: 'sports_basketball', label: 'מגרשים' },
  { to: '/create-game', end: false, icon: 'add_circle',        label: 'יצירה' },
  { to: '/profile',     end: false, icon: 'person',            label: 'פרופיל' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 w-full z-50 bg-surface-container border-t border-outline-variant h-20 px-1 flex flex-row-reverse justify-around items-center rounded-t-xl"
      style={{ boxShadow: '0 -4px 10px rgba(255,182,147,0.1)' }}
    >
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 px-3 py-1 transition-all duration-200 active:scale-90 ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined text-[28px] ${isActive ? 'icon-fill' : ''}`}
              >
                {item.icon}
              </span>
              <span className="t-label-sm uppercase">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
