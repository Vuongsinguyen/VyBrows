import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
  },

  integrations: [
    preact({
      exclude: ['**/BookingComponent*.tsx', '**/Step*.tsx', '**/ServiceModal.tsx']
    }),
    react({
      include: ['**/BookingComponent*.tsx', '**/Step*.tsx', '**/ServiceModal.tsx']
    })
  ]
});