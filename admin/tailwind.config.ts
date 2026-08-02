import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#1a3c34', light: '#2d5a4e' },
        chocolate: { DEFAULT: '#3d2b1f', light: '#5a4231' },
        cream: { DEFAULT: '#f5e6d3', light: '#faf3e9' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
