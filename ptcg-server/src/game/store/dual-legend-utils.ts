import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { CardTag } from './card/card-types';
import { PokemonCard } from './card/pokemon-card';
import { PowerType } from './card/pokemon-types';
import { Player } from './state/player';
import { GamePhase, State } from './state/state';
import { StoreLike } from './store-like';
import { UsePowerEffect } from './effects/game-effects';

export function isDualLegendHalf(card: Card): card is PokemonCard {
  return card instanceof PokemonCard && card.tags.includes(CardTag.DUAL_LEGEND);
}

/** Both distinct halves of the same dual LEGEND must be in hand. */
export function getDualLegendHalvesInHand(player: Player, card: PokemonCard): Card[] {
  const halves = player.hand.cards.filter(
    (c: Card) => c.name === card.name && c.tags?.includes(CardTag.DUAL_LEGEND),
  );
  const bySetNumber = new Map<string, Card>();
  for (const half of halves) {
    if (!bySetNumber.has(half.setNumber)) {
      bySetNumber.set(half.setNumber, half);
    }
  }
  return [...bySetNumber.values()].sort((a, b) => Number(a.setNumber) - Number(b.setNumber));
}

export function hasBothDualLegendHalvesInHand(player: Player, card: PokemonCard): boolean {
  return getDualLegendHalvesInHand(player, card).length >= 2;
}

export function canPlayDualLegend(
  store: StoreLike,
  state: State,
  player: Player,
  card: PokemonCard,
): boolean {
  if (state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer]?.id !== player.id) {
    return false;
  }
  if (!hasBothDualLegendHalvesInHand(player, card)) {
    return false;
  }
  const openBench = player.bench.some(b => b.cards.length === 0);
  if (!openBench) {
    return false;
  }
  const power = card.powers?.find(
    p => p.useFromHand === true && p.powerType === PowerType.LEGEND_ASSEMBLY,
  );
  return power !== undefined;
}

export function assembleDualLegendFromHand(
  store: StoreLike,
  state: State,
  player: Player,
  triggeredCard: PokemonCard,
): State {
  if (!hasBothDualLegendHalvesInHand(player, triggeredCard)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const openBench = player.bench.some(b => b.cards.length === 0);
  if (!openBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const power = triggeredCard.powers?.find(
    p => p.useFromHand === true && p.powerType === PowerType.LEGEND_ASSEMBLY,
  );
  if (!power) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const handIndex = player.hand.cards.indexOf(triggeredCard);
  if (handIndex < 0) {
    throw new GameError(GameMessage.UNKNOWN_CARD);
  }

  const target: CardTarget = {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.HAND,
    index: handIndex,
  };

  return store.reduceEffect(state, new UsePowerEffect(player, power, triggeredCard, target));
}
