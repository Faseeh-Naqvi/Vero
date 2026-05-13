import { Calendar, Clock, IdCard, FileText, ClipboardList, Cake } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12, fmtDateMed } from '../../utils/dateUtils';

export default function PhysicianApptDetailBody({ appointment }) {
  const { patients } = useApp();
  if (!appointment) return null;
  const patient = patients.find((p) => p.id === appointment.patientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar initials={patient?.avatar} size={48} />
        <div className="flex-1">
          <div className="text-base font-semibold text-ink-primary">{patient?.name}</div>
          <div className="text-xs text-ink-secondary flex items-center gap-3">
            <span className="flex items-center gap-1"><Cake size={11} /> {fmtDateMed(patient?.dob)}</span>
            <span className="flex items-center gap-1"><IdCard size={11} /> <span className="font-mono">{patient?.healthCardNumber}</span></span>
          </div>
        </div>
        <StatusBadge status={appointment.feeOwed && appointment.status === 'cancelled' ? 'fee_owed' : appointment.status} />
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
    </div>
  );
}
