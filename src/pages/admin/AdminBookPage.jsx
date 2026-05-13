import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/shared/AppLayout';
import { adminNavItems } from '../../components/admin/AdminNav';
import BookingWizard from '../../components/patient/BookingWizard';

export default function AdminBookPage() {
  const navigate = useNavigate();
  return (
    <AppLayout
      navItems={adminNavItems}
      title="Book on behalf of a patient"
      subtitle="Admin-created bookings are auto-confirmed."
    >
      <BookingWizard mode="admin" onComplete={() => navigate('/admin/dashboard')} />
    </AppLayout>
  );
}
