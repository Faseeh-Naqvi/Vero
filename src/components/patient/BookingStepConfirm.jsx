import { Calendar, Clock, Stethoscope, FileText, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12 } from '../../utils/dateUtils';
import Avatar from '../shared/Avatar';

export default function BookingStepConfirm({ data, patient }) {
  const { physicians } = useApp();
  const physician = physicians.find((p) => p.id === data.physicianId);

  return (
    <div className="space-y-4">
      <div className="card p-5 bg-surface-page">
        <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium mb-3">
          Appointment summary
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar initials={physician?.avatar} size={42} color={physician?.color} />
            <div>
              <div className="text-base font-semibold text-ink-primary">{physician?.name}</div>
              <div className="text-sm text-ink-secondary flex items-center gap-1.5">
                <Stethoscope size={12} /> {physician?.specialty}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
                <Calendar size={12} /> Date
              </div>
              <div className="text-sm font-medium text-ink-primary mt-1">{fmtDateLong(data.date)}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
                <Clock size={12} /> Time
              </div>
              <div className="text-sm font-medium text-ink-primary mt-1">{fmtTime12(data.startTime)}</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium flex items-center gap-1.5">
              <FileText size={12} /> Reason for visit
            </div>
            <p className="text-sm text-ink-primary mt-1">{data.reason}</p>
          </div>
          {patient?.healthCardNumber && (
            <div className="flex items-center gap-2 pt-3 border-t border-line text-sm text-ink-secondary">
              <Lock size={14} className="text-status-green" />
              Health card number on file: <span className="font-mono text-ink-primary">{patient.healthCardNumber}</span>
              <span className="text-status-green text-xs ml-auto">Saved to profile</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
