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
        'stokes-secondary': '#5e69ee',
        'stokes-accent': '#39AFEA',
        'stokes-primary': ' #F4F4FB',
        'stokes-light-gray': '#F4F4FB',
      },
    },
  },
  plugins: [],
};
