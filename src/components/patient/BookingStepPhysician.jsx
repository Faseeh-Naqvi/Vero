import { Check, Stethoscope } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';

export default function BookingStepPhysician({ data, setData, patient, allowPatientPick = false, allPatients = [] }) {
  const { physicians } = useApp();

  return (
    <div className="space-y-6">
      {allowPatientPick && (
        <div>
          <label className="label">Patient</label>
          <select
            className="input"
            value={data.patientId || ''}
            onChange={(e) => setData({ ...data, patientId: e.target.value })}
          >
            <option value="">Select a patient</option>
            {allPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.email}
              </option>
            ))}
          </select>
          <p className="hint">Booking on behalf of this patient.</p>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3 text-ink-primary">
          <Stethoscope size={16} className="text-brand" />
          <h3 className="text-base font-semibold">Choose your physician</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {physicians.map((p) => {
            const isUsual = patient?.defaultPhysicianId === p.id;
            const isSelected = data.physicianId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setData({ ...data, physicianId: p.id })}
                className={`relative rounded-card border bg-white p-4 text-left transition ${
                  isSelected ? 'border-brand ring-2 ring-brand/20 bg-brand-tint' : 'border-line hover:border-brand'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <Avatar initials={p.avatar} size={48} color={p.color} />
                <div className="text-sm font-semibold text-ink-primary mt-3">{p.name}</div>
                <div className="text-xs text-ink-secondary">{p.specialty}</div>
                {isUsual && (
                  <span className="inline-block mt-2 text-xs px-1.5 py-0.5 rounded-chip bg-brand-tint text-brand font-medium">
                    Your usual doctor
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
