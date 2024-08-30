/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'stokes-blue': '#0081A7',
        'stokes-teal': '#00AFB9',
        'stokes-yellow': '#FDFCDC',
        'stokes-orange': '#FED9B7',
        'stokes-red': '#F07167',
      },
    },
  },
  plugins: [],
};
