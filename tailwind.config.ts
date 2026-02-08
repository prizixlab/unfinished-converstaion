import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F14',
        surface: '#111827',
        'surface-2': '#0F172A',
        border: '#223041',
        text: '#E5E7EB',
        muted: '#9CA3AF',
        accent: '#D6B25E',
        'accent-hover': '#E2C878',
        'accent-text': '#0B0F14'
      },
      boxShadow: {
        glow: '0 0 18px rgba(214,178,94,0.35), 0 0 36px rgba(214,178,94,0.15)',
        'glow-soft': '0 0 12px rgba(214,178,94,0.22)'
      }
    }
  },
  plugins: []
};

export default config;
