import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import ConfirmModal from '../shared/ConfirmModal';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12 } from '../../utils/dateUtils';
import { isWithin48Hours } from '../../utils/slotUtils';

export default function CancelAppointmentModal({ open, appointment, onClose }) {
  const { physicians, cancelAppointment, addNotification, showToast } = useApp();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!open) setAccepted(false);
  }, [open]);

  if (!open || !appointment) return null;

  const physician = physicians.find((p) => p.id === appointment.physicianId);
  const within48 = isWithin48Hours(appointment.date, appointment.startTime);

  const handleConfirm = () => {
    if (within48 && !accepted) return;
    cancelAppointment(appointment.id, 'patient', within48);
    if (within48) {
      addNotification({
        userId: 'admin-1',
        type: 'fee_owed',
        message: `${physician?.name}'s patient cancelled within 48 hours. A $50 fee is owed.`,
        appointmentId: appointment.id,
      });
    }
    onClose?.();
    showToast(
      within48
        ? 'Appointment cancelled. The clinic will contact you about the cancellation fee.'
        : 'Appointment cancelled. Confirmation sent to your email and SMS.'
    );
  };

  return (
    <ConfirmModal
      open={open}
      title="Cancel this appointment?"
      message={null}
      confirmLabel="Cancel Appointment"
      cancelLabel="Keep Appointment"
      confirmVariant="danger"
      disableConfirm={within48 && !accepted}
      onConfirm={handleConfirm}
      onCancel={onClose}
    >
      <div className="space-y-3">
        <div className="bg-surface-page rounded-card border border-line p-4 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">Physician</span>
            <span className="font-medium">{physician?.name}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">Date</span>
            <span className="font-medium">{fmtDateLong(appointment.date)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">Time</span>
            <span className="font-medium">{fmtTime12(appointment.startTime)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-ink-secondary">Reason</span>
            <span className="font-medium text-right max-w-[60%]">{appointment.reason}</span>
          </div>
        </div>

        {within48 ? (
          <>
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-card p-3">
              <AlertTriangle size={16} className="text-status-red shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <div className="font-medium">A $50 cancellation fee will be charged.</div>
                <p className="mt-1 text-red-800">The clinic will contact you to collect payment.</p>
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm text-ink-primary cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>I understand and accept the cancellation fee.</span>
            </label>
          </>
        ) : (
          <p className="text-sm text-ink-secondary">
            You can cancel without a fee since this is more than 48 hours away.
          </p>
        )}
      </div>
    </ConfirmModal>
  );
}
