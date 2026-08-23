/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        drake: {
          bg: '#050505',
          card: '#0d0d0d',
          surface: '#141414',
          border: '#262626',
          green: '#28e98c',
          emerald: '#10b981',
          text: '#999999',
        },
        hc: {
          bg: '#000000',
          card: '#080808',
          text: '#FFFFFF',
          accent: '#FFFF00',
          border: '#FFFF00',
          highlight: '#00FFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        dyslexic: ['OpenDyslexic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
