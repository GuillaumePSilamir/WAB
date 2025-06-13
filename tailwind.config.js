/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        popupFloat: {
          '0%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -150%) scale(1.2)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'popupFloat': 'popupFloat 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}