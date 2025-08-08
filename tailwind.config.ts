// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  darkMode: "class", // quan trọng!
  theme: {
    extend: {
      colors: {
        primary: '#0055FF',
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
        playfair: ['Playfair Display', 'serif'],
      }
    }
  },
  plugins: []
};

// Thêm cấu hình font Playfair Display
const config = {
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
};

export default config;
