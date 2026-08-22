import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Astro 5: 'static' is what 'hybrid' used to mean — prerendered by default, with an
// adapter present so individual routes (Keystatic's /keystatic admin UI) can still opt
// into SSR via their own prerender=false. Same pattern as agifid.
// i18n: fr = default locale, no prefix (matches current WP/Polylang URLs); en under /en/.
export default defineConfig({
  site: 'https://agitech.io',
  output: 'static',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), keystatic()],
});
