import { useState } from 'react';
import Sidebar from './Sidebar';
import NotificationsPanel from './NotificationsPanel';
import NotificationToast from './NotificationToast';
import { useApp } from '../../context/AppContext';

export default function AppLayout({ navItems, children, title, subtitle, headerAction }) {
  const { notifications, currentUser } = useApp();
  const [panelOpen, setPanelOpen] = useState(false);
  const myUnread = notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;

  return (
    <div className="min-h-screen flex bg-surface-page">
      <Sidebar navItems={navItems} onBellClick={() => setPanelOpen(true)} unreadCount={myUnread} />
      <main className="flex-1 min-w-0 min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-8 py-7">
          {(title || headerAction) && (
            <header className="flex items-start justify-between mb-6 gap-4">
              <div>
                {title && <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">{title}</h1>}
                {subtitle && <p className="text-sm text-ink-secondary mt-1">{subtitle}</p>}
              </div>
              {headerAction}
            </header>
          )}
          {children}
        </div>
      </main>
      <NotificationsPanel open={panelOpen} onClose={() => setPanelOpen(false)} userId={currentUser?.id} />
      <NotificationToast />
    </div>
  );
}
