import type { Config } from 'tailwindcss';

// Держать в синхроне с @theme в src/styles/globals.css вручную — Tailwind
// v4 берёт РЕАЛЬНЫЕ значения токенов оттуда (CSS-first), этот файл нужен
// только для shadcn CLI (см. components.json → tailwind.config) и
// инструментов, ожидающих JS/TS-конфиг (ADR-0002). Расхождение здесь не
// повлияет на рантайм-стили, но введёт в заблуждение shadcn CLI/tooling.
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#0F172A',
        },
        background: '#F8FAFC',
        foreground: '#0F172A',
        surface: '#FFFFFF',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#6366F1',
      },
      fontFamily: {
        sans: ['Space Grotesk Variable', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
} satisfies Config;
