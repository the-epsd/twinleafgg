import { Card, CardTag } from 'ptcg-server';

/** CSS class names for card holo treatments. */
export type HoloVariant = 'holo' | 'trainer-holo' | 'fullart-holo' | 'radiant-holo' | 'ace-spec-holo';

const HOLO_BY_FULL_NAME: ReadonlySet<string> = new Set([
  'Armarouge SVI',
  'Hawlucha SVI',
  'Klefki SVI',
  'Revavroom SVI',
  'Baxcalibur PAL',
  'Hydreigon PAL',
  'Lokix PAL',
  'Luxray PAL',
  'Mimikyu PAL',
  'Spiritomb PAL',
  'Tinkaton PAL',
  'Entei OBF',
  'Scizor OBF',
  'Thundurus OBF',
  'Brute Bonnet PAR',
  'Chi-Yu PAR',
  'Deoxys PAR',
  'Groudon PAR',
  'Latios PAR',
  'Morpeko PAR',
  'Xatu PAR',
  'Zacian PAR',
  'Dudunsparce TEF',
  'Feraligatr TEF',
  'Flutter Mane TEF',
  'Iron Thorns TEF',
  'Iron Jugulis TEF',
  'Koraidon TEF',
  'Miraidon TEF',
  'Roaring Moon TEF',
  'Froslass TWM',
  'Infernape TWM',
  'Iron Leaves TWM',
  'Munkidori TWM',
  'Okidogi TWM',
  'Ting-Lu TWM',
  'Walking Wake TWM',
  'Zapdos TWM',
  'Sinistcha TWM',
  'Teal Mask Ogerpon TWM',
  'Chandelure TWM',
  'Alakazam TWM',
  'Enamorus TWM',
  'Fezandipiti TWM',
  'Hisuian Arcanine TWM',
  'Heatran TWM',
  'Drednaw SV7',
  'Zeraora SV7',
  'Alcremie SV7',
  'Iron Boulder SV7',
  'Rhyperior SV7',
  'Grimmsnarl SV7',
  'Klinklang SV7',
  'Melmetal SV7',
  'Archaludon SV7',
  'Raging Bolt SV7',
  'Noctowl SV7',
  'Bouffalant SV7',
  'Zarude SV8',
  'Rabsca SV8',
  'Skeledirge SV8',
  'Gouging Fire SV8',
  'Chien-Pao SV8',
  'Tapu Koko SV8',
  'Togekiss SV8',
  'Cofagrigus SV8',
  'Tapu Lele SV8',
  'Gastrodon SV8',
  'Landorus SV8',
  'Iron Crown SV8',
  'Dialga SV8',
  'Palkia SV8',
  'Eternatus SV8',
  'Terapagos SV8',
]);

const TRAINER_HOLO_BY_FULL_NAME: ReadonlySet<string> = new Set([
  'Professors Research SVI',
  "Professor's Research PAF",
  "Boss's Orders PAL",
]);

/**
 * Returns the holographic style variant for a card.
 */
export function getHoloVariant(
  card: Card | null | undefined,
  holoEnabled: boolean
): HoloVariant | null {
  if (!holoEnabled || !card) {
    return null;
  }
  // Named holo rares (list-only): allow without tags — some API/catalog payloads omit tags.
  const fullName = (card as { fullName?: string }).fullName;
  if (typeof fullName === 'string' && HOLO_BY_FULL_NAME.has(fullName)) {
    return 'holo';
  }
  if (typeof fullName === 'string' && TRAINER_HOLO_BY_FULL_NAME.has(fullName)) {
    return 'trainer-holo';
  }
  const tags = (card as { tags?: CardTag[] }).tags;
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null;
  }
  if (
    tags.includes(CardTag.POKEMON_V) ||
    tags.includes(CardTag.POKEMON_ex) ||
    tags.includes(CardTag.POKEMON_EX) ||
    tags.includes(CardTag.POKEMON_GX) ||
    tags.includes(CardTag.POKEMON_VMAX) ||
    tags.includes(CardTag.POKEMON_VSTAR) ||
    tags.includes(CardTag.POKEMON_VUNION) ||
    tags.includes(CardTag.POKEMON_LV_X)
  ) {
    return 'fullart-holo';
  }
  if (tags.includes(CardTag.RADIANT)) {
    return 'radiant-holo';
  }
  if (tags.includes(CardTag.ACE_SPEC)) {
    return 'ace-spec-holo';
  }
  return null;
}

/**
 * For Storybook or embedding `CardFace` with only a partial card shape (e.g. `tags` + `fullName`)
 * with no `superType`. Prefer passing a real `Card` from the server.
 */
export function getHoloVariantForPreview(
  card: { fullName: string; tags: CardTag[] } | null | undefined,
  holoEnabled: boolean
): HoloVariant | null {
  if (!holoEnabled || !card) {
    return null;
  }
  if (HOLO_BY_FULL_NAME.has(card.fullName)) {
    return 'holo';
  }
  if (TRAINER_HOLO_BY_FULL_NAME.has(card.fullName)) {
    return 'trainer-holo';
  }
  if (!card.tags?.length) {
    return null;
  }
  if (
    card.tags.includes(CardTag.POKEMON_V) ||
    card.tags.includes(CardTag.POKEMON_ex) ||
    card.tags.includes(CardTag.POKEMON_EX) ||
    card.tags.includes(CardTag.POKEMON_GX) ||
    card.tags.includes(CardTag.POKEMON_VMAX) ||
    card.tags.includes(CardTag.POKEMON_VSTAR) ||
    card.tags.includes(CardTag.POKEMON_VUNION) ||
    card.tags.includes(CardTag.POKEMON_LV_X)
  ) {
    return 'fullart-holo';
  }
  if (card.tags.includes(CardTag.RADIANT)) {
    return 'radiant-holo';
  }
  if (card.tags.includes(CardTag.ACE_SPEC)) {
    return 'ace-spec-holo';
  }
  return null;
}
