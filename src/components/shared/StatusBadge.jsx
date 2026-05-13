import { DollarSign } from 'lucide-react';

const STYLES = {
  pending: { bg: '#FEF3C7', fg: '#92400E', label: 'Pending' },
  confirmed: { bg: '#DCFCE7', fg: '#166534', label: 'Confirmed' },
  cancelled: { bg: '#FEE2E2', fg: '#991B1B', label: 'Cancelled' },
  fee_owed: { bg: '#FEE2E2', fg: '#991B1B', label: 'Cancelled (fee owed)' },
  completed: { bg: '#E0E7FF', fg: '#3730A3', label: 'Completed' },
};

export default function StatusBadge({ status, customLabel, className = '' }) {
  const cfg = STYLES[status] || STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-chip text-xs font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      {status === 'fee_owed' && <DollarSign size={12} strokeWidth={2.5} />}
      {customLabel || cfg.label}
    </span>
  );
}
