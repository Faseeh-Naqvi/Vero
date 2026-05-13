import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import AppLayout from '../../components/shared/AppLayout';
import { patientNavItems } from '../../components/patient/PatientNav';
import { useApp } from '../../context/AppContext';
import { fmtDateMed, fmtTime12, toDateObj } from '../../utils/dateUtils';
import StatusBadge from '../../components/shared/StatusBadge';
import Avatar from '../../components/shared/Avatar';
import CancelAppointmentModal from '../../components/patient/CancelAppointmentModal';
import AppointmentDrawer from '../../components/shared/AppointmentDrawer';
import AppointmentDetailBody from '../../components/patient/AppointmentDetailBody';
import RebookSlots from '../../components/patient/RebookSlots';

export default function PatientAppointments() {
  const { currentUser, appointments, patients, physicians } = useApp();
  const patient = patients.find((p) => p.id === currentUser.linkedId);
  const [cancelAppt, setCancelAppt] = useState(null);
  const [drawerAppt, setDrawerAppt] = useState(null);
  const [rebookAppt, setRebookAppt] = useState(null);

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === patient.id)
        .sort((a, b) => toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime)),
    [appointments, patient.id]
  );

  return (
    <AppLayout
      navItems={patientNavItems}
      title="My Appointments"
      subtitle="Past, upcoming, and cancelled visits in one place."
      headerAction={
        <Link to="/patient/book" className="btn-primary">
          <CalendarPlus size={16} /> Book Appointment
        </Link>
      }
    >
      {mine.length === 0 ? (
        <div className="card p-10 text-center text-ink-secondary text-sm">
          You don&apos;t have any appointments yet.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-page border-b border-line">
              <tr>
                <th className="table-head-cell">Physician</th>
                <th className="table-head-cell">Date</th>
                <th className="table-head-cell">Time</th>
                <th className="table-head-cell">Reason</th>
                <th className="table-head-cell">Status</th>
                <th className="table-head-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((appt) => {
                const phys = physicians.find((p) => p.id === appt.physicianId);
                const isOpen = appt.status === 'pending' || appt.status === 'confirmed';
                const isPhysicianCancelled =
                  appt.status === 'cancelled' && (appt.cancelledBy === 'physician' || appt.cancelledBy === 'admin');
                return (
                  <tr key={appt.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={phys?.avatar} size={28} color={phys?.color} />
                        <div>
                          <div className="font-medium">{phys?.name}</div>
                          <div className="text-xs text-ink-secondary">{phys?.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{fmtDateMed(appt.date)}</td>
                    <td className="table-cell">{fmtTime12(appt.startTime)}</td>
                    <td className="table-cell max-w-[240px] truncate" title={appt.reason}>{appt.reason}</td>
                    <td className="table-cell">
                      <StatusBadge status={appt.feeOwed && appt.status === 'cancelled' ? 'fee_owed' : appt.status} />
                    </td>
                    <td className="table-cell text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          className="btn-ghost btn-compact"
                          onClick={() => setDrawerAppt(appt)}
                        >
                          View
                        </button>
                        {isOpen && (
                          <button
                            type="button"
                            className="btn-ghost btn-compact text-status-red hover:bg-red-50"
                            onClick={() => setCancelAppt(appt)}
                          >
                            Cancel
                          </button>
                        )}
                        {isPhysicianCancelled && (
                          <button
                            type="button"
                            className="btn-primary btn-compact"
                            onClick={() => setRebookAppt(appt)}
                          >
                            Rebook
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CancelAppointmentModal
        open={!!cancelAppt}
        appointment={cancelAppt}
        onClose={() => setCancelAppt(null)}
      />

      <AppointmentDrawer
        open={!!drawerAppt}
        onClose={() => setDrawerAppt(null)}
        title="Appointment details"
      >
        <AppointmentDetailBody appointment={drawerAppt} />
      </AppointmentDrawer>

      <AppointmentDrawer
        open={!!rebookAppt}
        onClose={() => setRebookAppt(null)}
        title="Pick a new time"
      >
        {rebookAppt && (
          <div className="space-y-5">
            <div className="rounded-card border border-red-100 bg-gradient-to-b from-red-50/90 to-white px-4 py-3.5 shadow-sm">
              <p className="text-sm font-medium text-ink-primary">
                This visit was cancelled by{' '}
                <span className="text-ink-primary">
                  {physicians.find((p) => p.id === rebookAppt.physicianId)?.name}
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                Choose a suggested slot below, or open the full calendar to pick any available time with your details already filled in.
              </p>
            </div>
            <RebookSlots patient={patient} originalAppointment={rebookAppt} variant="drawer" />
          </div>
        )}
      </AppointmentDrawer>
    </AppLayout>
  );
}
