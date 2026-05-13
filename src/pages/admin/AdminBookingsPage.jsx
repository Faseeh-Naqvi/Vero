import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import AppLayout from '../../components/shared/AppLayout';
import { adminNavItems } from '../../components/admin/AdminNav';
import { useApp } from '../../context/AppContext';
import { fmtDateMed, fmtTime12, toDateObj } from '../../utils/dateUtils';
import StatusBadge from '../../components/shared/StatusBadge';
import Avatar from '../../components/shared/Avatar';
import AppointmentDrawer from '../../components/shared/AppointmentDrawer';
import PhysicianApptDetailBody from '../../components/physician/PhysicianApptDetailBody';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'completed', label: 'Completed' },
];

export default function AdminBookingsPage() {
  const { appointments, patients, physicians } = useApp();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [drawerAppt, setDrawerAppt] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments
      .filter((a) => (filter === 'all' ? true : a.status === filter))
      .filter((a) => {
        if (!q) return true;
        const patient = patients.find((p) => p.id === a.patientId);
        const phys = physicians.find((p) => p.id === a.physicianId);
        return (
          patient?.name.toLowerCase().includes(q) ||
          phys?.name.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => toDateObj(b.date, b.startTime) - toDateObj(a.date, a.startTime));
  }, [appointments, patients, physicians, filter, query]);

  return (
    <AppLayout
      navItems={adminNavItems}
      title="All Bookings"
      subtitle="Every appointment across the clinic."
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
          <input
            className="input pl-9 h-9"
            type="search"
            placeholder="Search patient, physician, or reason…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${filter === f.id ? 'chip-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-page border-b border-line">
            <tr>
              <th className="table-head-cell">Patient</th>
              <th className="table-head-cell">Physician</th>
              <th className="table-head-cell">Date</th>
              <th className="table-head-cell">Time</th>
              <th className="table-head-cell">Reason</th>
              <th className="table-head-cell">Booked by</th>
              <th className="table-head-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-secondary">
                  No appointments match your filters.
                </td>
              </tr>
            ) : (
              rows.map((a) => {
                const patient = patients.find((p) => p.id === a.patientId);
                const phys = physicians.find((p) => p.id === a.physicianId);
                return (
                  <tr
                    key={a.id}
                    className="table-row cursor-pointer"
                    onClick={() => setDrawerAppt(a)}
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={patient?.avatar} size={28} />
                        <div className="font-medium">{patient?.name}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phys?.color }} />
                        {phys?.name}
                      </div>
                    </td>
                    <td className="table-cell">{fmtDateMed(a.date)}</td>
                    <td className="table-cell">{fmtTime12(a.startTime)}</td>
                    <td className="table-cell max-w-[220px] truncate" title={a.reason}>{a.reason}</td>
                    <td className="table-cell capitalize text-ink-secondary">{a.bookedBy}</td>
                    <td className="table-cell">
                      <StatusBadge status={a.feeOwed && a.status === 'cancelled' ? 'fee_owed' : a.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AppointmentDrawer
        open={!!drawerAppt}
        onClose={() => setDrawerAppt(null)}
        title="Appointment details"
      >
        <PhysicianApptDetailBody appointment={drawerAppt} />
      </AppointmentDrawer>
    </AppLayout>
  );
}
