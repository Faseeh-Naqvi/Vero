import { LayoutDashboard, CalendarDays, ListChecks, CalendarPlus } from 'lucide-react';

export const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/admin/bookings', label: 'All Bookings', icon: ListChecks },
  { to: '/admin/book', label: 'Book for Patient', icon: CalendarPlus },
];
