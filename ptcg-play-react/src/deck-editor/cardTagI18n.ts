import type { TFunction } from '../i18n/strings';
import { CardTag } from 'ptcg-server';

/** Translation keys under TAG_* in locale JSON (subset used in deck filter UI). */
const TAG_TO_KEY: Partial<Record<CardTag, string>> = {
  [CardTag.POKEMON_ex]: 'TAG_POKEMON_ex',
  [CardTag.POKEMON_TERA]: 'TAG_POKEMON_TERA',
  [CardTag.FUTURE]: 'TAG_FUTURE',
  [CardTag.ANCIENT]: 'TAG_ANCIENT',
  [CardTag.ACE_SPEC]: 'TAG_ACE_SPEC',
  [CardTag.POKEMON_V]: 'TAG_POKEMON_V',
  [CardTag.POKEMON_VSTAR]: 'TAG_POKEMON_VSTAR',
  [CardTag.POKEMON_VMAX]: 'TAG_POKEMON_VMAX',
  [CardTag.POKEMON_VUNION]: 'TAG_POKEMON_VUNION',
  [CardTag.RADIANT]: 'TAG_RADIANT',
  [CardTag.SINGLE_STRIKE]: 'TAG_SINGLE_STRIKE',
  [CardTag.RAPID_STRIKE]: 'TAG_RAPID_STRIKE',
  [CardTag.FUSION_STRIKE]: 'TAG_FUSION_STRIKE',
  [CardTag.POKEMON_GX]: 'TAG_POKEMON_GX',
  [CardTag.TAG_TEAM]: 'TAG_TAG_TEAM',
  [CardTag.ULTRA_BEAST]: 'TAG_ULTRA_BEAST',
  [CardTag.PRISM_STAR]: 'TAG_PRISM_STAR',
  [CardTag.POKEMON_EX]: 'TAG_POKEMON_EX',
  [CardTag.BREAK]: 'TAG_BREAK',
  [CardTag.MEGA]: 'TAG_MEGA',
  [CardTag.TEAM_PLASMA]: 'TAG_TEAM_PLASMA',
  [CardTag.TEAM_MAGMA]: 'TAG_TEAM_MAGMA',
  [CardTag.NS]: 'TAG_NS',
  [CardTag.IONOS]: 'TAG_IONOS',
  [CardTag.HOPS]: 'TAG_HOPS',
  [CardTag.LILLIES]: 'TAG_LILLIES',
  [CardTag.STEVENS]: 'TAG_STEVENS',
  [CardTag.MARNIES]: 'TAG_MARNIES',
  [CardTag.ETHANS]: 'TAG_ETHANS',
  [CardTag.MISTYS]: 'TAG_MISTYS',
  [CardTag.PRIME]: 'TAG_PRIME',
  [CardTag.LEGEND]: 'TAG_LEGEND',
  [CardTag.POKEMON_LV_X]: 'TAG_POKEMON_LV_X',
  [CardTag.POKEMON_SP]: 'TAG_POKEMON_SP',
  [CardTag.DELTA_SPECIES]: 'TAG_DELTA_SPECIES',
};

const TAG_OPTIONS_ORDER: CardTag[] = [
  CardTag.POKEMON_ex,
  CardTag.POKEMON_V,
  CardTag.POKEMON_VMAX,
  CardTag.POKEMON_VSTAR,
  CardTag.ACE_SPEC,
  CardTag.RADIANT,
  CardTag.PRISM_STAR,
  CardTag.POKEMON_GX,
  CardTag.TAG_TEAM,
  CardTag.MEGA,
];

export function cardTagFilterLabel(t: TFunction, tag: CardTag): string {
  const key = TAG_TO_KEY[tag];
  return key ? t(key) : String(tag);
}

export function getDeckFilterTagOptions(t: TFunction): { value: CardTag; label: string }[] {
  return TAG_OPTIONS_ORDER.map((value) => ({ value, label: cardTagFilterLabel(t, value) }));
}
