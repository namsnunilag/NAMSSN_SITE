/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:      '#106CAE',
          blueDark:  '#0B4A79',
          blueLight: '#00CCFF',
          orange:    '#FC7307',
          yellow:    '#F5B800',
          white:     '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
