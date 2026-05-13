import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12 } from '../../utils/dateUtils';
import { dismissCancellationNoticeForAppointment } from '../../utils/rebookUtils';
import BookingStepPhysician from './BookingStepPhysician';
import BookingStepDateTime from './BookingStepDateTime';
import BookingStepDetails from './BookingStepDetails';
import BookingStepHealthCard from './BookingStepHealthCard';
import BookingStepConfirm from './BookingStepConfirm';

function StepIndicator({ steps, currentIdx }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <ol className="flex items-center gap-2 max-w-full overflow-x-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <li key={step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition shrink-0 ${
                  isDone
                    ? 'bg-brand text-white'
                    : isCurrent
                    ? 'bg-brand text-white ring-4 ring-brand/15'
                    : 'bg-surface-page border border-line text-ink-secondary'
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <div
                className={`text-sm font-medium hidden sm:block ${
                  isCurrent ? 'text-ink-primary' : 'text-ink-secondary'
                }`}
              >
                {step}
              </div>
              {idx < steps.length - 1 && <div className="w-6 h-px bg-line mx-1" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function BookingWizard({ mode = 'patient', patient, onComplete }) {
  // mode: 'patient' or 'admin'
  const isAdmin = mode === 'admin';
  const { patients, physicians, addAppointment, addNotification, showToast, notifications, markNotificationRead } =
    useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const initialPatient = isAdmin ? null : patient;
  const [data, setData] = useState({
    patientId: initialPatient?.id || '',
    physicianId: initialPatient?.defaultPhysicianId || '',
    date: null,
    startTime: null,
    endTime: null,
    reason: '',
    notes: '',
    fullName: initialPatient?.name,
    dob: initialPatient?.dob,
    phone: initialPatient?.phone,
    email: initialPatient?.email,
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    if (isAdmin) return;
    const rb = location.state?.rebook;
    if (!rb) return;
    setData((prev) => ({
      ...prev,
      physicianId: rb.physicianId || prev.physicianId,
      reason: rb.reason != null && rb.reason !== '' ? rb.reason : prev.reason,
      notes: rb.notes != null ? rb.notes : prev.notes,
    }));
    if (typeof rb.startAtStep === 'number' && rb.startAtStep >= 0 && rb.startAtStep < 5) {
      setStepIdx(rb.startAtStep);
    }
  }, [isAdmin, location.state?.rebook]);

  const activePatient = useMemo(
    () => (isAdmin ? patients.find((p) => p.id === data.patientId) : patient),
    [isAdmin, patients, data.patientId, patient]
  );

  // Build dynamic step list
  const steps = useMemo(() => {
    if (isAdmin) {
      // Admin: Patient → Physician → Date & Time → Details → Confirm (no health card)
      return ['Patient & Physician', 'Date & Time', 'Patient Details', 'Confirm'];
    }
    return ['Physician', 'Date & Time', 'Your Details', 'Health Card', 'Confirm'];
  }, [isAdmin]);

  const canContinue = (() => {
    if (isAdmin) {
      if (stepIdx === 0) return !!data.patientId && !!data.physicianId;
      if (stepIdx === 1) return !!data.date && !!data.startTime;
      if (stepIdx === 2) return !!(data.reason && data.reason.trim());
      return true;
    }
    if (stepIdx === 0) return !!data.physicianId;
    if (stepIdx === 1) return !!data.date && !!data.startTime;
    if (stepIdx === 2) return !!(data.reason && data.reason.trim());
    if (stepIdx === 3) return true;
    return true;
  })();

  const handleSubmit = () => {
    const status = isAdmin ? 'confirmed' : 'pending';
    const appt = addAppointment({
      patientId: activePatient.id,
      physicianId: data.physicianId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status,
      reason: data.reason,
      notes: data.notes || '',
      bookedBy: isAdmin ? 'admin' : 'patient',
      feeOwed: false,
      cancelledBy: null,
    });
    if (isAdmin) {
      addNotification({
        userId: activePatient.id,
        type: 'appointment_booked_for_patient',
        message: `An appointment has been scheduled for you with ${physicians.find((p) => p.id === data.physicianId)?.name || 'your physician'} on ${fmtDateLong(data.date)} at ${fmtTime12(data.startTime)}.`,
        appointmentId: appt.id,
      });
      showToast('Appointment scheduled. Confirmation sent to patient via email and SMS.');
    } else {
      addNotification({
        userId: 'admin-1',
        type: 'new_pending_appointment',
        message: `${activePatient.name} requested an appointment on ${fmtDateLong(data.date)} at ${fmtTime12(data.startTime)}.`,
        appointmentId: appt.id,
      });
      const cancelledId = location.state?.rebook?.cancelledAppointmentId;
      if (cancelledId) {
        dismissCancellationNoticeForAppointment(cancelledId, notifications, markNotificationRead);
      }
    }
    setSubmitted(appt);
    if (!isAdmin) {
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2200);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[560px] mx-auto card p-10 text-center mt-4">
        <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center text-status-green mb-4 animate-pop">
          <CheckCircle2 size={32} strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl font-semibold text-ink-primary">
          {isAdmin ? 'Appointment scheduled!' : 'Appointment Requested!'}
        </h2>
        <p className="text-sm text-ink-secondary mt-2 max-w-sm mx-auto">
          {isAdmin
            ? 'Confirmation sent to patient via email and SMS.'
            : 'A confirmation has been sent to your email and SMS.'}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {isAdmin ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSubmitted(null);
                  setData({
                    patientId: '',
                    physicianId: '',
                    date: null,
                    startTime: null,
                    endTime: null,
                    reason: '',
                    notes: '',
                  });
                  setStepIdx(0);
                }}
              >
                Book another
              </button>
              <button type="button" className="btn-primary" onClick={() => onComplete?.()}>
                Done
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" onClick={() => navigate('/patient/appointments')}>
              View my appointments
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentLabel = steps[stepIdx];

  return (
    <div className="max-w-[680px] mx-auto">
      <StepIndicator steps={steps} currentIdx={stepIdx} />
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-ink-primary mb-1">
          {currentLabel}
        </h2>
        <p className="text-sm text-ink-secondary mb-5">
          {isAdmin && stepIdx === 0 && 'Choose the patient and their physician.'}
          {!isAdmin && stepIdx === 0 && 'Pick the physician you would like to see.'}
          {stepIdx === (isAdmin ? 1 : 1) && 'Pick a date, then choose an available time.'}
          {stepIdx === (isAdmin ? 2 : 2) && (isAdmin ? 'Confirm patient details (read-only).' : 'Confirm the details we have on file and tell us why you are visiting.')}
          {!isAdmin && stepIdx === 3 && 'Snap a photo of your health card so we can fill in the rest.'}
          {((isAdmin && stepIdx === 3) || (!isAdmin && stepIdx === 4)) && 'Review everything, then submit.'}
        </p>

        {/* Body */}
        {isAdmin && stepIdx === 0 && (
          <BookingStepPhysician
            data={data}
            setData={setData}
            patient={activePatient}
            allowPatientPick
            allPatients={patients}
          />
        )}
        {!isAdmin && stepIdx === 0 && (
          <BookingStepPhysician data={data} setData={setData} patient={patient} />
        )}
        {stepIdx === 1 && <BookingStepDateTime data={data} setData={setData} />}
        {stepIdx === 2 && (
          <BookingStepDetails
            data={data}
            setData={setData}
            patient={activePatient}
            readOnly={isAdmin}
          />
        )}
        {!isAdmin && stepIdx === 3 && <BookingStepHealthCard patient={activePatient} />}
        {((isAdmin && stepIdx === 3) || (!isAdmin && stepIdx === 4)) && (
          <BookingStepConfirm data={data} patient={activePatient} />
        )}

        <div className="mt-8 flex items-center justify-between gap-2 border-t border-line pt-5">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {stepIdx < steps.length - 1 ? (
            <button
              type="button"
              className="btn-primary"
              disabled={!canContinue}
              onClick={() => setStepIdx((i) => i + 1)}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn-primary-lg" onClick={handleSubmit}>
              {isAdmin ? 'Schedule Appointment' : 'Request Appointment'}
            </button>
          )}
        </div>

        {!isAdmin && stepIdx === steps.length - 1 && (
          <p className="text-xs text-ink-secondary mt-3 text-center">
            Your request will be reviewed by the clinic. You&apos;ll receive a confirmation via email and SMS once approved.
          </p>
        )}
      </div>
    </div>
  );
}
