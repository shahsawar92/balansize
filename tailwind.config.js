/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        dark: '#222222',
        main: {
          black: 'var(--tw-color-main-black)',
          blackHover: 'var(--tw-color-main-black-hover)',
          brown: 'var(--tw-color-main-brown)',
          brownHover: 'var(--tw-color-main-brown-hover)',
          white: 'var(--tw-color-main-white)',
          whiteHover: 'var(--tw-color-main-white-hover)',
          light: 'var(--tw-color-main-light)',
          lightHover: 'var(--tw-color-main-light-hover)',
        },
        secondary: {
          100: 'var(--tw-color-secondary-100)',
          300: 'var(--tw-color-secondary-300)',
          500: 'var(--tw-color-secondary-500)',
        },
        text: {
          main: 'var(--tw-color-text-main)',
          2: 'var(--tw-color-text-2)',
          3: 'var(--tw-color-text-3)',
          white: 'var(--tw-color-text-white)',
        },

      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [],
};
