/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,jsx}',
    './components/**/*.jsx',
    './hooks/**/*.js',
    './utils/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
