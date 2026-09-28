const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a root-relative path with the configured base (e.g. /portfolio on GitHub Pages). */
export function withBase(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
