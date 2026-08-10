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
        background: {
          light: '#ffffff',
          dark: '#09090b',
        },
        surface: {
          light: '#fafafa',
          dark: '#111113',
          elevatedLight: '#ffffff',
          elevatedDark: '#18181b',
        },
        border: {
          subtleLight: '#e4e4e7',
          subtleDark: '#27272a',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Inter', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
