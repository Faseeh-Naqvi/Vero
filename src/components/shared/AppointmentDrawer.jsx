import { useEffect, useId } from 'react';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

export default function AppointmentDrawer({ open, onClose, title = 'Appointment', children, footer }) {
  const titleId = useId();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

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
        className="absolute right-0 top-0 h-full w-[480px] max-w-[100vw] bg-white shadow-drawer flex flex-col animate-slidein outline-none"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 id={titleId} className="text-lg font-semibold text-ink-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-primary p-1.5 rounded-btn hover:bg-surface-hover"
            aria-label="Close panel"
          >
            <X size={18} aria-hidden />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-line px-6 py-4 bg-white">{footer}</footer>}
      </aside>
    </div>
  );
}
