import {
  Card,
  ChooseAttackPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '../..';
import { CardType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { Attack } from '../card/pokemon-types';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { runDelegatedCopiedAttackGenerator } from './copy-attack-delegation';

export interface CopyAttackFromListOptions {
  allowCancel?: boolean;
  disallowCopycatAttack?: boolean;
  blocked?: { index: number; attack: string }[];
  maxRetries?: number;
  /** Player who chooses the attack (default: attacking player). */
  promptPlayerId?: number;
}

export function findPokemonCardForAttack(
  cards: Card[],
  attack: Attack,
): PokemonCard | undefined {
  for (const card of cards) {
    if (!(card instanceof PokemonCard)) {
      continue;
    }
    if (card.attacks.includes(attack) || card.attacks.some(a => a.name === attack.name)) {
      return card;
    }
  }
  return undefined;
}

/** Block attack names locked by THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN (e.g. Yoga Loop). */
export function blockCannotUseAttacksNextTurn(
  player: Player,
  pokemonCards: Card[],
  blocked: { index: number; attack: string }[] = [],
): { index: number; attack: string }[] {
  const locked = new Set(player.active.cannotUseAttacksNextTurn || []);
  if (locked.size === 0) {
    return blocked;
  }

  const merged = [...blocked];
  const already = new Set(merged.map(b => `${b.index}:${b.attack}`));

  pokemonCards.forEach((card, index) => {
    if (!(card instanceof PokemonCard)) {
      return;
    }
    for (const attack of card.attacks) {
      if (!locked.has(attack.name)) {
        continue;
      }
      const key = `${index}:${attack.name}`;
      if (already.has(key)) {
        continue;
      }
      already.add(key);
      merged.push({ index, attack: attack.name });
    }
  });

  return merged;
}

function isAttackLockedNextTurn(player: Player, attack: Attack): boolean {
  return (player.active.cannotUseAttacksNextTurn || []).includes(attack.name);
}

function* copyAttackFromPokemonListGenerator(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  pokemonCards: Card[],
  options: CopyAttackFromListOptions = {},
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const {
    allowCancel = false,
    disallowCopycatAttack = true,
    blocked = [],
    maxRetries = 1,
    promptPlayerId,
  } = options;

  if (pokemonCards.length === 0) {
    return state;
  }

  const copycatCard = effect.source.getPokemonCard();
  if (copycatCard === undefined) {
    return state;
  }

  for (let retry = 0; retry < maxRetries; retry++) {
    let selected: Attack | null = null;
    const promptBlocked = blockCannotUseAttacksNextTurn(player, pokemonCards, blocked);
    yield store.prompt(
      state,
      new ChooseAttackPrompt(promptPlayerId ?? player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, {
        allowCancel,
        blocked: promptBlocked,
      }),
      (result: Attack | null) => {
        selected = result;
        next();
      },
    );

    if (selected === null) {
      return state;
    }

    const copiedAttack: Attack = selected;

    if (isAttackLockedNextTurn(player, copiedAttack)) {
      if (retry + 1 >= maxRetries) {
        return state;
      }
      continue;
    }

    if (disallowCopycatAttack && copiedAttack.copycatAttack === true) {
      return state;
    }

    const sourceCard = findPokemonCardForAttack(pokemonCards, copiedAttack);
    if (sourceCard === undefined) {
      return state;
    }

    try {
      return yield* runDelegatedCopiedAttackGenerator(next, {
        store,
        state,
        player,
        opponent,
        copycatCard,
        sourceCard,
        selectedAttack: copiedAttack,
        sourceSlot: effect.source,
      });
    } catch {
      if (retry + 1 >= maxRetries) {
        return state;
      }
    }
  }

  return state;
}

/**
 * "Choose an attack from the given Pokémon list and use it as this attack."
 */
export function COPY_ATTACK_FROM_POKEMON_LIST(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  pokemonCards: Card[],
  options: CopyAttackFromListOptions = {},
): State {
  const generator = copyAttackFromPokemonListGenerator(
    () => generator.next(), store, state, effect, pokemonCards, options,
  );
  return generator.next().value;
}

export interface CopyOpponentActiveAndBenchOptions {
  allowCancel?: boolean;
  disallowCopycatAttack?: boolean;
  /** Exclude opponent active and/or bench entries by predicate. */
  filter?: (cardList: PokemonCardList, card: PokemonCard) => boolean;
}

/**
 * Choose 1 attack from opponent's Active or Benched Pokémon.
 */
export function COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  options: CopyOpponentActiveAndBenchOptions = {},
): State {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const { filter } = options;

  const targets: PokemonCardList[] = [opponent.active];
  opponent.bench.forEach(b => {
    if (b.cards.length > 0) {
      targets.push(b);
    }
  });

  const pokemonCards: PokemonCard[] = [];
  for (const cardList of targets) {
    const card = cardList.getPokemonCard();
    if (card === undefined) {
      continue;
    }
    if (filter && !filter(cardList, card)) {
      continue;
    }
    pokemonCards.push(card);
  }

  return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, pokemonCards, {
    allowCancel: options.allowCancel ?? false,
    disallowCopycatAttack: options.disallowCopycatAttack ?? true,
  });
}

export interface CopyBenchAttackViaListOptions extends CopyAttackFromListOptions {
  throwIfNoBenchedPokemon?: boolean;
}

