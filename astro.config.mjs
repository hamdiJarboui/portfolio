import { defineConfig } from 'astro/config';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow. The defaults
// match the project page at https://hamdijarboui.github.io/portfolio/.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://hamdijarboui.github.io',
  base: process.env.BASE_PATH ?? '/portfolio',
  compressHTML: true,
});
