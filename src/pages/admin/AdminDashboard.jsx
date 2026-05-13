import { useMemo } from 'react';
import { Calendar, BellRing, XCircle, DollarSign } from 'lucide-react';
import AppLayout from '../../components/shared/AppLayout';
import { adminNavItems } from '../../components/admin/AdminNav';
import { useApp } from '../../context/AppContext';
import { isToday, toDateObj } from '../../utils/dateUtils';
import { differenceInDays } from 'date-fns';
import StatCard from '../../components/shared/StatCard';
import PendingQueue from '../../components/physician/PendingQueue';
import FeeOwedList from '../../components/admin/FeeOwedList';
import AdminAnalyticsChart from '../../components/admin/AdminAnalyticsChart';

export default function AdminDashboard() {
  const { appointments } = useApp();

  const stats = useMemo(() => {
    const today = appointments.filter((a) => isToday(a.date) && a.status !== 'cancelled').length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const now = new Date();
    const cancelledThisWeek = appointments.filter((a) => {
      if (a.status !== 'cancelled') return false;
      const d = toDateObj(a.date, a.startTime);
      const diff = differenceInDays(now, d);
      return Math.abs(diff) <= 7;
    }).length;
    const feeOwed = appointments.filter((a) => a.feeOwed && a.status === 'cancelled').length;
    return { today, pending, cancelledThisWeek, feeOwed };
  }, [appointments]);

  const pending = useMemo(
    () => appointments.filter((a) => a.status === 'pending').sort((a, b) => toDateObj(a.date, a.startTime) - toDateObj(b.date, b.startTime)),
    [appointments]
  );

  return (
    <AppLayout
      navItems={adminNavItems}
      title="Clinic Overview"
      subtitle="Approvals, cancellations, and outstanding fees at a glance."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Today's appointments" value={stats.today} icon={Calendar} accent="brand" />
        <StatCard
          label="Pending approvals"
          value={stats.pending}
          icon={BellRing}
          accent={stats.pending > 0 ? 'amber' : 'default'}
        />
        <StatCard label="Cancellations this week" value={stats.cancelledThisWeek} icon={XCircle} />
        <StatCard
          label="Fees owed"
          value={stats.feeOwed}
          icon={DollarSign}
          accent={stats.feeOwed > 0 ? 'red' : 'default'}
          hint={stats.feeOwed > 0 ? `$${stats.feeOwed * 50} outstanding` : null}
        />
      </div>

      <section className="mb-8">
        <AdminAnalyticsChart />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Pending approvals (all physicians)</h2>
        <PendingQueue pending={pending} showPhysicianColumn />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Fees to collect</h2>
        <FeeOwedList appointments={appointments} />
      </section>
    </AppLayout>
  );
}
