import { useMemo } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import MonthCalendar from './MonthCalendar';
import SlotPicker from '../shared/SlotPicker';
import { useApp } from '../../context/AppContext';
import { generateDaySlots } from '../../utils/slotUtils';
import { fmtDateLong } from '../../utils/dateUtils';

export default function BookingStepDateTime({ data, setData }) {
  const { physicians, appointments } = useApp();
  const physician = physicians.find((p) => p.id === data.physicianId);

  const slots = useMemo(
    () => (data.date ? generateDaySlots(physician, data.date, appointments) : []),
    [physician, data.date, appointments]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
      <div>
        <div className="flex items-center gap-2 mb-3 text-ink-primary">
          <CalendarDays size={16} className="text-brand" />
          <h3 className="text-base font-semibold">Pick a date</h3>
        </div>
        <MonthCalendar value={data.date} onChange={(date) => setData({ ...data, date, startTime: null, endTime: null })} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3 text-ink-primary">
          <Clock size={16} className="text-brand" />
          <h3 className="text-base font-semibold">Available times</h3>
        </div>
        {!data.date ? (
          <div className="text-sm text-ink-secondary border border-dashed border-line rounded-card p-6 text-center">
            Select a date to see available times.
          </div>
        ) : (
          <>
            <div className="text-xs text-ink-secondary mb-2">{fmtDateLong(data.date)}</div>
            <SlotPicker
              slots={slots}
              selected={data.startTime}
              onSelect={(s) => setData({ ...data, startTime: s.startTime, endTime: s.endTime })}
              emptyMessage="No appointments available that day."
            />
          </>
        )}
      </div>
    </div>
  );
}
