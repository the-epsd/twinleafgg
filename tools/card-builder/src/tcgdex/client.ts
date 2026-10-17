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
  findCardBySetAndNumber,
  findCardsByNameAndSet,
  getSerie,
  getSet,
  listSeries,
  searchCardsByName,
  setLogoUrl,
} from '../data/localData';

import type { CardDraft, ReprintLookupResult } from '../types';

export async function findReprintCandidates(
  draft: Pick<
    CardDraft,
    | 'set'
    | 'name'
    | 'setNumber'
    | 'extends'
    | 'hasAttacks'
    | 'hasPowers'
    | 'attacks'
    | 'powers'
    | 'trainerText'
    | 'energyText'
  >
): Promise<ReprintLookupResult> {
  const response = await fetch('/reprint-candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      set: draft.set,
      name: draft.name,
      excludeSetNumber: draft.setNumber,
      extends: draft.extends,
      hasAttacks: draft.hasAttacks,
      hasPowers: draft.hasPowers,
      attacks: draft.attacks.map(a => ({ name: a.name, text: a.text })),
      powers: draft.powers.map(p => ({ name: p.name, text: p.text })),
      trainerText: draft.trainerText,
      energyText: draft.energyText,
    }),
  });
  const payload = (await response.json()) as ReprintLookupResult & { error?: string };
  if (!response.ok) throw new Error(payload.error || `Reprint lookup failed (${response.status})`);
  return {
    candidates: payload.candidates || [],
    nextOccurrence: payload.nextOccurrence ?? 1,
    suggestedClassName: payload.suggestedClassName || '',
    suggestedFullName: payload.suggestedFullName || '',
  };
}

export {
  getActiveSource,
  resetDataSource,
  setActiveSource,
  type DataSource,
} from '../data/compat';
