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
        'stokes-blue': '#2596be',
        'stokes-teal': '#2ba497',
        'stokes-yellow': '#FDFCDC',
        'stokes-orange': '#e8947b',
        'stokes-red': '#F07167',
        'stokes-dark-blue': '#0e6484',
        'stokes-light-gray': '#f0f0f0',
        'stokes-dark-gray': '#b3b3b3',
      },
    },
  },
  plugins: [],
};
