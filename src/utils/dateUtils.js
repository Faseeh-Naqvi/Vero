import { format, parse, parseISO, isSameDay, addMinutes } from 'date-fns';

export function toDateObj(date, time = '00:00') {
  return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function fmtDateLong(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'EEEE, MMM d, yyyy');
}

export function fmtDateMed(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy');
}

export function fmtDateShort(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d');
}

export function fmtDay(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'EEEE');
}

export function fmtTime12(timeStr) {
  if (!timeStr) return '';
  const d = parse(timeStr, 'HH:mm', new Date());
  return format(d, 'h:mm a');
}

export function fmtRelative(iso) {
  if (!iso) return '';
  const date = typeof iso === 'string' ? parseISO(iso) : iso;
  const now = new Date();
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDateMed(date);
}

export function addMinutesToTime(time, minutes) {
  const d = parse(time, 'HH:mm', new Date());
  return format(addMinutes(d, minutes), 'HH:mm');
}

export function isToday(dateStr) {
  return isSameDay(parseISO(dateStr), new Date());
}

export function isoDate(d = new Date()) {
  return format(d, 'yyyy-MM-dd');
}
