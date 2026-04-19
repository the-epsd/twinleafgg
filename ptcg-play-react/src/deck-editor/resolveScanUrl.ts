import type { Card } from 'ptcg-server';
import cardbackImportedUrl from '../assets/cardback.png?url';
import { cardScanUrl } from './cardScanUrl';

/**
 * Bundled by Vite (`src/assets/cardback.png`) so the URL targets the SPA host, not {@link apiBase}.
 */
export const CARDBACK_ASSET_URL = cardbackImportedUrl;

/** Matches Angular CardsBaseService identifier keys. */
export function cardImagePrimaryId(card: Card): string {
  return `${card.set} ${card.setNumber}`;
}

export function cardImageAltId(card: Card): string {
  return `${card.set} ${(card.setNumber || '').padStart(3, '0')}`;
}

export type CardImageMaps = {
  nightly: Record<string, string>;
  custom: Record<string, string>;
  overrides: Record<string, string>;
};

function ensureAbsolute(url: string, apiBase: string): string {
  const t = url.trim();
  if (!t) {
    return '';
  }
  if (/^https?:\/\//i.test(t) || t.startsWith('data:') || t.startsWith('blob:')) {
    return t;
  }
  const path = t.startsWith('/') ? t : `/${t}`;
  // Same-origin app assets (Vite `public/` or bundled `/assets/*`), not paths on the API host.
  if (path.startsWith('/assets/')) {
    return path;
  }
  const base = apiBase.replace(/\/$/, '');
  return `${base}${path}`;
}

/**
 * Same resolution order as Angular CardsBaseService.getScanUrl:
 * nightly map, local overrides, custom JSON map, then scansUrl template.
 * If nothing resolves, returns {@link CARDBACK_ASSET_URL}.
 */
export function resolveScanUrl(
  card: Card,
  maps: CardImageMaps,
  scansUrl: string | undefined,
  apiBase: string,
): string {
  const raw = resolveScanUrlRaw(card, maps, scansUrl, apiBase);
  const t = raw.trim();
  return t || CARDBACK_ASSET_URL;
}

/** Resolved art URL or empty string when no image is known (before cardback fallback). */
export function resolveScanUrlRaw(
  card: Card,
  maps: CardImageMaps,
  scansUrl: string | undefined,
  apiBase: string,
): string {
  if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') {
    return '';
  }

  const primary = cardImagePrimaryId(card);
  const alt = cardImageAltId(card);

  const nightlyUrl = maps.nightly[primary] ?? maps.nightly[alt];
  if (nightlyUrl) {
    return ensureAbsolute(nightlyUrl, apiBase);
  }

  const overrideUrl = maps.overrides[primary] ?? maps.overrides[alt];
  if (overrideUrl) {
    return ensureAbsolute(overrideUrl, apiBase);
  }

  const customUrl = maps.custom[primary] ?? maps.custom[alt];
  if (customUrl) {
    return ensureAbsolute(customUrl, apiBase);
  }

  if (!card.set || !card.setNumber) {
    if (card.cardImage && scansUrl?.trim()) {
      const raw = scansUrl
        .replace('{cardImage}', card.cardImage || '')
        .replace('{setNumber}', card.setNumber || '')
        .replace('{name}', card.fullName || '');
      if (raw && !/^https?:\/\//i.test(raw) && !raw.startsWith('data:') && !raw.startsWith('blob:')) {
        const path = raw.startsWith('/') ? raw : `/${raw}`;
        if (path.startsWith('/assets/')) {
          return path;
        }
        const base = apiBase.replace(/\/$/, '');
        return `${base}${path}`;
      }
      return raw;
    }
    return '';
  }

  return cardScanUrl(card, scansUrl, apiBase);
}

const LS_CUSTOM = 'customCardImages';
const LS_NIGHTLY = 'nightlyCardImages';
const LS_OVERRIDES = 'customCardImageOverrides';

function parseRecord(raw: string | null): Record<string, string> {
  if (!raw) {
    return {};
  }
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function readCardImageMapsFromStorage(): CardImageMaps {
  if (typeof localStorage === 'undefined') {
    return { nightly: {}, custom: {}, overrides: {} };
  }
  return {
    custom: parseRecord(localStorage.getItem(LS_CUSTOM)),
    nightly: parseRecord(localStorage.getItem(LS_NIGHTLY)),
    overrides: parseRecord(localStorage.getItem(LS_OVERRIDES)),
  };
}

export function mergeImageRecords(
  base: Record<string, string>,
  fetched: Record<string, string> | null | undefined,
): Record<string, string> {
  if (!fetched || typeof fetched !== 'object') {
    return { ...base };
  }
  return { ...base, ...fetched };
}

export function persistCustomImages(json: Record<string, string>): void {
  try {
    localStorage.setItem(LS_CUSTOM, JSON.stringify(json));
  } catch {
    /* ignore quota */
  }
}

export function persistNightlyImages(json: Record<string, string>): void {
  try {
    localStorage.setItem(LS_NIGHTLY, JSON.stringify(json));
  } catch {
    /* ignore */
  }
}
