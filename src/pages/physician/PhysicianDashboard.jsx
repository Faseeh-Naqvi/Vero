import { useMemo, useState } from 'react';
import { Calendar, CalendarClock, BellRing } from 'lucide-react';
import AppLayout from '../../components/shared/AppLayout';
import { physicianNavItems } from '../../components/physician/PhysicianNav';
import { useApp } from '../../context/AppContext';
import { fmtTime12, toDateObj, isToday } from '../../utils/dateUtils';
import { addDays, parseISO } from 'date-fns';
import StatCard from '../../components/shared/StatCard';
import PendingQueue from '../../components/physician/PendingQueue';
import Avatar from '../../components/shared/Avatar';
import StatusBadge from '../../components/shared/StatusBadge';
import AppointmentDrawer from '../../components/shared/AppointmentDrawer';
import PhysicianApptDetailBody from '../../components/physician/PhysicianApptDetailBody';
import ConfirmModal from '../../components/shared/ConfirmModal';

export default function PhysicianDashboard() {
  const { currentUser, appointments, physicians, patients, updateAppointment, addNotification, showToast } = useApp();
  const me = physicians.find((p) => p.id === currentUser.linkedId);
  const [drawerAppt, setDrawerAppt] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const mine = useMemo(
    () => appointments.filter((a) => a.physicianId === me.id),
    [appointments, me.id]
  );

  const pending = useMemo(
    () => mine.filter((a) => a.status === 'pending').sort((a, b) => toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime)),
    [mine]
  );

  const todayAppts = useMemo(
    () =>
      mine
        .filter((a) => isToday(a.date) && a.status === 'confirmed')
        .sort((a, b) => toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime)),
    [mine]
  );

  const weekTotal = useMemo(() => {
    const now = new Date();
    const weekEnd = addDays(now, 7);
    return mine.filter((a) => {
      const d = parseISO(a.date);
      return d >= now && d <= weekEnd && a.status !== 'cancelled';
    }).length;
  }, [mine]);

  const handleCancelByPhysician = (appt) => {
    updateAppointment(appt.id, { status: 'cancelled', cancelledBy: 'physician', feeOwed: false });
    addNotification({
      userId: appt.patientId,
      type: 'appointment_cancelled_by_physician',
      message: `${me.name} has cancelled your ${appt.date} appointment. Please rebook.`,
      appointmentId: appt.id,
    });
    setConfirmCancel(null);
    setDrawerAppt(null);
    showToast('Appointment cancelled. The patient has been notified to rebook.');
  };

  const markComplete = (appt) => {
    updateAppointment(appt.id, { status: 'completed' });
    addNotification({
      userId: appt.patientId,
      type: 'appointment_completed',
      message: `Your visit with ${me.name} has been marked complete. Thank you!`,
      appointmentId: appt.id,
    });
    setDrawerAppt(null);
    showToast('Appointment marked complete.');
  };

  return (
    <AppLayout
      navItems={physicianNavItems}
      title={`Good day, ${me.name}`}
      subtitle={`${me.specialty} · ${me.workdayStart} to ${me.workdayEnd}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Today's appointments" value={todayAppts.length} icon={Calendar} accent="brand" />
        <StatCard
          label="Pending approvals"
          value={pending.length}
          icon={BellRing}
          accent={pending.length > 0 ? 'amber' : 'default'}
        />
        <StatCard label="This week total" value={weekTotal} icon={CalendarClock} />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Pending approvals</h2>
        <PendingQueue pending={pending} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Today&apos;s schedule</h2>
        {todayAppts.length === 0 ? (
          <div className="card p-8 text-center text-sm text-ink-secondary">
            <Calendar size={28} className="mx-auto mb-2 text-ink-secondary/60" />
            Nothing on the schedule today.
          </div>
        ) : (
          <ul className="card divide-y divide-line">
            {todayAppts.map((appt) => {
              const patient = patients.find((p) => p.id === appt.patientId);
              return (
                <li
                  key={appt.id}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-hover cursor-pointer"
                  onClick={() => setDrawerAppt(appt)}
                >
                  <div className="w-16 text-sm font-medium text-brand">{fmtTime12(appt.startTime)}</div>
                  <Avatar initials={patient?.avatar} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{patient?.name}</div>
                    <div className="text-xs text-ink-secondary truncate">{appt.reason}</div>
                  </div>
                  <StatusBadge status={appt.status} />
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
                className="btn-secondary text-status-red hover:bg-red-50"
                onClick={() => setConfirmCancel(drawerAppt)}
              >
                Cancel Appointment
              </button>
              <button type="button" className="btn-success" onClick={() => markComplete(drawerAppt)}>
                Mark Complete
              </button>
            </div>
          ) : null
        }
      >
        <PhysicianApptDetailBody appointment={drawerAppt} />
      </AppointmentDrawer>

      <ConfirmModal
        open={!!confirmCancel}
        title="Cancel this appointment?"
        message="The patient will be notified and asked to rebook."
        confirmLabel="Cancel Appointment"
        cancelLabel="Keep Appointment"
        confirmVariant="danger"
        onConfirm={() => handleCancelByPhysician(confirmCancel)}
        onCancel={() => setConfirmCancel(null)}
      />
    </AppLayout>
  );
}
