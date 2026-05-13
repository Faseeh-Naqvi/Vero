import { fmtTime12 } from '../../utils/dateUtils';

export default function SlotPicker({ slots = [], selected, onSelect, emptyMessage = 'No slots available.' }) {
  if (!slots.length) {
    return (
      <div className="text-sm text-ink-secondary border border-dashed border-line rounded-card p-6 text-center">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
      {slots.map((slot) => {
        const isSelected = selected === slot.startTime;
        return (
          <button
            type="button"
            key={slot.startTime}
            disabled={!slot.available}
            onClick={() => onSelect?.(slot)}
            className={`w-full flex items-center justify-between h-10 px-4 rounded-btn border text-sm font-medium transition ${
              !slot.available
                ? 'bg-surface-page border-line text-ink-secondary cursor-not-allowed'
                : isSelected
                ? 'bg-brand text-white border-brand'
                : 'bg-white border-line text-ink-primary hover:border-brand hover:bg-brand-tint'
            }`}
          >
            <span>{fmtTime12(slot.startTime)}</span>
            <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-ink-secondary'}`}>
              {!slot.available ? 'Unavailable' : '30 min'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
