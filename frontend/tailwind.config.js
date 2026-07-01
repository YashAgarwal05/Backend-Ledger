/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#08111f',
          950: '#030712',
        },
        gold: {
          300: '#f8d66d',
          400: '#f0bc2e',
          500: '#d8a917',
          600: '#bb8f11',
        },
      },

      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.15)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.2)',
        gold: '0 0 20px rgba(240,188,46,0.25)',
      },
    },
  },
  plugins: [],
}