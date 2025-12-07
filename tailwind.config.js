/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './components/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
    './index.tsx',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        zinc: {
          800: '#333333',
          850: '#2a2a2a',
          900: '#222222',
          950: '#111111',
        },
        brand: {
          950: '#1a1a1a',
          900: '#222222',
          800: '#312e81',
          600: '#4f46e5',
          500: '#6366f1',
          400: '#818cf8',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [],
};
