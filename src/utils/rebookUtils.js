/** Marks physician/admin cancellation notices read once the patient has submitted a replacement request. */
export function dismissCancellationNoticeForAppointment(cancelledApptId, notifications, markNotificationRead) {
  if (!cancelledApptId) return;
  notifications
    .filter(
      (n) =>
        !n.read &&
        (n.type === 'appointment_cancelled_by_physician' || n.type === 'appointment_cancelled_by_admin') &&
        n.appointmentId === cancelledApptId
    )
    .forEach((n) => markNotificationRead(n.id));
}
