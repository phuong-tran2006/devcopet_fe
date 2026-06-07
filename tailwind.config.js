module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#a855f7',
      },
      borderRadius: {
        'card': '20px',
      }
    },
  },
  plugins: [],
}