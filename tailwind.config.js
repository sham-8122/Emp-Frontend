/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
        },
        sidebar: '#0f172a',
        body: '#f1f5f9',
      },
      spacing: {
        'sidebar': '260px',
      }
    },
  },
  plugins: [],
}