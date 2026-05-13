import AppLayout from '../../components/shared/AppLayout';
import { physicianNavItems } from '../../components/physician/PhysicianNav';
import PhysicianSchedule from '../../components/physician/PhysicianSchedule';
import { useApp } from '../../context/AppContext';

export default function PhysicianSchedulePage() {
  const { currentUser } = useApp();
  return (
    <AppLayout
      navItems={physicianNavItems}
      title="My Schedule"
      subtitle="Drag blocks to reschedule, resize to adjust duration."
    >
      <PhysicianSchedule physicianIds={[currentUser.linkedId]} multiColor={false} />
    </AppLayout>
  );
}
