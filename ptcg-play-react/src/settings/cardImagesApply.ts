import { setCardImagesUrl, setNightlyImagesUrl } from '../api/profileApi';
import { persistCustomImages, persistNightlyImages } from '../deck-editor/resolveScanUrl';

export const RESET_CARD_IMAGES_JSON_URL =
  'https://gist.githubusercontent.com/RawrJoey/b13aace5fba9f5568039f00c69492617/raw/2df7ea74c8b68d64ca74aa201f976611471b811e/reset.json';

async function fetchJsonRecord(url: string): Promise<Record<string, string>> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const j: unknown = await res.json();
  if (!j || typeof j !== 'object' || Array.isArray(j)) {
    throw new Error('Invalid JSON');
  }
  return j as Record<string, string>;
}

export async function applyCustomCardImagesUrl(
  jsonUrl: string,
  persistToApi: boolean,
): Promise<void> {
  if (persistToApi) {
    await setCardImagesUrl(jsonUrl).catch(() => {
      /* continue like Angular CardsBaseService.setScanUrl */
    });
  }
  const json = await fetchJsonRecord(jsonUrl);
  persistCustomImages(json);
}

export async function applyNightlyCardImagesUrl(jsonUrl: string): Promise<void> {
  await setNightlyImagesUrl(jsonUrl);
  const json = await fetchJsonRecord(jsonUrl);
  persistNightlyImages(json);
}
