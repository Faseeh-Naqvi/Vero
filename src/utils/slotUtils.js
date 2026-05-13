import { parse, addMinutes, format, addDays, isBefore, parseISO } from 'date-fns';
import { isoDate } from './dateUtils';

const SLOT_MINUTES = 30;

export function generateDaySlots(physician, dateStr, appointments) {
  if (!physician || !dateStr) return [];
  const start = parse(physician.workdayStart, 'HH:mm', new Date());
  const end = parse(physician.workdayEnd, 'HH:mm', new Date());

  const booked = new Set(
    appointments
      .filter(
        (a) =>
          a.physicianId === physician.id &&
          a.date === dateStr &&
          (a.status === 'pending' || a.status === 'confirmed')
      )
      .map((a) => a.startTime)
  );

  const slots = [];
  let cursor = start;
  while (isBefore(cursor, end)) {
    const startTime = format(cursor, 'HH:mm');
    const next = addMinutes(cursor, SLOT_MINUTES);
    if (isBefore(end, next) && format(next, 'HH:mm') !== format(end, 'HH:mm')) break;
    const endTime = format(next, 'HH:mm');
    slots.push({
      startTime,
      endTime,
      available: !booked.has(startTime),
    });
    cursor = next;
  }
  return slots;
}

export function isWithin48Hours(appointmentDate, startTime) {
  const apptDateTime = new Date(`${appointmentDate}T${startTime}`);
  const now = new Date();
  const diffMs = apptDateTime - now;
  return diffMs > 0 && diffMs < 48 * 60 * 60 * 1000;
}

export function getNextAvailableSlots(physician, appointments, count = 3) {
  if (!physician) return [];
  const today = new Date();
  const results = [];
  for (let dayOffset = 0; dayOffset < 14 && results.length < count; dayOffset++) {
    const date = isoDate(addDays(today, dayOffset));
    const slots = generateDaySlots(physician, date, appointments);
    for (const slot of slots) {
      if (!slot.available) continue;
      const slotDateTime = parseISO(`${date}T${slot.startTime}`);
      if (slotDateTime < today) continue;
      results.push({
        physicianId: physician.id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      if (results.length >= count) break;
    }
  }
  return results;
}
