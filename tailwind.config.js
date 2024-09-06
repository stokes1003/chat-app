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
        'stokes-accent-dark': '#2993C2',
        'stokes-primary': ' #F4F4FB',
        'stokes-primary-dark': '#E0E0F0',
        'stokes-light-gray': '#F4F4FB',
      },
    },
  },
  plugins: [],
};
