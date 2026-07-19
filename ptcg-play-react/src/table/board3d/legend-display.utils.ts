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

/** Legend assembly cinematic (see board-3d-animation.service). */
export const LEGEND_ASSEMBLY_STAGE_SCALE = 2.05;
/** World-space gap between halves at the dramatic center reveal (before snap). */
export const LEGEND_ASSEMBLY_REVEAL_SEPARATION = 9.2;
/** Stacked half local offsets at stage scale (matches bench legend overlays). */
export function legendAssemblyStackedHalfLocalPositions(): {
  top: { x: number; y: number; z: number };
  bottom: { x: number; y: number; z: number };
} {
  const stage = LEGEND_ASSEMBLY_STAGE_SCALE;
  return {
    top: { x: 0, y: LEGEND_3D_Y, z: LEGEND_3D_TOP_Z * stage },
    bottom: { x: 0, y: LEGEND_3D_Y + 0.01, z: LEGEND_3D_BOTTOM_Z * stage },
  };
}
