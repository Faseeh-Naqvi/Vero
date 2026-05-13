const PALETTE = [
  '#DBEAFE-#1E40AF',
  '#FCE7F3-#9D174D',
  '#DCFCE7-#166534',
  '#FEF3C7-#92400E',
  '#E0E7FF-#3730A3',
  '#FFE4E6-#9F1239',
  '#CFFAFE-#155E75',
  '#FAE8FF-#86198F',
];

function hashCode(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export default function Avatar({ initials = '', size = 32, color, className = '' }) {
  const dim = `${size}px`;
  let bg = '#E5E7EB';
  let fg = '#374151';
  if (color) {
    bg = color;
    fg = '#fff';
  } else {
    const idx = hashCode(initials) % PALETTE.length;
    const [b, f] = PALETTE[idx].split('-');
    bg = b;
    fg = f;
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium select-none ${className}`}
      style={{
        width: dim,
        height: dim,
        backgroundColor: bg,
        color: fg,
        fontSize: Math.max(11, Math.floor(size * 0.4)),
      }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
