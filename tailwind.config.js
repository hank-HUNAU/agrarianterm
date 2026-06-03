/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: { DEFAULT: '#1a1a2e', light: '#252542', lighter: '#2f2f52' },
        bronze: { DEFAULT: '#c9a96e', light: '#d4b87e', dark: '#a88a50' },
        bamboo: { DEFAULT: '#4a7c59', light: '#5a9469' },
        paper: { DEFAULT: '#f5f0e8', dark: '#e8e0d0' },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
