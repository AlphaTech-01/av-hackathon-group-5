/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#060911',
          900: '#0B1120',
          850: '#10192D',
          800: '#16223B',
          700: '#1E2D4A',
          600: '#2A3C61'
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669'
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)'
      }
    },
  },
  plugins: [],
}
