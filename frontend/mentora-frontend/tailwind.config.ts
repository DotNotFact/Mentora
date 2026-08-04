import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        accent: '#F59E0B',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#64748B',
        destructive: '#EF4444',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
} satisfies Config;
