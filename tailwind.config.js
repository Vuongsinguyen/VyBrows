/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface': 'var(--color-surface)',
        'surface-1': 'var(--color-surface-1)',
        'surface-2': 'var(--color-surface-2)',
        'on-surface': 'var(--color-on-surface)',
        'primary': 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-bg': 'var(--color-primary-bg)',
        'primary-ring': 'var(--color-primary-ring)',
        'on-primary': 'var(--color-on-primary)',
        'on-primary-hover': 'var(--color-on-primary-hover)',
        'border': 'var(--color-border)',
        'button-secondary-text': 'var(--color-button-secondary-text)',
        'error': 'var(--color-error)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'info': 'var(--color-info)',
        // ...bổ sung các biến khác nếu color.css có thêm...
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        tartuffo: ['Tartuffo', 'serif'],
      },
    }
  },
  plugins: [],
}