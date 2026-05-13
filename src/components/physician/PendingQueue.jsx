import { Check, X } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';
import { fmtDateMed, fmtTime12 } from '../../utils/dateUtils';

export default function PendingQueue({ pending, showPhysicianColumn = false }) {
  const { patients, physicians, updateAppointment, addNotification, showToast } = useApp();

  const confirm = (appt) => {
    updateAppointment(appt.id, { status: 'confirmed' });
    addNotification({
      userId: appt.patientId,
      type: 'appointment_confirmed',
      message: `Your appointment with ${physicians.find((p) => p.id === appt.physicianId)?.name} on ${fmtDateMed(appt.date)} has been confirmed.`,
      appointmentId: appt.id,
    });
    showToast('Appointment confirmed. Patient notified.');
  };

  const decline = (appt) => {
    updateAppointment(appt.id, { status: 'cancelled', cancelledBy: 'physician', feeOwed: false });
    addNotification({
      userId: appt.patientId,
      type: 'appointment_cancelled_by_physician',
      message: `${physicians.find((p) => p.id === appt.physicianId)?.name} has cancelled your ${fmtDateMed(appt.date)} appointment. Please rebook.`,
      appointmentId: appt.id,
    });
    showToast('Appointment declined. Patient notified to rebook.', 'error');
  };

  if (pending.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-ink-secondary">
        No pending requests right now. Nice work staying on top of things!
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface-page border-b border-line">
          <tr>
            <th className="table-head-cell">Patient</th>
            {showPhysicianColumn && <th className="table-head-cell">Physician</th>}
            <th className="table-head-cell">Date & Time</th>
            <th className="table-head-cell">Reason</th>
            <th className="table-head-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((appt) => {
            const patient = patients.find((p) => p.id === appt.patientId);
            const phys = physicians.find((p) => p.id === appt.physicianId);
            return (
              <tr key={appt.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={patient?.avatar} size={28} />
                    <div>
                      <div className="font-medium">{patient?.name}</div>
                      <div className="text-xs text-ink-secondary">{patient?.email}</div>
                    </div>
                  </div>
                </td>
                {showPhysicianColumn && (
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phys?.color }} />
                      {phys?.name}
                    </div>
                  </td>
                )}
                <td className="table-cell">
                  <div className="font-medium">{fmtDateMed(appt.date)}</div>
                  <div className="text-xs text-ink-secondary">{fmtTime12(appt.startTime)}</div>
                </td>
                <td className="table-cell max-w-[260px] truncate" title={appt.reason}>{appt.reason}</td>
                <td className="table-cell text-right">
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      className="btn-success btn-compact"
                      onClick={() => confirm(appt)}
                    >
                      <Check size={14} /> Confirm
                    </button>
                    <button
                      type="button"
                      className="btn-secondary btn-compact text-status-red hover:bg-red-50"
                      onClick={() => decline(appt)}
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
