export default function BookingStepDetails({ data, setData, patient, readOnly = false }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full name</label>
          <input
            className="input"
            type="text"
            value={data.fullName ?? patient?.name ?? ''}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            readOnly={readOnly}
          />
          <p className="hint">From your saved profile</p>
        </div>
        <div>
          <label className="label">Date of birth</label>
          <input
            className="input"
            type="date"
            value={data.dob ?? patient?.dob ?? ''}
            onChange={(e) => setData({ ...data, dob: e.target.value })}
            readOnly={readOnly}
          />
          <p className="hint">From your saved profile</p>
        </div>
        <div>
          <label className="label">Phone number</label>
          <input
            className="input"
            type="tel"
            value={data.phone ?? patient?.phone ?? ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            readOnly={readOnly}
          />
          <p className="hint">From your saved profile</p>
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={data.email ?? patient?.email ?? ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            readOnly={readOnly}
          />
          <p className="hint">From your saved profile</p>
        </div>
      </div>

      <div>
        <label className="label">Reason for visit *</label>
        <textarea
          className="textarea"
          value={data.reason || ''}
          placeholder="e.g. Annual checkup, follow-up on lab results, persistent cough…"
          onChange={(e) => setData({ ...data, reason: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Additional notes (optional)</label>
        <textarea
          className="textarea"
          value={data.notes || ''}
          placeholder="Anything else you'd like your physician to know."
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </div>
    </div>
  );
}
