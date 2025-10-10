import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://vybrowsbeauty.com',
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          vi: 'vi', 
          ja: 'ja',
          es: 'es',
          ko: 'ko'
        }
      },
      filter: (page) => {
        // Exclude test pages and development files
        return !page.includes('/test-') && 
               !page.includes('.html') && 
               !page.includes('/api/');
      }
    })
  ]
});