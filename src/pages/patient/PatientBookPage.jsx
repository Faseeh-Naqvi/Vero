import AppLayout from '../../components/shared/AppLayout';
import { patientNavItems } from '../../components/patient/PatientNav';
import BookingWizard from '../../components/patient/BookingWizard';
import { useApp } from '../../context/AppContext';

export default function PatientBookPage() {
  const { currentUser, patients } = useApp();
  const patient = patients.find((p) => p.id === currentUser.linkedId);

  return (
    <AppLayout
      navItems={patientNavItems}
      title="Book an appointment"
      subtitle="A few quick steps and you are all set."
    >
      <BookingWizard mode="patient" patient={patient} />
    </AppLayout>
  );
}
