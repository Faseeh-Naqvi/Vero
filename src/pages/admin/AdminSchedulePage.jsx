import AppLayout from '../../components/shared/AppLayout';
import { adminNavItems } from '../../components/admin/AdminNav';
import PhysicianSchedule from '../../components/physician/PhysicianSchedule';
import { useApp } from '../../context/AppContext';

export default function AdminSchedulePage() {
  const { physicians } = useApp();
  return (
    <AppLayout
      navItems={adminNavItems}
      title="Clinic Schedule"
      subtitle="Multi-physician view. Filter by physician to focus."
    >
      <PhysicianSchedule
        physicianIds={physicians.map((p) => p.id)}
        multiColor
        showFilter
        asAdmin
      />
    </AppLayout>
  );
}
