/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#B8E0FF',
          pink: '#FFE5F1',
          yellow: '#FFF9C4',
          green: '#C8E6C9',
          purple: '#E1BEE7',
          orange: '#FFE0B2',
          red: '#FFCDD2',
          gray: '#F5F5F5',
          beige: '#FFF8E1',
          lavender: '#EDE7F6',
          mint: '#E0F2F1',
          peach: '#FCE4EC',
          sky: '#B3E5FC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      })
    }
  ],
}