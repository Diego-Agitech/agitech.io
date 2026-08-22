import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// output 'hybrid' + vercel adapter: only /keystatic needs SSR (admin UI), rest of the
// site stays prerendered/static, same pattern as agifid.
// i18n: fr = default locale, no prefix (matches current WP/Polylang URLs); en under /en/.
export default defineConfig({
  site: 'https://agitech.io',
  output: 'hybrid',
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
