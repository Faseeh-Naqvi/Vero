import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { isoDate } from '../../utils/dateUtils';

export default function MonthCalendar({ value, onChange }) {
  const today = startOfDay(new Date());
  const initialMonth = value ? new Date(value) : today;
  const [month, setMonth] = useState(initialMonth);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          className="btn-ghost btn-compact"
          onClick={() => setMonth((m) => subMonths(m, 1))}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-sm font-semibold text-ink-primary">{format(month, 'MMMM yyyy')}</div>
        <button
          type="button"
          className="btn-ghost btn-compact"
          onClick={() => setMonth((m) => addMonths(m, 1))}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs uppercase tracking-wider text-ink-secondary font-medium">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dim = !isSameMonth(d, month);
          const past = isBefore(d, today);
          const selected = value && isSameDay(d, new Date(value));
          const isToday = isSameDay(d, today);

          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={past}
              onClick={() => onChange?.(isoDate(d))}
              className={`h-9 rounded-btn text-sm font-medium transition ${
                selected
                  ? 'bg-brand text-white'
                  : past
                  ? 'text-ink-secondary/50 cursor-not-allowed'
                  : dim
                  ? 'text-ink-secondary hover:bg-surface-hover'
                  : 'text-ink-primary hover:bg-brand-tint hover:text-brand'
              } ${isToday && !selected ? 'ring-1 ring-brand/40' : ''}`}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
