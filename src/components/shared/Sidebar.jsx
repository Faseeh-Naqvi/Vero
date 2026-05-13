import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Avatar from './Avatar';

export default function Sidebar({ navItems = [], onBellClick, unreadCount = 0 }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-surface-page border-r border-line flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2L4 8v6c0 5 4 9 8 10 4-1 8-5 8-10V8l-8-6z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight text-ink-primary leading-none">Vero</div>
          <div className="text-xs text-ink-secondary mt-0.5">Clinic Portal</div>
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {item.icon && <item.icon size={16} aria-hidden />}
            <span>{item.label}</span>
            {item.badge ? (
              <span className="ml-auto bg-status-amber/15 text-status-amber text-xs font-medium px-1.5 rounded-chip">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}

        {onBellClick && (
          <button
            type="button"
            onClick={onBellClick}
            className="nav-link w-full text-left"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
          >
            <Bell size={16} aria-hidden />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-status-red text-white text-xs font-medium min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </nav>

      <div className="border-t border-line p-3 flex items-center gap-2.5">
        <Avatar initials={(currentUser?.name || '?').split(' ').map((p) => p[0]).join('')} size={32} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink-primary truncate">{currentUser?.name}</div>
          <div className="text-xs text-ink-secondary capitalize">{currentUser?.role}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-ink-secondary hover:text-ink-primary p-1.5 rounded-btn hover:bg-surface-hover"
          aria-label="Log out"
        >
          <LogOut size={16} aria-hidden />
        </button>
      </div>
    </aside>
  );
}
