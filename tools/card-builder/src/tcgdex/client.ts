/**
 * Card catalog — local files from https://github.com/PokemonTCG/pokemon-tcg-data
 * (synced into data/pokemon-tcg-data via `npm run sync-data`).
 */
export {
  DataError,
  TcgDexApiError,
  type TcgDexAbility,
  type TcgDexAttack,
  type TcgDexCard,
  type TcgDexCardResume,
  type TcgDexSerie,
  type TcgDexSerieResume,
  type TcgDexSet,
  type TcgDexSetResume,
  type TcgDexWeakRes,
} from '../data/types';
export type { ReprintCandidate } from '../types';

export {
  cardImageUrl,
  clearLocalCache as clearPwCache,
  getCard,
  findCardsByNameAndSet,
  getSerie,
  getSet,
  listSeries,
  searchCardsByName,
  setLogoUrl,
} from '../data/localData';

import type { ReprintCandidate } from '../types';

export async function findReprintCandidates(
  set: string,
  name: string,
  excludeSetNumber = ''
): Promise<ReprintCandidate[]> {
  const params = new URLSearchParams({ set, name });
  if (excludeSetNumber) params.set('excludeSetNumber', excludeSetNumber);
  const response = await fetch(`/reprint-candidates?${params.toString()}`);
  const payload = (await response.json()) as { candidates?: ReprintCandidate[]; error?: string };
  if (!response.ok) throw new Error(payload.error || `Reprint lookup failed (${response.status})`);
  return payload.candidates || [];
}

export {
  getActiveSource,
  resetDataSource,
  setActiveSource,
  type DataSource,
} from '../data/compat';
