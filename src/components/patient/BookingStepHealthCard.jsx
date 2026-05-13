import { Info } from 'lucide-react';
import HealthCardUpload from '../shared/HealthCardUpload';

export default function BookingStepHealthCard({ patient }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 bg-brand-tint border border-brand/15 rounded-card px-4 py-3">
        <Info size={16} className="text-brand shrink-0 mt-0.5" />
        <div className="text-sm text-ink-primary">
          <div className="font-medium">Upload your health card</div>
          <p className="text-ink-secondary mt-0.5">
            We&apos;ll use OCR to fill in your details automatically. Upload is optional; you can still continue without it.
          </p>
        </div>
      </div>
      <HealthCardUpload healthCardNumber={patient?.healthCardNumber} />
    </div>
  );
}
