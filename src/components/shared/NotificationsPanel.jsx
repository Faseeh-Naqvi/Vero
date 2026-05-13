import { useId } from 'react';
import { X, BellOff, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtRelative } from '../../utils/dateUtils';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
const ICONS = {
  appointment_confirmed: { icon: CheckCircle2, color: 'text-status-green', bg: 'bg-green-50' },
  appointment_cancelled_by_physician: { icon: AlertCircle, color: 'text-status-red', bg: 'bg-red-50' },
  appointment_cancelled_by_admin: { icon: AlertCircle, color: 'text-status-red', bg: 'bg-red-50' },
  appointment_rebooked: { icon: Calendar, color: 'text-brand', bg: 'bg-brand-tint' },
  appointment_declined: { icon: AlertCircle, color: 'text-status-amber', bg: 'bg-amber-50' },
  appointment_completed: { icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  fee_owed: { icon: AlertCircle, color: 'text-status-red', bg: 'bg-red-50' },
  appointment_booked_for_patient: { icon: Calendar, color: 'text-brand', bg: 'bg-brand-tint' },
  new_pending_appointment: { icon: Calendar, color: 'text-status-amber', bg: 'bg-amber-50' },
};

export default function NotificationsPanel({ open, onClose, userId }) {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const titleId = useId();
  useBodyScrollLock(open);

  if (!open) return null;
  const mine = notifications.filter((n) => n.userId === userId);

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-ink-primary/30 animate-fadein"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute right-0 top-0 h-full w-[400px] max-w-[100vw] bg-white shadow-drawer flex flex-col animate-slidein outline-none"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 id={titleId} className="text-lg font-semibold text-ink-primary">
            Notifications
          </h2>
          <div className="flex items-center gap-1">
            {mine.some((n) => !n.read) && (
              <button
                type="button"
                className="text-xs text-brand hover:text-brand-hover font-medium px-2 py-1 rounded-btn"
                onClick={() => markAllRead(userId)}
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-ink-secondary hover:text-ink-primary p-1.5 rounded-btn hover:bg-surface-hover"
              aria-label="Close notifications"
            >
              <X size={18} aria-hidden />
            </button>
          </div>
        </header>        <div className="flex-1 overflow-y-auto">
          {mine.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 text-ink-secondary">
              <BellOff size={32} className="mb-3 text-ink-secondary/60" aria-hidden />              <div className="text-sm font-medium text-ink-primary">No notifications yet</div>
              <div className="text-xs mt-1">We&apos;ll let you know when something happens.</div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {mine.map((n) => {
                const cfg = ICONS[n.type] || ICONS.appointment_confirmed;
                const Icon = cfg.icon;
                return (
                  <li
                    key={n.id}
                    tabIndex={0}
                    className={`flex gap-3 px-5 py-4 cursor-pointer hover:bg-surface-hover ${!n.read ? 'bg-brand-tint/40' : ''}`}
                    onClick={() => !n.read && markNotificationRead(n.id)}
                    onKeyDown={(e) => {
                      if (!n.read && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        markNotificationRead(n.id);
                      }
                    }}
                  >                    <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${cfg.bg}`}>
                      <Icon size={16} className={cfg.color} aria-hidden />                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-ink-primary leading-snug">{n.message}</p>
                        {!n.read && (
                          <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-status-red" aria-hidden />
                        )}
                      </div>
                      <div className="text-xs text-ink-secondary mt-1">{fmtRelative(n.createdAt)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
