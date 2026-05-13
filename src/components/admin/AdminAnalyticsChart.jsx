import { useMemo } from 'react';
import { subDays, format, parseISO, eachDayOfInterval } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/** Admin-facing volume chart: last 7 days of active appointments plus status mix. */
export default function AdminAnalyticsChart() {
  const { appointments } = useApp();

  const { daily, maxCount, statusMix } = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6);
    const days = eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));

    const daily = days.map((dateKey) => {
      const dayAppts = appointments.filter((a) => a.date === dateKey);
      const active = dayAppts.filter((a) => a.status === 'pending' || a.status === 'confirmed').length;
      const cancelled = dayAppts.filter((a) => a.status === 'cancelled').length;
      return {
        dateKey,
        label: format(parseISO(dateKey), 'EEE'),
        active,
        cancelled,
        total: dayAppts.length,
      };
    });

    const maxCount = Math.max(1, ...daily.map((d) => d.total));

    const statusMix = {
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
    };

    return { daily, maxCount, statusMix };
  }, [appointments]);

  const totalMix =
    statusMix.confirmed + statusMix.pending + statusMix.cancelled + statusMix.completed || 1;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-line flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary flex items-center gap-2">
            <TrendingUp size={18} className="text-brand" />
            Appointment volume
          </h3>
          <p className="text-sm text-ink-secondary mt-0.5">Last 7 days, all physicians</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between gap-2 h-40 border-b border-line pb-1">
          {daily.map((d) => {
            const hActive = (d.active / maxCount) * 100;
            const hCancel = (d.cancelled / maxCount) * 100;
            return (
              <div key={d.dateKey} className="flex-1 min-w-0 flex flex-col items-center gap-1.5">
                <div
                  className="w-full max-w-[44px] mx-auto flex flex-col justify-end rounded-t-md overflow-hidden bg-surface-page border border-line"
                  style={{ height: '120px' }}
                  title={`${d.dateKey}: ${d.active} active, ${d.cancelled} cancelled`}
                >
                  <div
                    className="w-full bg-brand shrink-0 transition-all"
                    style={{ height: `${hActive}%`, minHeight: d.active ? 4 : 0 }}
                  />
                  {d.cancelled > 0 && (
                    <div
                      className="w-full bg-status-grey/40 shrink-0 transition-all"
                      style={{ height: `${hCancel}%`, minHeight: d.cancelled ? 3 : 0 }}
                    />
                  )}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-ink-secondary">
                  {d.label}
                </span>
                <span className="text-xs text-ink-primary font-semibold tabular-nums">{d.total}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand" /> Active (pending + confirmed)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-status-grey/50" /> Cancelled that day
          </span>
        </div>
      </div>

      <div className="px-5 py-4 bg-surface-page border-t border-line">
        <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium mb-2">
          Current pipeline (all time in this session)
        </div>
        <div className="h-2.5 rounded-full bg-line overflow-hidden flex">
          <div
            className="h-full bg-status-green"
            style={{ width: `${(statusMix.confirmed / totalMix) * 100}%` }}
            title={`Confirmed: ${statusMix.confirmed}`}
          />
          <div
            className="h-full bg-status-amber"
            style={{ width: `${(statusMix.pending / totalMix) * 100}%` }}
            title={`Pending: ${statusMix.pending}`}
          />
          <div
            className="h-full bg-status-grey"
            style={{ width: `${(statusMix.completed / totalMix) * 100}%` }}
            title={`Completed: ${statusMix.completed}`}
          />
          <div
            className="h-full bg-status-red/70"
            style={{ width: `${(statusMix.cancelled / totalMix) * 100}%` }}
            title={`Cancelled: ${statusMix.cancelled}`}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
          <span>Confirmed {statusMix.confirmed}</span>
          <span>Pending {statusMix.pending}</span>
          <span>Completed {statusMix.completed}</span>
          <span>Cancelled {statusMix.cancelled}</span>
        </div>
      </div>
    </div>
  );
}
