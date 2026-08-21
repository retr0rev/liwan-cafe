import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: '#0f2e26', light: '#1a4338', muted: '#143a2f' },
        gold: { DEFAULT: '#c9a86a', light: '#ddc08a', muted: '#b89a5a' },
        cream: { DEFAULT: '#fdf8ef', dark: '#f5ecd7', muted: '#faf3e9' },
        ink: { DEFAULT: '#2b1e14', light: '#6b5a45' },
        green: { DEFAULT: '#0f2e26', light: '#1a4338' },
        chocolate: { DEFAULT: '#2b1e14', light: '#6b5a45' },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Amiri', 'serif'],
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
