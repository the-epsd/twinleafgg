import { Card, CardTag, PokemonCardList, SuperType } from 'ptcg-server';

export type LegendDisplayHalves = {
  top?: Card;
  bottom?: Card;
};

export function resolveLegendDisplayHalves(cardList: PokemonCardList): LegendDisplayHalves {
  const pokemonCard = cardList.getPokemonCard();
  if (!pokemonCard?.tags?.includes(CardTag.LEGEND)) {
    return {};
  }

  const top = cardList.cards.find(
    (c) =>
      c.superType === SuperType.POKEMON &&
      c.tags?.includes(CardTag.LEGEND) &&
      c.fullName.includes('(Top)'),
  );
  const bottom = cardList.cards.find(
    (c) =>
      c.superType === SuperType.POKEMON &&
      c.tags?.includes(CardTag.LEGEND) &&
      c.fullName.includes('(Bottom)'),
  );

  return { top, bottom };
}

/** Matches 2D board legend half layout (see Board2DCard.module.css). */
export const LEGEND_3D_HALF_SCALE = 0.75;
/** Sideways on the table, plus 180° so art reads correctly when stacked. */
export const LEGEND_3D_HALF_ROTATION = 270;
export const LEGEND_3D_CARD_HEIGHT = 3.5;
export const LEGEND_3D_TOP_Z = -0.28 * LEGEND_3D_CARD_HEIGHT;
export const LEGEND_3D_BOTTOM_Z = 0.25 * LEGEND_3D_CARD_HEIGHT;
export const LEGEND_3D_Y = 0.06;
