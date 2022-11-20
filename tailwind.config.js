/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bouncing: {
          '0%, 100%': { transform: 'translateX(0.0rem)' },
          '25%': { transform: 'translateX(0.15rem)' },
          '50%': { transform: 'translateX(-0.15rem)'},
          '75%': { transform: 'translateX(0.15rem)' },
        }
      },
      animation: {
        bouncing: 'bouncing 0.25s 1'
      }
    },
  },
  plugins: [],
}
