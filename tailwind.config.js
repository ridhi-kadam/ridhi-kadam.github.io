/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241610',
        parchment: '#efe0bd',
        amber: '#d79b52',
        oxblood: '#6f2f2c',
        forest: '#314c3d',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 18px 26px rgba(19, 8, 5, 0.4)',
        'warm': '0 0 80px rgba(222, 155, 76, 0.17)',
      },
    },
  },
  plugins: [],
}
