/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f4fd',
          100: '#c5e3f9',
          200: '#9dcff5',
          300: '#6db8f0',
          400: '#3fa4ec',
          500: '#1a8fe8',
          600: '#1472bd',
          700: '#0f5591',
          800: '#0a3a66',
          900: '#051e3b',
        },
        teal: {
          400: '#2ec4b6',
          500: '#20a99d',
          600: '#148f7a',
        },
        ocean: '#0a3a66',
        wave:  '#1a8fe8',
        foam:  '#e8f4fd',
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}