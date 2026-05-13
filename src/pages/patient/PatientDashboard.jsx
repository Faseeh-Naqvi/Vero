import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import AppLayout from '../../components/shared/AppLayout';
import { patientNavItems } from '../../components/patient/PatientNav';
import { useApp } from '../../context/AppContext';
import { fmtDateMed, fmtTime12, toDateObj } from '../../utils/dateUtils';
import StatusBadge from '../../components/shared/StatusBadge';
import Avatar from '../../components/shared/Avatar';
import UrgentBanner from '../../components/patient/UrgentBanner';
import AppointmentDrawer from '../../components/shared/AppointmentDrawer';
import AppointmentDetailBody from '../../components/patient/AppointmentDetailBody';
import CancelAppointmentModal from '../../components/patient/CancelAppointmentModal';

export default function PatientDashboard() {
  const { currentUser, appointments, patients, physicians, notifications, markNotificationRead } = useApp();
  const patient = patients.find((p) => p.id === currentUser?.linkedId);
  const patientId = currentUser?.linkedId;
  const [drawerAppt, setDrawerAppt] = useState(null);
  const [cancelAppt, setCancelAppt] = useState(null);

  const myAppointments = useMemo(
    () => (patientId ? appointments.filter((a) => a.patientId === patientId) : []),
    [appointments, patientId]
  );

  const now = new Date();
  const upcoming = useMemo(
    () =>
      myAppointments
        .filter((a) => (a.status === 'confirmed' || a.status === 'pending') && toDateObj(a.date, a.startTime) >= now)
        .sort((a, b) => toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime)),
    [myAppointments, now]
  );

  const physicianCancelled = useMemo(() => {
    const unread = notifications.find(
      (n) =>
        n.userId === currentUser?.id &&
        (n.type === 'appointment_cancelled_by_physician' || n.type === 'appointment_cancelled_by_admin') &&
        !n.read
    );
    if (!unread) return null;
    const appt = myAppointments.find((a) => a.id === unread.appointmentId);
    if (!appt || appt.replacedByAppointmentId) return null;
    return appt;
  }, [notifications, currentUser?.id, myAppointments]);

  const handleView = (appt) => setDrawerAppt(appt);

  const handleDismissPhysicianCancel = () => {
    const unread = notifications.find(
      (n) =>
        n.userId === currentUser?.id &&
        (n.type === 'appointment_cancelled_by_physician' || n.type === 'appointment_cancelled_by_admin') &&
        !n.read
    );
    if (unread) markNotificationRead(unread.id);
  };

  if (!patient) {
    return (
      <AppLayout navItems={patientNavItems} title="Dashboard" subtitle="We could not load your patient profile.">
        <p className="text-sm text-ink-secondary">Try logging out and back in with a patient demo account.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      navItems={patientNavItems}
      title={`Welcome back, ${patient.name.split(' ')[0]}`}
      subtitle="Here is a snapshot of your care at Vero."
      headerAction={
        physicianCancelled && (
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={handleDismissPhysicianCancel}
            aria-label="Dismiss cancellation notice"
          >
            Dismiss
          </button>
        )
      }
    >
      <UrgentBanner
        patient={patient}
        upcomingAppointments={upcoming}
        cancelledByPhysician={physicianCancelled}
        onView={handleView}
        onCancel={setCancelAppt}
      />

      <section className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-ink-primary">Upcoming appointments</h2>
          <Link to="/patient/appointments" className="text-sm text-brand hover:text-brand-hover font-medium inline-flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-ink-secondary text-sm">
            <Calendar size={28} className="mx-auto mb-2 text-ink-secondary/60" aria-hidden />
            You have no upcoming appointments.
          </div>
        ) : (
          <ul className="card divide-y divide-line">
            {upcoming.slice(0, 3).map((appt) => {
              const phys = physicians.find((p) => p.id === appt.physicianId);
              return (
                <li key={appt.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-hover">
                  <Avatar initials={phys?.avatar} size={36} color={phys?.color} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-primary truncate">{phys?.name}</div>
                    <div className="text-xs text-ink-secondary">
                      {fmtDateMed(appt.date)} · {fmtTime12(appt.startTime)} · {appt.reason}
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                  <button type="button" className="btn-secondary btn-compact" onClick={() => handleView(appt)}>
                    View
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AppointmentDrawer
        open={!!drawerAppt}
        onClose={() => setDrawerAppt(null)}
        title="Appointment details"
        footer={
          drawerAppt && (drawerAppt.status === 'confirmed' || drawerAppt.status === 'pending') ? (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="btn-ghost text-status-red hover:bg-red-50"
                onClick={() => {
                  setCancelAppt(drawerAppt);
                  setDrawerAppt(null);
                }}
              >
                Cancel Appointment
              </button>
              <button type="button" className="btn-primary" onClick={() => setDrawerAppt(null)}>
                Done
              </button>
            </div>
          ) : null
        }
      >
        <AppointmentDetailBody appointment={drawerAppt} />
      </AppointmentDrawer>

      <CancelAppointmentModal
        open={!!cancelAppt}
        appointment={cancelAppt}
        onClose={() => setCancelAppt(null)}
      />
    </AppLayout>
  );
}
