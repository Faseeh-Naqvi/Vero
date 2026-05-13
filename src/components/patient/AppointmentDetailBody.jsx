import { Calendar, Clock, User, FileText, ClipboardList } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12 } from '../../utils/dateUtils';

export default function AppointmentDetailBody({ appointment }) {
  const { physicians } = useApp();
  if (!appointment) return null;
  const physician = physicians.find((p) => p.id === appointment.physicianId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar initials={physician?.avatar} size={48} color={physician?.color} />
        <div>
          <div className="text-base font-semibold text-ink-primary">{physician?.name}</div>
          <div className="text-sm text-ink-secondary">{physician?.specialty}</div>
        </div>
        <div className="ml-auto">
          <StatusBadge status={appointment.feeOwed && appointment.status === 'cancelled' ? 'fee_owed' : appointment.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-3">
          <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
            <Calendar size={12} /> Date
          </div>
          <div className="text-sm font-medium text-ink-primary mt-1">{fmtDateLong(appointment.date)}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
            <Clock size={12} /> Time
          </div>
          <div className="text-sm font-medium text-ink-primary mt-1">
            {fmtTime12(appointment.startTime)} to {fmtTime12(appointment.endTime)}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
          <FileText size={12} /> Reason for visit
        </div>
        <p className="text-sm text-ink-primary mt-1.5">{appointment.reason || 'Not specified'}</p>
      </div>

      {appointment.notes && (
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
            <ClipboardList size={12} /> Notes
          </div>
          <p className="text-sm text-ink-primary mt-1.5 whitespace-pre-wrap">{appointment.notes}</p>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
          <User size={12} /> Booked by
        </div>
        <p className="text-sm text-ink-primary mt-1.5 capitalize">{appointment.bookedBy}</p>
      </div>
    </div>
  );
}
