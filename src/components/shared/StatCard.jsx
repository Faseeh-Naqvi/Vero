export default function StatCard({ label, value, accent = 'default', icon: Icon, hint }) {
  const accents = {
    default: 'text-ink-primary',
    amber: 'text-status-amber',
    red: 'text-status-red',
    green: 'text-status-green',
    brand: 'text-brand',
  };
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-ink-secondary">
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
        {Icon && <Icon size={14} />}
      </div>
      <div className={`text-2xl font-semibold mt-1.5 ${accents[accent] || accents.default}`}>{value}</div>
      {hint && <div className="text-xs text-ink-secondary mt-1">{hint}</div>}
    </div>
  );
}
