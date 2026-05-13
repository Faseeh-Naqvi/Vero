import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NotificationToast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icon =
    toast.variant === 'error' ? (
      <AlertCircle size={18} className="text-status-red" />
    ) : toast.variant === 'info' ? (
      <Info size={18} className="text-brand" />
    ) : (
      <CheckCircle2 size={18} className="text-status-green" />
    );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fadein">
      <div className="bg-white border border-line shadow-pop rounded-card px-4 py-3 flex items-center gap-2.5 min-w-[280px]">
        {icon}
        <span className="text-sm text-ink-primary">{toast.message}</span>
      </div>
    </div>
  );
}
