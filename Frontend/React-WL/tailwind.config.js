/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom': 'rgb(0,59,149)',
      },
      fontFamily: {      
        sans: ['Roboto', 'sans-serif'],
      },
        gridTemplateColumns: {
        '70/30': '70% 28%',
        },
    },
  },
  plugins: [],
}