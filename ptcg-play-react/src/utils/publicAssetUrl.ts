/** Public-folder paths must be root-relative so they work on nested routes (e.g. /table/1). */
export function publicAssetUrl(path: string): string {
  const trimmed = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${trimmed}`;
}
