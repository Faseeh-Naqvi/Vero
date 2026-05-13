/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#3B82C4',
          hover: '#2D6FAD',
          tint: '#EAF2FA',
        },
        ink: {
          primary: '#111827',
          secondary: '#6B7280',
        },
        line: '#E5E7EB',
        surface: {
          page: '#F7F8FA',
          card: '#FFFFFF',
          hover: '#F9FAFB',
        },
        status: {
          red: '#DC2626',
          green: '#16A34A',
          amber: '#D97706',
          grey: '#9CA3AF',
        },
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        chip: '4px',
      },
      fontSize: {
        xs: ['11px', '16px'],
        sm: ['12px', '16px'],
        base: ['14px', '20px'],
        md: ['15px', '22px'],
        lg: ['16px', '24px'],
        xl: ['18px', '26px'],
        '2xl': ['20px', '28px'],
        '3xl': ['24px', '32px'],
      },
      boxShadow: {
        drawer: '-8px 0 24px -8px rgba(17, 24, 39, 0.12)',
        card: '0 1px 2px 0 rgba(17, 24, 39, 0.04)',
        pop: '0 8px 24px -4px rgba(17, 24, 39, 0.12)',
      },
    },
  },
  plugins: [],
};
