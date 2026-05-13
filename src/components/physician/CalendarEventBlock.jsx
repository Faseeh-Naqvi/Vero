/** Short label for calendar cells: "Okafor, J." so the surname stays visible in narrow slots. */
function shortPatientName(fullName) {
  if (!fullName || !fullName.trim()) return 'Patient';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].length > 14 ? `${parts[0].slice(0, 12)}…` : parts[0];
  const last = parts[parts.length - 1];
  const first = parts[0];
  const initial = first[0] ? `${first[0].toUpperCase()}.` : '';
  const label = `${last}, ${initial}`;
  return label.length > 18 ? `${last.slice(0, 14)}…` : label;
}

export default function CalendarEventBlock({ event }) {
  const r = event?.resource;
  const fullName = r?.patient?.name || event?.title || 'Appointment';
  const phys = r?.physician;
  const tooltip = phys ? `${fullName} (${phys.name})` : fullName;

  return (
    <div
      className="h-full w-full min-h-0 min-w-0 flex flex-col justify-center overflow-hidden px-0.5"
      title={tooltip}
      aria-label={tooltip}
    >
      <span className="block truncate text-[11px] font-semibold leading-[1.1] tracking-tight text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]" aria-hidden>
        {shortPatientName(fullName)}
      </span>
    </div>
  );
}
