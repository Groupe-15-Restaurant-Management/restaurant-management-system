export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8751A',
          light: '#F4A261',
          dark: '#C95A12',
        },
        admin: '#6B46C1',
        success: '#2A9D8F',
        danger: '#E76F51',
        warning: '#FBBF24',
      },
      backgroundColor: {
        'dark-main': '#1a1a2e',
        'dark-card': '#16213e',
        'dark-surface': '#1e293b',
      }
    },
  },
  plugins: [],
}