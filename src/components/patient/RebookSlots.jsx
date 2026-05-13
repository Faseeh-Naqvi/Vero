import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, CalendarPlus, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDay, fmtDateShort, fmtTime12 } from '../../utils/dateUtils';
import { getNextAvailableSlots } from '../../utils/slotUtils';
import ConfirmModal from '../shared/ConfirmModal';
import { dismissCancellationNoticeForAppointment } from '../../utils/rebookUtils';

export default function RebookSlots({ patient, originalAppointment, variant = 'default' }) {
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

  const chooseOwnClasses =
    variant === 'drawer'
      ? 'flex w-full items-start gap-3 rounded-card border-2 border-dashed border-brand/35 bg-brand-tint/40 px-4 py-4 text-left transition hover:border-brand hover:bg-brand-tint/70'
      : 'bg-white border-2 border-dashed border-brand/40 rounded-card px-4 py-3 text-left hover:border-brand hover:bg-brand-tint transition flex flex-col justify-start gap-1 min-h-[120px] w-full';

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
      className={chooseOwnClasses}
    >
      {variant === 'drawer' ? (
        <>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-brand/15">
            <CalendarPlus size={20} className="text-brand" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">Choose your own</div>
            <div className="mt-1 text-base font-semibold text-ink-primary">Open full calendar</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Same physician and visit details are prefilled. Adjust anything before you confirm.
            </p>
          </div>
          <ChevronRight className="mt-1 shrink-0 text-ink-secondary" size={18} aria-hidden />
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand font-medium">
            <CalendarPlus size={12} /> Choose your own
          </div>
          <div className="text-base font-semibold text-ink-primary mt-1">Pick date and time</div>
          <p className="text-xs text-ink-secondary mt-2 leading-snug">
            Opens the booking calendar with this physician and your visit details filled in. Change anything you need.
          </p>
        </>
      )}
    </button>
  );

  if (!slots.length) {
    return (
      <div className={variant === 'drawer' ? 'space-y-5' : 'space-y-3'}>
        <p className="text-sm text-ink-secondary">
          No nearby quick slots right now. You can still book using the full calendar.
        </p>
        {chooseOwn}
      </div>
    );
  }

  const slotPicker =
    variant === 'drawer' ? (
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">Suggested times</p>
          <ul className="mt-3 space-y-2.5">
            {slots.map((s) => (
              <li key={`${s.date}-${s.startTime}`}>
                <button
                  type="button"
                  onClick={() => setPickedSlot(s)}
                  className="flex w-full items-center gap-3 rounded-card border border-line bg-white p-4 text-left shadow-sm transition hover:border-brand hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-page ring-1 ring-line">
                    <span className="text-[10px] font-semibold uppercase leading-none text-ink-secondary">
                      {format(parseISO(s.date), 'EEE')}
                    </span>
                    <span className="mt-0.5 text-base font-bold tabular-nums leading-none text-ink-primary">
                      {format(parseISO(s.date), 'd')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink-primary">
                      {fmtDay(s.date)} · {fmtDateShort(s.date)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-secondary">
                      <span className="inline-flex items-center gap-1 text-ink-primary">
                        <Clock size={14} className="shrink-0 text-ink-secondary" aria-hidden />
                        {fmtTime12(s.startTime)}
                      </span>
                      <span className="text-ink-secondary/45" aria-hidden>
                        ·
                      </span>
                      <span className="truncate">{physician?.name}</span>
                    </div>
                  </div>
                  <ChevronRight className="shrink-0 text-ink-secondary" size={20} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-line pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">More options</p>
          <div className="mt-3">{chooseOwn}</div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
        {slots.map((s) => (
          <button
            key={`${s.date}-${s.startTime}`}
            type="button"
            onClick={() => setPickedSlot(s)}
            className="flex flex-col items-start text-left w-full bg-white border border-line rounded-card px-4 py-3 hover:border-brand hover:bg-brand-tint transition group"
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
    );

  return (
    <>
      {slotPicker}

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
              <span className="font-medium">
                {fmtDateShort(pickedSlot.date)} · {fmtDay(pickedSlot.date)}
              </span>
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
