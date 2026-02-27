/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        benin: {
          green: '#008751',
          yellow: '#FCD116',
          red: '#E8112D',
        },
        // Alias pratique pour la couleur primaire
        primary: {
          DEFAULT: '#008751',
          dark: '#006640',
          light: '#e6f4ee',
        },
        earth: {
          50:  '#f9f8f6',
          100: '#f2efe9',
          200: '#e6dfd3',
          300: '#d1c4b0',
          400: '#bfa586',
          500: '#a68a64',
          600: '#8c704d',
          700: '#70583e',
          800: '#5e4a36',
          900: '#4d3d2e',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'brand': '0 10px 25px rgba(0, 135, 81, 0.12)',
        'card':  '0 2px 12px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
