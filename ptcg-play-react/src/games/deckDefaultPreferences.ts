import { Format } from 'ptcg-server';
import type { DeckListEntry } from '../types/responses';
import { FormatValidator } from '../deck-editor/formatValidator';

const LS_DEFAULT_DECK_ID = 'defaultDeckId';
const LS_FORMAT_DEFAULTS = 'formatDefaultDecks';

/** Keys used in `formatDefaultDecks` localStorage (matches deck list format tabs). */
const FORMAT_TO_DEFAULT_DECK_KEY: Partial<Record<Format, string>> = {
  [Format.STANDARD]: 'standard',
  [Format.STANDARD_NIGHTLY]: 'standard_nightly',
  [Format.GLC]: 'glc',
  [Format.EXPANDED]: 'expanded',
  [Format.RSPK]: 'RSPK',
  [Format.RETRO]: 'retro',
  [Format.UNLIMITED]: 'unlimited',
  [Format.ETERNAL]: 'eternal',
  [Format.THEME]: 'theme',
  [Format.SWSH]: 'swsh',
  [Format.SM]: 'sm',
  [Format.XY]: 'xy',
  [Format.BW]: 'bw',
};

export function readDefaultDeckId(): number | null {
  const v = localStorage.getItem(LS_DEFAULT_DECK_ID);
  if (!v) {
    return null;
  }
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export function readFormatDefaultDecks(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_FORMAT_DEFAULTS);
    if (!raw) {
      return {};
    }
    const o = JSON.parse(raw) as Record<string, number>;
    return typeof o === 'object' && o !== null ? o : {};
  } catch {
    return {};
  }
}

export function getPreferredDeckIdForFormat(format: Format): number | null {
  const formatDefaults = readFormatDefaultDecks();
  const key = FORMAT_TO_DEFAULT_DECK_KEY[format];
  if (key != null && formatDefaults[key] != null) {
    return formatDefaults[key]!;
  }
  const legacyKey = Format[format]?.toLowerCase();
  if (legacyKey != null && legacyKey !== key && formatDefaults[legacyKey] != null) {
    return formatDefaults[legacyKey]!;
  }
  return readDefaultDeckId();
}

export function validDecksForFormat(all: DeckListEntry[], format: Format): DeckListEntry[] {
  return all.filter(
    (d) => Array.isArray(d.format) && d.format.includes(format) && FormatValidator.isDeckValidForFormat(d, format),
  );
}

export function pickDefaultDeckIdForFormat(validDecks: DeckListEntry[], format: Format): number | null {
  if (validDecks.length === 0) {
    return null;
  }
  const preferred = getPreferredDeckIdForFormat(format);
  if (preferred != null && validDecks.some((d) => d.id === preferred)) {
    return preferred;
  }
  return validDecks[0]!.id;
}