/**
 * Choose benched Pokémon then attack — wraps COPY_ATTACK_FROM_POKEMON_LIST.
 */
function* copyBenchThenAttackGenerator(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  options: CopyBenchAttackViaListOptions,
): IterableIterator<State> {
  const player = effect.player;
  const { allowCancel = false, throwIfNoBenchedPokemon = true } = options;

  const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);
  if (!hasBenchedPokemon) {
    if (throwIfNoBenchedPokemon) {
      throw new GameError(GameMessage.CANNOT_USE_ATTACK);
    }
    return state;
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel },
    ),
    (results) => {
      targets = results || [];
      next();
    },
  );

  if (targets.length === 0) {
    return state;
  }

  const benchedCard = targets[0].getPokemonCard();
  if (benchedCard === undefined || benchedCard.attacks.length === 0) {
    return state;
  }

  return yield* copyAttackFromPokemonListGenerator(
    next, store, state, effect, [benchedCard], options,
  );
}

export function COPY_BENCH_ATTACK_FROM_LIST(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  options: CopyBenchAttackViaListOptions = {},
): State {
  const generator = copyBenchThenAttackGenerator(
    () => generator.next(), store, state, effect, options,
  );
  return generator.next().value;
}

/**
 * Metronome-style copy with up to 3 retries on failure.
 */
export function COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
): State {
  const opponent = StateUtils.getOpponent(state, effect.player);
  const pokemonCard = opponent.active.getPokemonCard();
  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }
  return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, [pokemonCard], {
    allowCancel: false,
    maxRetries: 3,
  });
}

export interface BuildAttackListOptions {
  /** Only include Pokémon matching this predicate. */
  filter?: (cardList: PokemonCardList, card: PokemonCard) => boolean;
  /** Also scan the opponent's in-play Pokémon. */
  includeOpponent?: boolean;
  /** Pokémon not in play (discard pile, Lost Zone, evolution stack, etc.). */
  extraCards?: PokemonCard[];
}

/**
 * Build attack prompt data with energy-cost blocking for ability-based copy effects.
 */
export function buildAttackListWithEnergyBlocking(
  state: State,
  store: StoreLike,
  player: Player,
  options: BuildAttackListOptions = {},
): { pokemonCards: PokemonCard[]; blocked: { index: number; attack: string }[] } {
  const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
  store.reduceEffect(state, checkProvidedEnergyEffect);
  const energyMap = checkProvidedEnergyEffect.energyMap;

  const pokemonCards: PokemonCard[] = [];
  const blocked: { index: number; attack: string }[] = [];

  const addCardWithBlocking = (card: PokemonCard) => {
    const affordableAttacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
    });

    const index = pokemonCards.length;
    pokemonCards.push(card);
    const locked = new Set(player.active.cannotUseAttacksNextTurn || []);
    card.attacks.forEach(attack => {
      if (!affordableAttacks.includes(attack) || locked.has(attack.name)) {
        blocked.push({ index, attack: attack.name });
      }
    });
  };

  const scanInPlay = (scanPlayer: Player) => {
    scanPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const card = cardList.getPokemonCard();
      if (card === undefined) {
        return;
      }
      if (options.filter && !options.filter(cardList, card)) {
        return;
      }
      addCardWithBlocking(card);
    });
  };

  scanInPlay(player);

  if (options.includeOpponent) {
    scanInPlay(StateUtils.getOpponent(state, player));
  }

  if (options.extraCards) {
    for (const card of options.extraCards) {
      addCardWithBlocking(card);
    }
  }

  return { pokemonCards, blocked };
}

export interface CopyAttackViaAbilityOptions extends BuildAttackListOptions {
  copycatCard: PokemonCard;
  allowCancel?: boolean;
  /** When false, the copycat may be on the Bench while another Pokémon is Active. Default true. */
  requireActiveCopycat?: boolean;
}

/**
 * Ability: choose an attack from in-play Pokémon (with energy blocking) and use it.
 * Runs through UseAttackEffect with delegateFrom so energy/status checks apply.
 */
export function COPY_ATTACK_VIA_ABILITY(
  store: StoreLike,
  state: State,
  effect: PowerEffect,
  options: CopyAttackViaAbilityOptions,
): State {
  const player = effect.player;
  const { copycatCard, allowCancel = true, requireActiveCopycat = true } = options;

  if (requireActiveCopycat && player.active.getPokemonCard() !== copycatCard) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const { pokemonCards, blocked } = buildAttackListWithEnergyBlocking(
    state, store, player, options,
  );

  if (pokemonCards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  return store.prompt(
    state,
    new ChooseAttackPrompt(
      player.id,
      GameMessage.CHOOSE_ATTACK_TO_COPY,
      pokemonCards,
      { allowCancel, blocked },
    ),
    attack => {
      if (attack === null) {
        return state;
      }
      if (isAttackLockedNextTurn(player, attack)) {
        return state;
      }
      const sourceCard = findPokemonCardForAttack(pokemonCards, attack);
      if (sourceCard === undefined) {
        return state;
      }
      const useAttackEffect = new UseAttackEffect(player, attack);
      useAttackEffect.delegateFrom = sourceCard;
      useAttackEffect.source = player.active;
      return store.reduceEffect(state, useAttackEffect);
    },
  );
}
