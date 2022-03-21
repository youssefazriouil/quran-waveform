const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          100: '#F8F5F1',
          200: '#F1EBE4',
          300: '#ECE5DA',
        },
        ocean: '#07162B',
        darkGray: '#595959',
      },
      fontFamily: {
        sans: ['Noto Sans', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
