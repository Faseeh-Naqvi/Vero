import { DollarSign } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { useApp } from '../../context/AppContext';
import { fmtDateMed, fmtTime12 } from '../../utils/dateUtils';

export default function FeeOwedList({ appointments }) {
  const { patients, physicians } = useApp();
  const fees = appointments.filter((a) => a.feeOwed && a.status === 'cancelled');

  if (fees.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-ink-secondary">
        No outstanding fees. All clear.
      </div>
    );
  }

  const totalOwed = fees.length * 50;

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2 text-status-red font-medium text-sm">
          <DollarSign size={14} /> Fees to collect
        </div>
        <div className="text-sm text-status-red font-semibold">${totalOwed}</div>
      </div>
      <table className="w-full">
        <thead className="border-b border-line">
          <tr>
            <th className="table-head-cell">Patient</th>
            <th className="table-head-cell">Cancelled visit</th>
            <th className="table-head-cell">Physician</th>
            <th className="table-head-cell text-right">Fee</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((a) => {
            const patient = patients.find((p) => p.id === a.patientId);
            const phys = physicians.find((p) => p.id === a.physicianId);
            return (
              <tr key={a.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={patient?.avatar} size={28} />
                    <div>
                      <div className="font-medium">{patient?.name}</div>
                      <div className="text-xs text-ink-secondary">{patient?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  {fmtDateMed(a.date)} · {fmtTime12(a.startTime)}
                </td>
                <td className="table-cell">{phys?.name}</td>
                <td className="table-cell text-right font-semibold text-status-red">$50</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
