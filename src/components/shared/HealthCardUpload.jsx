import { useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Check, Lock } from 'lucide-react';

function UploadZone({ label, healthCardNumber, side }) {
  const [state, setState] = useState('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => setState('done'), 1500);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state !== 'idle'}
        className={`w-full aspect-[5/3] rounded-card border-2 border-dashed transition flex flex-col items-center justify-center text-center px-4 ${
          state === 'done'
            ? 'border-status-green bg-green-50'
            : 'border-line bg-surface-page hover:border-brand hover:bg-brand-tint'
        }`}
      >
        {state === 'idle' && (
          <>
            <div className="flex items-center gap-2 mb-2 text-ink-secondary">
              <Camera size={22} />
              <ImageIcon size={22} />
            </div>
            <div className="text-sm font-medium text-ink-primary">{label}</div>
            <div className="text-xs text-ink-secondary mt-1">Upload or take photo</div>
          </>
        )}
        {state === 'loading' && (
          <>
            <Loader2 size={22} className="text-brand animate-spin mb-2" />
            <div className="text-sm font-medium text-ink-primary">Analyzing card…</div>
            <div className="text-xs text-ink-secondary mt-1">Reading health card details</div>
          </>
        )}
        {state === 'done' && (
          <>
            <div className="w-9 h-9 rounded-full bg-status-green/15 flex items-center justify-center text-status-green mb-2">
              <Check size={18} strokeWidth={3} />
            </div>
            <div className="text-sm font-medium text-ink-primary">{side} captured</div>
            <div className="text-xs font-mono text-ink-secondary mt-1 tracking-wide flex items-center gap-1">
              <Lock size={11} /> {healthCardNumber}
            </div>
          </>
        )}
      </button>
      {state === 'done' && (
        <p className="text-xs text-status-green mt-2 flex items-center gap-1">
          <Check size={12} strokeWidth={3} /> Health card number saved to your patient profile
        </p>
      )}
    </div>
  );
}

export default function HealthCardUpload({ healthCardNumber }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UploadZone label="Front of Card" side="Front" healthCardNumber={healthCardNumber} />
      <UploadZone label="Back of Card" side="Back" healthCardNumber={healthCardNumber} />
    </div>
  );
}
