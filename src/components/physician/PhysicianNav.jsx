import { LayoutDashboard, CalendarDays } from 'lucide-react';

export const physicianNavItems = [
  { to: '/physician/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/physician/schedule', label: 'My Schedule', icon: CalendarDays },
];
