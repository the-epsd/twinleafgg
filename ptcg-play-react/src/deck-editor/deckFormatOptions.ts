import { Format } from 'ptcg-server';

/** Deck editor + settings “hidden formats” list (same order as Angular settings dialog). */
export const DECK_FORMAT_OPTIONS: { value: Format; labelKey: string }[] = [
  { value: Format.STANDARD, labelKey: 'LABEL_STANDARD' },
  { value: Format.STANDARD_NIGHTLY, labelKey: 'LABEL_STANDARD_NIGHTLY' },
  { value: Format.GLC, labelKey: 'LABEL_GLC' },
  { value: Format.EXPANDED, labelKey: 'LABEL_EXPANDED' },
  { value: Format.UNLIMITED, labelKey: 'LABEL_UNLIMITED' },
  { value: Format.ETERNAL, labelKey: 'LABEL_ETERNAL' },
  { value: Format.SWSH, labelKey: 'LABEL_SWSH' },
  { value: Format.SM, labelKey: 'LABEL_SM' },
  { value: Format.XY, labelKey: 'LABEL_XY' },
  { value: Format.BW, labelKey: 'LABEL_BW' },
  { value: Format.RSPK, labelKey: 'LABEL_RSPK' },
  { value: Format.RETRO, labelKey: 'LABEL_RETRO' },
  { value: Format.THEME, labelKey: 'FORMAT_THEME' },
];
