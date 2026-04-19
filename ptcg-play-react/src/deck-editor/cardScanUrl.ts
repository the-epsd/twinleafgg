import type { Card } from 'ptcg-server';

/**
 * Build card scan URL from server `scansUrl` template (same tokens as Angular CardsBaseService.getScanUrl).
 * Relative results are resolved against `apiBase`.
 */
export function cardScanUrl(card: Card, scansUrl: string | undefined, apiBase: string): string {
  if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') {
    return '';
  }
  const template = scansUrl?.trim() || '';
  if (!template) {
    return '';
  }
  const raw = template
    .replace('{cardImage}', card.cardImage || '')
    .replace('{setNumber}', card.setNumber || '')
    .replace('{name}', card.fullName || '');
  if (!raw) {
    return '';
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw;
  }
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  if (path.startsWith('/assets/')) {
    return path;
  }
  const base = apiBase.replace(/\/$/, '');
  return `${base}${path}`;
}
