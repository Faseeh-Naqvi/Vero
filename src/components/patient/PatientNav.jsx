import { LayoutDashboard, CalendarCheck, CalendarPlus } from 'lucide-react';

export const patientNavItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarCheck },
  { to: '/patient/book', label: 'Book Appointment', icon: CalendarPlus },
];
