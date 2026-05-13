import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CalendarPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDay, fmtDateShort, fmtTime12 } from '../../utils/dateUtils';
import { getNextAvailableSlots } from '../../utils/slotUtils';
import ConfirmModal from '../shared/ConfirmModal';
import { dismissCancellationNoticeForAppointment } from '../../utils/rebookUtils';

export default function RebookSlots({ patient, originalAppointment }) {
  const { physicians, appointments, addAppointment, addNotification, showToast, notifications, markNotificationRead } =
    useApp();
  const navigate = useNavigate();
  const [pickedSlot, setPickedSlot] = useState(null);

  const physician = useMemo(
    () => physicians.find((p) => p.id === (originalAppointment?.physicianId || patient.defaultPhysicianId)),
    [physicians, patient, originalAppointment]
  );

  const slots = useMemo(
    () => getNextAvailableSlots(physician, appointments, 3),
    [physician, appointments]
  );

  const handleConfirm = () => {
    if (!pickedSlot) return;
    const newAppt = addAppointment({
      patientId: patient.id,
      physicianId: physician.id,
      date: pickedSlot.date,
      startTime: pickedSlot.startTime,
      endTime: pickedSlot.endTime,
      status: 'pending',
      reason: originalAppointment?.reason || 'Rebook from cancelled appointment',
      notes: originalAppointment?.notes || '',
      bookedBy: 'patient',
      feeOwed: false,
      cancelledBy: null,
    });
    addNotification({
      userId: patient.id,
      type: 'appointment_rebooked',
      message: `Your appointment has been rebooked for ${fmtDateShort(pickedSlot.date)} at ${fmtTime12(pickedSlot.startTime)}.`,
      appointmentId: newAppt.id,
    });
    setPickedSlot(null);
    showToast('Appointment rebooked. Confirmation sent to your email and SMS.');
    dismissCancellationNoticeForAppointment(originalAppointment?.id, notifications, markNotificationRead);
  };

  const chooseOwn = (
    <button
      type="button"
      onClick={() =>
        navigate('/patient/book', {
          state: {
            rebook: {
              physicianId: physician?.id,
              cancelledAppointmentId: originalAppointment?.id,
              reason: originalAppointment?.reason || 'Rebook from cancelled appointment',
              notes: originalAppointment?.notes || '',
              startAtStep: 1,
            },
          },
        })
      }
      className="bg-white border-2 border-dashed border-brand/40 rounded-card px-4 py-3 text-left hover:border-brand hover:bg-brand-tint transition flex flex-col justify-center min-h-[120px]"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand font-medium">
        <CalendarPlus size={12} /> Choose your own
      </div>
      <div className="text-base font-semibold text-ink-primary mt-1">Pick date and time</div>
      <p className="text-xs text-ink-secondary mt-2 leading-snug">
        Opens the booking calendar with this physician and your visit details filled in. Change anything you need.
      </p>
    </button>
  );

  if (!slots.length) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-secondary">
          No nearby quick slots right now. You can still book using the full calendar.
        </p>
        {chooseOwn}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {slots.map((s) => (
          <button
            key={`${s.date}-${s.startTime}`}
            type="button"
            onClick={() => setPickedSlot(s)}
            className="bg-white border border-line rounded-card px-4 py-3 text-left hover:border-brand hover:bg-brand-tint transition group"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-secondary font-medium">
              <Calendar size={12} /> {fmtDay(s.date)}
            </div>
            <div className="text-base font-semibold text-ink-primary mt-1">{fmtDateShort(s.date)}</div>
            <div className="flex items-center gap-1.5 text-sm text-ink-primary mt-1.5">
              <Clock size={13} className="text-ink-secondary" />
              {fmtTime12(s.startTime)}
            </div>
            <div className="text-xs text-ink-secondary mt-1">{physician?.name}</div>
          </button>
        ))}
        {chooseOwn}
      </div>

      <ConfirmModal
        open={!!pickedSlot}
        title="Confirm Rebook"
        message="Your previous details and reason for visit have been carried over."
        confirmLabel="Confirm Rebook"
        cancelLabel="Go Back"
        onConfirm={handleConfirm}
        onCancel={() => setPickedSlot(null)}
      >
        {pickedSlot && (
          <div className="bg-surface-page rounded-card border border-line p-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Physician</span>
              <span className="font-medium">{physician?.name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Date</span>
              <span className="font-medium">{fmtDateShort(pickedSlot.date)} · {fmtDay(pickedSlot.date)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Time</span>
              <span className="font-medium">{fmtTime12(pickedSlot.startTime)}</span>
            </div>
          </div>
        )}
      </ConfirmModal>
    </>
  );
}
