import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://ian-gao.com',
  output: 'static',
  trailingSlash: 'ignore',
  redirects: {
    '/about': { status: 301, destination: '/' },
  },
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({ imageService: 'compile' }),
});