import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, parseISO, differenceInMinutes } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { useApp } from '../../context/AppContext';
import { toDateObj, fmtTime12, isoDate } from '../../utils/dateUtils';
import AppointmentDrawer from '../shared/AppointmentDrawer';
import PhysicianApptDetailBody from './PhysicianApptDetailBody';
import ConfirmModal from '../shared/ConfirmModal';
import CalendarEventBlock from './CalendarEventBlock';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop(Calendar);

function buildEvents(appointments, patients, physicians, filterPhysicianIds) {
  return appointments
    .filter((a) => filterPhysicianIds.includes(a.physicianId))
    .map((a) => {
      const start = toDateObj(a.date, a.startTime);
      const end = toDateObj(a.date, a.endTime);
      const patient = patients.find((p) => p.id === a.patientId);
      const phys = physicians.find((p) => p.id === a.physicianId);
      return {
        id: a.id,
        title: patient?.name || 'Appointment',
        start,
        end,
        resource: { ...a, patient, physician: phys },
      };
    });
}

export default function PhysicianSchedule({
  physicianIds,
  multiColor = false,
  showFilter = false,
  asAdmin = false,
}) {
  const {
    appointments,
    patients,
    physicians,
    updateAppointment,
    addNotification,
    showToast,
  } = useApp();

  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [drawerAppt, setDrawerAppt] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [filterIds, setFilterIds] = useState(physicianIds);

  const activeIds = showFilter ? filterIds : physicianIds;

  const events = useMemo(
    () => buildEvents(appointments, patients, physicians, activeIds),
    [appointments, patients, physicians, activeIds]
  );

  const eventStyleGetter = (event) => {
    const status = event.resource.status;
    const phys = event.resource.physician;
    let bg = '#3B82C4';
    let opacity = 1;
    if (multiColor) bg = phys?.color || bg;
    if (status === 'pending') bg = multiColor ? phys?.color || bg : '#D97706';
    if (status === 'cancelled') {
      bg = '#9CA3AF';
      opacity = 0.4;
    }
    if (status === 'completed') bg = '#6366F1';
    return {
      style: {
        backgroundColor: bg,
        color: '#fff',
        opacity,
        border: 'none',
        borderRadius: 6,
        padding: '1px 4px',
        minHeight: 0,
        overflow: 'hidden',
      },
    };
  };

  const handleSelectEvent = (event) => setDrawerAppt(event.resource);

  const handleEventChange = ({ event, start, end }) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm');
    const date = isoDate(start);
    // Prevent overlap with another confirmed/pending appointment for the same physician
    const overlap = appointments.find(
      (a) =>
        a.id !== event.resource.id &&
        a.physicianId === event.resource.physicianId &&
        a.date === date &&
        a.status !== 'cancelled' &&
        a.status !== 'completed' &&
        toDateObj(a.date, a.startTime) < end &&
        toDateObj(a.date, a.endTime) > start
    );
    if (overlap) {
      showToast('Slot overlaps an existing appointment.', 'error');
      return;
    }
    updateAppointment(event.resource.id, { date, startTime, endTime });
    showToast('Schedule updated.');
  };

  const handleCancel = (appt, by) => {
    const cancelledBy = by || (asAdmin ? 'admin' : 'physician');
    updateAppointment(appt.id, { status: 'cancelled', cancelledBy, feeOwed: false });
    const type = cancelledBy === 'admin' ? 'appointment_cancelled_by_admin' : 'appointment_cancelled_by_physician';
    const phys = physicians.find((p) => p.id === appt.physicianId);
    addNotification({
      userId: appt.patientId,
      type,
      message: `${cancelledBy === 'admin' ? 'The clinic' : phys?.name} has cancelled your ${appt.date} appointment. Please rebook.`,
      appointmentId: appt.id,
    });
    setConfirmCancel(null);
    setDrawerAppt(null);
    showToast('Appointment cancelled. Patient notified to rebook.');
  };

  const confirmAppointment = (appt) => {
    updateAppointment(appt.id, { status: 'confirmed' });
    const phys = physicians.find((p) => p.id === appt.physicianId);
    addNotification({
      userId: appt.patientId,
      type: 'appointment_confirmed',
      message: `Your appointment with ${phys?.name} on ${appt.date} has been confirmed.`,
      appointmentId: appt.id,
    });
    setDrawerAppt(null);
    showToast('Appointment confirmed.');
  };

  const markComplete = (appt) => {
    updateAppointment(appt.id, { status: 'completed' });
    setDrawerAppt(null);
    showToast('Appointment marked complete.');
  };

  // Compute working-hour bounds (earliest start to latest end across selected physicians)
  const bounds = useMemo(() => {
    const list = physicians.filter((p) => activeIds.includes(p.id));
    if (list.length === 0) return { min: 7, max: 19 };
    const starts = list.map((p) => parseInt(p.workdayStart.split(':')[0], 10));
    const ends = list.map((p) => parseInt(p.workdayEnd.split(':')[0], 10) + 1);
    return { min: Math.min(...starts), max: Math.max(...ends) };
  }, [physicians, activeIds]);

  return (
    <div>
      {showFilter && (
        <div className="card p-3 mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`chip ${filterIds.length === physicians.length ? 'chip-active' : ''}`}
            onClick={() => setFilterIds(physicians.map((p) => p.id))}
          >
            All Physicians
          </button>
          {physicians.map((p) => {
            const active = filterIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                className={`chip ${active ? 'chip-active' : ''}`}
                onClick={() =>
                  setFilterIds((prev) =>
                    prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                  )
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="card p-3 h-[calc(100vh-220px)] min-h-[560px]">
        <DnDCalendar
          localizer={localizer}
          events={events}
          components={{ event: CalendarEventBlock }}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          views={['week', 'day']}
          date={date}
          onNavigate={setDate}
          step={30}
          timeslots={2}
          min={new Date(2020, 0, 1, bounds.min, 0)}
          max={new Date(2020, 0, 1, bounds.max, 0)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventChange}
          onEventResize={handleEventChange}
          resizable
          draggableAccessor={(event) =>
            event.resource.status !== 'cancelled' && event.resource.status !== 'completed'
          }
        />
      </div>

      <AppointmentDrawer
        open={!!drawerAppt}
        onClose={() => setDrawerAppt(null)}
        title="Appointment details"
        footer={
          drawerAppt ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {drawerAppt.status === 'pending' && (
                <button
                  type="button"
                  className="btn-success btn-compact"
                  onClick={() => confirmAppointment(drawerAppt)}
                >
                  Confirm
                </button>
              )}
              {(drawerAppt.status === 'confirmed' || drawerAppt.status === 'pending') && (
                <>
                  <button
                    type="button"
                    className="btn-secondary text-status-red hover:bg-red-50"
                    onClick={() => setConfirmCancel(drawerAppt)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => markComplete(drawerAppt)}
                  >
                    Mark Complete
                  </button>
                </>
              )}
            </div>
          ) : null
        }
      >
        <PhysicianApptDetailBody appointment={drawerAppt} />
        {drawerAppt && (
          <div className="mt-6 text-xs text-ink-secondary flex items-center gap-1.5">
            Duration:{' '}
            <span className="text-ink-primary font-medium">
              {differenceInMinutes(toDateObj(drawerAppt.date, drawerAppt.endTime), toDateObj(drawerAppt.date, drawerAppt.startTime))}{' '}
              min
            </span>
            <span className="mx-1.5 text-ink-secondary/50">·</span>
            <span>{fmtTime12(drawerAppt.startTime)} to {fmtTime12(drawerAppt.endTime)}</span>
          </div>
        )}
      </AppointmentDrawer>

      <ConfirmModal
        open={!!confirmCancel}
        title="Cancel this appointment?"
        message="The patient will be notified and asked to rebook."
        confirmLabel="Cancel Appointment"
        cancelLabel="Keep Appointment"
        confirmVariant="danger"
        onConfirm={() => handleCancel(confirmCancel)}
        onCancel={() => setConfirmCancel(null)}
      />
    </div>
  );
}
