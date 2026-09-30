import { appConfig } from '../env/config';

/** Resolve server-relative asset paths (e.g. /avatars/mew.png) against the API base. */
export function resolveAssetUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) {
    return '';
  }
  if (/^(https?:|data:|blob:)/i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const base = appConfig.apiUrl.replace(/\/$/, '');
  return `${base}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}
