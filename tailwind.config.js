/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sovDark: '#0a0a0a',
        sovBorder: '#1f1f1f',
        sovGreen: '#00ff88',
        sovRed: '#ff0033',
        sovText: '#e0e0e0',
      },
      fontFamily: {
        mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      }
    },
  },
  plugins: [],
}
