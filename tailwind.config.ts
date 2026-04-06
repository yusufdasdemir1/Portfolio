import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617'
        },
        brand: {
          500: '#6366f1',
          400: '#818cf8'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,.4), 0 10px 40px -15px rgba(99,102,241,.5)'
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.07) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

export default config;
