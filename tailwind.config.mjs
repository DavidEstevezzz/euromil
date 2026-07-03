/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        crema:     '#F7F1E6',
        terracota: '#C1683D',
        salvia:    '#6E7A4F',
        ocre:      '#D9A441',
        carbon:    '#3A2E26',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '58% 42% 55% 45% / 48% 55% 45% 52%',
      },
    },
  },
  plugins: [],
};