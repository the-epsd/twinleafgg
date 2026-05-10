import { Format } from 'ptcg-server';

export const MATCH_FORMAT_VALUES: Format[] = [
  Format.STANDARD,
  Format.STANDARD_NIGHTLY,
  Format.GLC,
  Format.EXPANDED,
  Format.UNLIMITED,
  Format.ETERNAL,
];

/** Formats shown when creating a direct / invite game (matches Angular create-game popup). */
export const CREATE_GAME_FORMAT_VALUES: Format[] = [
  Format.STANDARD,
  Format.STANDARD_NIGHTLY,
  Format.GLC,
  Format.EXPANDED,
  Format.UNLIMITED,
  Format.ETERNAL,
  Format.SWSH,
  Format.SM,
  Format.XY,
  Format.BW,
  Format.RSPK,
  Format.RETRO,
  Format.THEME,
];
