/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'status-success': '#4CAF50',
        'status-error': '#F44336',
      },
      backgroundColor: {
        'app-dark': '#1a1a1a',
        'panel-dark': '#242424',
        'selected-dark': '#2a2a2a',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
