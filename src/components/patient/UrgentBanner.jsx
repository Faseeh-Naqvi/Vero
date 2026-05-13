import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fmtDateLong, fmtTime12, toDateObj } from '../../utils/dateUtils';
import RebookSlots from './RebookSlots';

/** Pending first (needs approval), then soonest visit date. */
function sortUpcomingForBanner(appointments) {
  if (!appointments?.length) return [];
  return [...appointments].sort((a, b) => {
    const ap = a.status === 'pending' ? 0 : 1;
    const bp = b.status === 'pending' ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime);
  });
}

export default function UrgentBanner({
  patient,
  upcomingAppointments = [],
  cancelledByPhysician,
  onView,
  onCancel,
}) {
  const { physicians } = useApp();
  const navigate = useNavigate();

  const prioritized = useMemo(() => sortUpcomingForBanner(upcomingAppointments), [upcomingAppointments]);

  const [slide, setSlide] = useState(0);

  const idsKey = prioritized.map((a) => a.id).join(',');

  useEffect(() => {
    setSlide(0);
  }, [idsKey]);

  useEffect(() => {
    if (slide >= prioritized.length && prioritized.length > 0) {
      setSlide(prioritized.length - 1);
    }
  }, [prioritized.length, slide]);

  const len = prioritized.length;
  const safeIndex = len ? Math.min(slide, len - 1) : 0;
  const upcomingConfirmedOrPending = len ? prioritized[safeIndex] : null;

  const goPrev = () => setSlide((s) => (s - 1 + len) % len);
  const goNext = () => setSlide((s) => (s + 1) % len);

  if (cancelledByPhysician) {
    const phys = physicians.find((p) => p.id === cancelledByPhysician.physicianId);
    return (
      <div className="rounded-card border border-red-200 bg-red-50 p-5 mb-6 animate-fadein">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-status-red/15 flex items-center justify-center text-status-red">
            <AlertCircle size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-ink-primary">Your appointment was cancelled</h3>
            <p className="text-sm text-ink-secondary mt-1">
              {phys?.name || 'Your physician'} cancelled your{' '}
              <span className="font-medium text-ink-primary">{fmtDateLong(cancelledByPhysician.date)}</span>{' '}
              appointment. Please pick a new time below.
            </p>
            <div className="mt-4">
              <RebookSlots patient={patient} originalAppointment={cancelledByPhysician} />
            </div>
            <p className="text-xs text-ink-secondary mt-3">
              A confirmation will be sent to your email and SMS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (upcomingConfirmedOrPending) {
    const phys = physicians.find((p) => p.id === upcomingConfirmedOrPending.physicianId);
    const isPending = upcomingConfirmedOrPending.status === 'pending';
    const showCarousel = len > 1;

    return (
      <div
        className={`rounded-card bg-white mb-6 shadow-card border-l-4 overflow-hidden ${
          isPending ? 'border-l-status-amber border-y border-r border-line' : 'border-l-status-green border-y border-r border-line'
        }`}
      >
        <div className="relative">
          {showCarousel && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 w-9 h-9 rounded-full border border-line bg-white shadow-sm flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-brand hover:bg-brand-tint transition"
              aria-label="Previous upcoming appointment"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {showCarousel && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 w-9 h-9 rounded-full border border-line bg-white shadow-sm flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-brand hover:bg-brand-tint transition"
              aria-label="Next upcoming appointment"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <div
            className={`p-5 ${showCarousel ? 'px-12 sm:px-14' : ''}`}
            tabIndex={showCarousel ? 0 : undefined}
            onKeyDown={
              showCarousel
                ? (e) => {
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      goPrev();
                    }
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      goNext();
                    }
                  }
                : undefined
            }
            role={showCarousel ? 'region' : undefined}
            aria-label={showCarousel ? 'Upcoming appointments, use arrow keys or buttons to browse' : undefined}
          >
            <div className="flex items-start gap-4">
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isPending ? 'bg-amber-50 text-status-amber' : 'bg-green-50 text-status-green'
                }`}
              >
                <CheckCircle2 size={20} aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium">
                    {isPending ? 'Awaiting confirmation' : 'Your next appointment'}
                  </div>
                  {showCarousel && (
                    <span className="text-xs text-ink-secondary tabular-nums">
                      {safeIndex + 1} of {len}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-ink-primary mt-0.5">
                  {phys?.name}{' '}
                  <span className="text-ink-secondary text-base font-normal">· {phys?.specialty}</span>
                </h3>
                <p className="text-sm text-ink-primary mt-1">
                  {fmtDateLong(upcomingConfirmedOrPending.date)} at{' '}
                  <span className="font-medium">{fmtTime12(upcomingConfirmedOrPending.startTime)}</span>
                </p>
                {upcomingConfirmedOrPending.reason && (
                  <p className="text-sm text-ink-secondary mt-1">
                    Reason: {upcomingConfirmedOrPending.reason}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={() => onView(upcomingConfirmedOrPending)}>
                    View Details
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-status-red hover:bg-red-50"
                    onClick={() => onCancel(upcomingConfirmedOrPending)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCarousel && (
          <div className="flex justify-center gap-1.5 px-5 pb-4 pt-0 border-t border-transparent">
            {prioritized.map((a, i) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all min-w-[8px] ${
                  i === safeIndex ? 'w-6 bg-brand' : 'w-2 bg-line hover:bg-ink-secondary/40'
                }`}
                aria-label={`Show appointment ${i + 1} of ${len}`}
                aria-current={i === safeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-card bg-brand-tint border border-brand/15 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary">No upcoming appointments</h3>
          <p className="text-sm text-ink-secondary mt-1">
            Book a visit when you are ready. Your usual physician is one click away.
          </p>
        </div>
        <button type="button" className="btn-primary-lg" onClick={() => navigate('/patient/book')}>
          <CalendarPlus size={16} /> Book an Appointment <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
