import type { TFunction } from 'i18next';
import { Format } from 'ptcg-server';

const FORMAT_LABEL_KEYS: Partial<Record<Format, string>> = {
  [Format.STANDARD]: 'LABEL_STANDARD',
  [Format.STANDARD_NIGHTLY]: 'LABEL_STANDARD_NIGHTLY',
  [Format.GLC]: 'LABEL_GLC',
  [Format.EXPANDED]: 'LABEL_EXPANDED',
  [Format.UNLIMITED]: 'LABEL_UNLIMITED',
  [Format.ETERNAL]: 'LABEL_ETERNAL',
  [Format.SWSH]: 'LABEL_SWSH',
  [Format.SM]: 'LABEL_SM',
  [Format.XY]: 'LABEL_XY',
  [Format.BW]: 'LABEL_BW',
  [Format.RSPK]: 'LABEL_RSPK',
  [Format.RETRO]: 'LABEL_RETRO',
  [Format.THEME]: 'FORMAT_THEME',
};

export function formatOptionLabel(t: TFunction, f: Format): string {
  const key = FORMAT_LABEL_KEYS[f];
  return key ? t(key) : `${f}`;
}
