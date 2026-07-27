/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          600: '#52525b',
          500: '#71717a',
          400: '#a1a1aa',
          300: '#d4d4d8',
          200: '#e4e4e7',
          100: '#f4f4f5',
          50: '#fafafa',
        },
        silver: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'mono-gradient': 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
        'white-gradient': 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
        'zinc-gradient': 'linear-gradient(135deg, #27272a 0%, #09090b 100%)',
        'silver-lining': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
        'silver-border': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(148,163,184,0.3) 50%, rgba(255,255,255,0.7) 100%)',
        'silver-metallic': 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'silver-glow': '0 0 25px -3px rgba(226, 232, 240, 0.25)',
        'silver-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
