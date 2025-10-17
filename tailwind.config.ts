// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  darkMode: "class", // quan trọng!
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-hover': 'var(--color-primary-hover)',
        // CSS Variables integration
        'theme-bg': 'var(--color-bg)',
        'theme-text': 'var(--color-text)',
        'theme-primary': 'var(--color-primary)',
        'theme-secondary': 'var(--color-secondary)',
        'theme-danger': 'var(--color-danger)',
      },
      backgroundColor: {
        'dynamic': 'var(--color-bg)',
      },
      textColor: {
        'dynamic': 'var(--color-text)',
      },
      borderColor: {
        'dynamic': 'var(--color-primary)',
      },
      fontFamily: {
  lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: []
};

export default config;
