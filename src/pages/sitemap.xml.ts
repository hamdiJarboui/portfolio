import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { withBase } from '../utils/url';

// A static sitemap: the home page and one page per case study.
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://hamdijarboui.github.io');
  const paths = ['/', ...projects.map((p) => `/projects/${p.slug}/`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(withBase(p), origin).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
