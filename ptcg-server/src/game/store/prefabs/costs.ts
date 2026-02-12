import { Card, CardTarget, ChooseEnergyPrompt, DiscardEnergyPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../..';
import { CardType, SuperType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { DiscardCardsEffect } from '../effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';

/**
 * These prefabs are for "costs" that effects/attacks must pay.
 */

function cardMatchesEnergyFilter(card: Card, filter: Partial<EnergyCard>): card is EnergyCard {
  if (!(card instanceof EnergyCard)) {
    return false;
  }

  for (const key in filter) {
    if ((card as any)[key] !== (filter as any)[key]) {
      return false;
    }
  }

  return true;
}

function energyCardProvidesType(card: Card, cardType: CardType): boolean {
  if (!(card instanceof EnergyCard)) {
    return false;
  }
  return card.provides.includes(cardType) || card.provides.includes(CardType.ANY);
}

type EnergyDiscardTransfer = { from: CardTarget, card: Card };

function discardTransfersAsEffects(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  transfers: EnergyDiscardTransfer[]
): State {
  const player = effect.player;
  const grouped = new Map<PokemonCardList, Card[]>();

  transfers.forEach(transfer => {
    const source = StateUtils.getTarget(state, player, transfer.from);
    const cards = grouped.get(source) || [];
    cards.push(transfer.card);
    grouped.set(source, cards);
  });

  grouped.forEach((cards, source) => {
    const discardEnergy = new DiscardCardsEffect(effect, cards);
    discardEnergy.target = source;
    state = store.reduceEffect(state, discardEnergy);
  });

  return state;
}

/**
 * Discard up to X Energy cards from this Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export function DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  maxAmount: number,
  filter: Partial<EnergyCard> = {},
  minAmount: number = 0,
  onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void
): State {
  return DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(
    store,
    state,
    effect,
    maxAmount,
    filter,
    minAmount,
    [SlotType.ACTIVE],
    onDiscarded
  );
}

/**
 * Discard up to X Energy cards from your Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 * - `slots`: Active + Bench
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export function DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  maxAmount: number,
  filter: Partial<EnergyCard> = {},
  minAmount: number = 0,
  slots: SlotType[] = [SlotType.ACTIVE, SlotType.BENCH],
  onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void
): State {
  const player = effect.player;

  if (maxAmount <= 0) {
    return state;
  }

  let availableEnergy = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    const slotType = cardList === player.active ? SlotType.ACTIVE : SlotType.BENCH;
    if (!slots.includes(slotType)) {
      return;
    }
    availableEnergy += cardList.cards.filter(card => cardMatchesEnergyFilter(card, filter)).length;
  });

  if (availableEnergy === 0) {
    return state;
  }

  const promptMax = Math.min(maxAmount, availableEnergy);
  const promptMin = Math.min(Math.max(0, minAmount), promptMax);

  return store.prompt(state, new DiscardEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    PlayerType.BOTTOM_PLAYER,
    slots,
    { superType: SuperType.ENERGY, ...filter },
    { allowCancel: false, min: promptMin, max: promptMax }
  ), transfers => {
    if (transfers === null || transfers.length === 0) {
      return state;
    }
    state = discardTransfersAsEffects(store, state, effect, transfers);
    if (onDiscarded !== undefined) {
      onDiscarded(transfers);
    }
    return state;
  });
}

/**
 * Discard up to X [type] Energy from your Pokémon.
 *
 * This defaults to all attached Energy and validates type server-side so callers
 * can safely use broad selection filters.
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
export function DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  maxAmount: number,
  cardType: CardType,
  minAmount: number = 0,
  slots: SlotType[] = [SlotType.ACTIVE, SlotType.BENCH],
  onDiscarded?: (transfers: EnergyDiscardTransfer[]) => void
): State {
  const player = effect.player;

  if (maxAmount <= 0) {
    return state;
  }

  let availableTypedEnergy = 0;
  const blockedMap: { source: CardTarget, blocked: number[] }[] = [];

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
    if (!slots.includes(target.slot)) {
      return;
    }

    const blocked: number[] = [];
    cardList.cards.forEach((card, index) => {
      const isTypedEnergy = energyCardProvidesType(card, cardType);
      if (!isTypedEnergy) {
        blocked.push(index);
      } else {
        availableTypedEnergy += 1;
      }
    });

    blockedMap.push({ source: target, blocked });
  });

  if (availableTypedEnergy === 0) {
    return state;
  }

  const promptMax = Math.min(maxAmount, availableTypedEnergy);
  const promptMin = Math.min(Math.max(0, minAmount), promptMax);

  return store.prompt(state, new DiscardEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    PlayerType.BOTTOM_PLAYER,
    slots,
    { superType: SuperType.ENERGY },
    { allowCancel: false, min: promptMin, max: promptMax, blockedMap }
  ), transfers => {
    if (transfers === null || transfers.length === 0) {
      return state;
    }

    if (!transfers.every(transfer => energyCardProvidesType(transfer.card, cardType))) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }

    state = discardTransfersAsEffects(store, state, effect, transfers);
    if (onDiscarded !== undefined) {
      onDiscarded(transfers);
    }
    return state;
  });
}

/**
 * Discards an exact amount of Energy from this Pokémon.
 *
 * This helper is preserved for compatibility with existing exact-cost logic.
 */
export function DISCARD_X_ENERGY_FROM_THIS_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  amount: number,
  type: CardType = CardType.COLORLESS
): State {
  const player = effect.player;
  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  const energyList: CardType[] = [];
  for (let i = 0; i < amount; i++) {
    energyList.push(type);
  }

  state = store.prompt(state, new ChooseEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    checkProvidedEnergy.energyMap,
    energyList,
    { allowCancel: false }
  ), energy => {
    const cards: Card[] = (energy || []).map(e => e.card);
    const discardEnergy = new DiscardCardsEffect(effect, cards);
    discardEnergy.target = player.active;
    return store.reduceEffect(state, discardEnergy);
  });

  return state;
}
