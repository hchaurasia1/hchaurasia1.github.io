import { defineConfig } from 'astro/config';

// User site served at the domain root — no `base` path needed.
export default defineConfig({
  site: 'https://hchaurasia1.github.io',
  markdown: {
    // The site's code blocks sit on a light grey background; match it.
    shikiConfig: { theme: 'github-light' },
  },
});
