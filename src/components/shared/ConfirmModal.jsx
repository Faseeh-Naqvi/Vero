import { useEffect, useId } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  children,
  disableConfirm = false,
}) {
  const titleId = useId();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmBtnClass =
    confirmVariant === 'danger' ? 'btn-danger' : confirmVariant === 'success' ? 'btn-success' : 'btn-primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink-primary/40 animate-fadein"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md bg-white rounded-card shadow-pop animate-fadein outline-none"
      >
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-start gap-3">
            {confirmVariant === 'danger' && (
              <div className="shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-status-red">
                <AlertTriangle size={18} aria-hidden />
              </div>
            )}
            <div className="flex-1">
              <h3 id={titleId} className="text-lg font-semibold text-ink-primary">
                {title}
              </h3>
              {message && <p className="text-sm text-ink-secondary mt-1">{message}</p>}
            </div>
          </div>
        </div>
        {children && <div className="px-6 py-3">{children}</div>}
        <div className="px-6 pb-5 pt-3 flex items-center justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmBtnClass}
            onClick={onConfirm}
            disabled={disableConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
