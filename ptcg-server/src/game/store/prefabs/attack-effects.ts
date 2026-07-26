import { Card, CardTarget, ChooseCardsPrompt, ChooseEnergyPrompt, ChoosePokemonPrompt, ConfirmPrompt, DamageMap, GameMessage, MoveEnergyPrompt, PlayerType, PutDamagePrompt, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../..';
import { CardType, SpecialCondition, SuperType, TrainerType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { AddSpecialConditionsEffect, AfterDamageEffect, ApplyWeaknessEffect, CardsToHandEffect, DealDamageEffect, DiscardCardsEffect, DiscardCardsFromOpponentsActivePokemonEffect, DiscardDefendingPokemonEffect, HealTargetEffect, KnockOutOpponentEffect, KnockOutPlayerEffect, MoveOpponentEnergyEffect, PutCountersEffect, PutDamageEffect } from '../effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { AfterAttackEffect, BeforeDoingDamageEffect, EndTurnEffect } from '../effects/game-phase-effects';
import { Effect } from '../effects/effect';
import { PokemonCardList } from '../state/pokemon-card-list';
import { AttachEnergyEffect } from '../effects/play-card-effects';
import { PendingEndOfTurnEffect, PendingEndOfTurnEffectBase } from '../state/pending-end-of-turn-effects';
import { Player } from '../state/player';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, MOVE_CARDS } from './prefabs';
import { CoinFlipEffect } from '../effects/play-card-effects';


/**
 * These prefabs are for general attack effects.
 */

export function DISCARD_A_STADIUM_CARD_IN_PLAY(
  state: State
) {
  const stadiumCard = StateUtils.getStadiumCard(state);
  if (stadiumCard !== undefined) {

    const cardList = StateUtils.findCardList(state, stadiumCard);
    const player = StateUtils.findOwner(state, cardList);
    cardList.moveTo(player.discard);
  }
}

export function DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(
  x: number,
  effect: AttackEffect,
  state: State
) {
  const player = effect.player;

  const cardsToDraw = x - player.hand.cards.length;
  if (cardsToDraw <= 0) {
    return state;
  }

  player.deck.moveTo(player.hand, cardsToDraw);
}

export function HEAL_X_DAMAGE_FROM_THIS_POKEMON(
  damage: number,
  effect: AttackEffect,
  store: StoreLike,
  state: State
) {
  const player = effect.player;
  const healTargetEffect = new HealTargetEffect(effect, damage);
  healTargetEffect.target = player.active;
  state = store.reduceEffect(state, healTargetEffect);
}

export function KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  target?: PokemonCardList,
): State {
  const knockOutEffect = new KnockOutOpponentEffect(effect);
  knockOutEffect.target = target ?? effect.opponent.active;
  return store.reduceEffect(state, knockOutEffect);
}

/**
 * Knock Out your Active Pokémon (or another of your Pokémon via target).
 * Your opponent takes the Prize cards. Blockable by effects like Mist Energy.
 */
export function KNOCK_OUT_PLAYERS_ACTIVE_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  target?: PokemonCardList,
): State {
  const knockOutEffect = new KnockOutPlayerEffect(effect);
  knockOutEffect.target = target ?? effect.player.active;
  return store.reduceEffect(state, knockOutEffect);
}

/**
 * Discard the opponent's Active Pokémon and all cards attached to it.
 * Not a KO — no prizes are taken. Blockable by effects like Mist Energy.
 */
export function DISCARD_OPPONENTS_ACTIVE_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  target?: PokemonCardList,
): State {
  const discardEffect = new DiscardDefendingPokemonEffect(effect);
  discardEffect.target = target ?? effect.opponent.active;
  return store.reduceEffect(state, discardEffect);
}

/**
 * "At the end of your opponent's next turn, the Defending Pokémon will be Knocked Out."
 * Schedules a blockable KnockOutOpponentEffect to resolve when that turn ends.
 */
export function KNOCK_OUT_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(
  effect: AttackEffect,
  source: PokemonCard,
  target?: PokemonCardList,
): void {
  scheduleDefendingPokemonEffectAtEndOfOpponentsNextTurn(effect, source, { type: 'knock_out' }, target);
}

/**
 * "At the end of your opponent's next turn, discard the Defending Pokémon and all cards attached to it."
 * Not a KO — no prizes are taken.
 */
export function DISCARD_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(
  effect: AttackEffect,
  source: PokemonCard,
  target?: PokemonCardList,
): void {
  scheduleDefendingPokemonEffectAtEndOfOpponentsNextTurn(effect, source, { type: 'discard' }, target);
}

/**
 * "Put X damage counters on the Defending Pokémon at the end of your opponent's next turn."
 * Damage is specified in counter units (10 per counter).
 */
export function PUT_DAMAGE_COUNTERS_ON_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(
  effect: AttackEffect,
  source: PokemonCard,
  damage: number,
  target?: PokemonCardList,
): void {
  scheduleDefendingPokemonEffectAtEndOfOpponentsNextTurn(
    effect, source, { type: 'damage_counters', damage }, target,
  );
}

/**
 * "At the end of your opponent's next turn, the Defending Pokémon is now [condition]."
 */
export function APPLY_SPECIAL_CONDITION_TO_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(
  effect: AttackEffect,
  source: PokemonCard,
  specialCondition: SpecialCondition,
  target?: PokemonCardList,
): void {
  scheduleDefendingPokemonEffectAtEndOfOpponentsNextTurn(
    effect, source, { type: 'special_condition', specialCondition }, target,
  );
}

function scheduleDefendingPokemonEffectAtEndOfOpponentsNextTurn(
  effect: AttackEffect,
  source: PokemonCard,
  pending: Pick<PendingEndOfTurnEffect, 'type'> & (
    | { type: 'knock_out' }
    | { type: 'discard' }
    | { type: 'damage_counters'; damage: number }
    | { type: 'special_condition'; specialCondition: SpecialCondition }
  ),
  target?: PokemonCardList,
): void {
  effect.opponent.pendingEndOfTurnEffects.push({
    target: target ?? effect.opponent.active,
    attack: effect.attack,
    sourceCard: source,
    attackerPlayerId: effect.player.id,
    ...pending,
  } as PendingEndOfTurnEffect);
}

function buildAttackEffectFromSource(
  state: State,
  defendingPlayer: Player,
  item: Pick<PendingEndOfTurnEffectBase, 'attack' | 'sourceCard' | 'attackerPlayerId'>,
): AttackEffect | null {
  const attacker = state.players.find(p => p.id === item.attackerPlayerId);
  if (!attacker) {
    return null;
  }

  let sourceList = attacker.active;
  attacker.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    if (card === item.sourceCard) {
      sourceList = cardList;
    }
  });

  const attackEffect = new AttackEffect(attacker, defendingPlayer, item.attack);
  attackEffect.source = sourceList;
  return attackEffect;
}

function buildAttackEffectFromPending(
  state: State,
  defendingPlayer: Player,
  item: PendingEndOfTurnEffect,
): AttackEffect | null {
  return buildAttackEffectFromSource(state, defendingPlayer, item);
}

/**
 * Places pending damage counters on the Defending Pokémon when Energy is attached from hand.
 */
export function RESOLVE_PENDING_ENERGY_ATTACH_DAMAGE_COUNTERS(
  store: StoreLike,
  state: State,
  attachEffect: AttachEnergyEffect,
): State {
  const pending = attachEffect.target.pendingEnergyAttachDamageCounters;
  if (!pending) {
    return state;
  }
  if (!attachEffect.player.hand.cards.includes(attachEffect.energyCard)) {
    return state;
  }

  const attackEffect = buildAttackEffectFromSource(state, attachEffect.player, pending);
  if (!attackEffect) {
    return state;
  }

  const putCounters = new PutCountersEffect(attackEffect, pending.damage);
  putCounters.target = attachEffect.target;
  return store.reduceEffect(state, putCounters);
}

/**
 * Resolves pending end-of-turn effects for the player whose turn just ended.
 * Called automatically from the EndTurnEffect reducer.
 */
export function RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_EFFECTS(
  store: StoreLike,
  state: State,
  effect: Effect,
): State {
  if (!(effect instanceof EndTurnEffect)) {
    return state;
  }

  const pending = effect.player.pendingEndOfTurnEffects.splice(0);
  for (const item of pending) {
    if (!item.target.getPokemonCard()) {
      continue;
    }

    const attackEffect = buildAttackEffectFromPending(state, effect.player, item);
    if (!attackEffect) {
      continue;
    }

    switch (item.type) {
      case 'knock_out': {
        const ko = new KnockOutOpponentEffect(attackEffect);
        ko.target = item.target;
        state = store.reduceEffect(state, ko);
        break;
      }
      case 'discard': {
        const discard = new DiscardDefendingPokemonEffect(attackEffect);
        discard.target = item.target;
        state = store.reduceEffect(state, discard);
        break;
      }
      case 'damage_counters': {
        const putCounters = new PutCountersEffect(attackEffect, item.damage);
        putCounters.target = item.target;
        state = store.reduceEffect(state, putCounters);
        break;
      }
      case 'special_condition': {
        const sc = new AddSpecialConditionsEffect(attackEffect, [item.specialCondition]);
        sc.target = item.target;
        state = store.reduceEffect(state, sc);
        break;
      }
    }
  }

  return state;
}

/** @deprecated Use RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_EFFECTS */
export const RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_KNOCK_OUTS =
  RESOLVE_PENDING_END_OF_OPPONENTS_NEXT_TURN_EFFECTS;

export function PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(
  x: number,
  filterFn: (card: Card) => boolean = () => true,
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const player = effect.player;

  const cardCount = player.discard.cards.filter(filterFn).length;

  if (cardCount === 0) {
    return state;
  }

  const max = Math.min(x, cardCount);
  const min = max;

  return store.prompt(state, [
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      // TODO: Make this work for more than just Items!
      player.discard,
      { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
      { min, max, allowCancel: false }
    )], selected => {
      const cards = selected || [];
      player.discard.moveCardsTo(cards, player.hand);
    });
}

export function PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(
  x: number,
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const activeDamageEffect = new PutCountersEffect(effect, 10 * x);
  activeDamageEffect.target = opponent.active;
  store.reduceEffect(state, activeDamageEffect);

  opponent.bench.forEach((bench, index) => {
    if (bench.cards.length > 0) {
      const damageEffect = new PutCountersEffect(effect, 10 * x);
      damageEffect.target = bench;
      store.reduceEffect(state, damageEffect);
    }
  });
}

export function PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(
  x: number,
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const putCounters = new PutCountersEffect(effect, 10 * x);
  putCounters.target = opponent.active;
  return store.reduceEffect(state, putCounters);
}

export function PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(
  x: number,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  slotTypes: SlotType[] = [SlotType.ACTIVE, SlotType.BENCH]
) {
  const player = effect.player;
  const opponent = effect.opponent;

  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched && !slotTypes.includes(SlotType.ACTIVE)) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: 9999 });
  });

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    slotTypes,
    10 * x,
    maxAllowedDamage,
    { allowCancel: false }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
    }
  });
}

export function SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(
  store: StoreLike,
  state: State,
  effect: AfterAttackEffect) {
  const player = effect.player;

  // Get all Pokemon cards (including evolutions)
  const pokemons = player.active.getPokemons();

  // Get other attached cards (energy, etc.) but not Pokemon or tools
  const otherCards = player.active.cards.filter(card =>
    !(card instanceof PokemonCard) &&
    !pokemons.includes(card as PokemonCard) &&
    (!player.active.tools || !player.active.tools.includes(card))
  );

  // Get tools separately
  const tools = [...player.active.tools];

  // Clear effects from the Pokemon
  player.active.clearEffects();

  // Move other cards (energy) to deck
  if (otherCards.length > 0) {
    MOVE_CARDS(store, state, player.active, player.deck, { cards: otherCards });
  }

  // Move tools to deck explicitly
  for (const tool of tools) {
    player.active.moveCardTo(tool, player.deck);
  }

  // Move Pokemon cards to deck
  if (pokemons.length > 0) {
    MOVE_CARDS(store, state, player.active, player.deck, { cards: pokemons });
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export function PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND(
  store: StoreLike,
  state: State,
  effect: AfterAttackEffect) {
  const player = effect.player;

  // Get all Pokemon cards (including evolutions)
  const pokemons = player.active.getPokemons();

  // Get other attached cards (energy, etc.) but not Pokemon or tools
  const otherCards = player.active.cards.filter(card =>
    !(card instanceof PokemonCard) &&
    !pokemons.includes(card as PokemonCard) &&
    (!player.active.tools || !player.active.tools.includes(card))
  );

  // Get tools separately
  const tools = [...player.active.tools];

  // Clear effects from the Pokemon
  player.active.clearEffects();

  // Move other cards (energy) to deck
  if (otherCards.length > 0) {
    MOVE_CARDS(store, state, player.active, player.hand, { cards: otherCards });
  }

  // Move tools to deck explicitly
  for (const tool of tools) {
    player.active.moveCardTo(tool, player.hand);
  }

  // Move Pokemon cards to deck
  if (pokemons.length > 0) {
    MOVE_CARDS(store, state, player.active, player.hand, { cards: pokemons });
  }
}

export function FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  amount: number
): State {
  const coinFlip = new CoinFlipEffect(effect.player, (result: boolean) => {
    if (result) {
      effect.damage += amount;
    }
  });
  return store.reduceEffect(state, coinFlip);
}

export function FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  damagePerHeads: number
): State {
  return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => {
    effect.damage = damagePerHeads * heads;
  });
}

export function FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  damagePerHeads: number
): State {
  return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => {
    effect.damage += damagePerHeads * heads;
  });
}

export function THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  amount: number,
) {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const applyWeakness = new ApplyWeaknessEffect(effect, effect.damage);
  store.reduceEffect(state, applyWeakness);
  const damage = applyWeakness.damage;

  effect.damage = 0;

  if (damage > 0) {
    opponent.active.damage += damage;
    const afterDamage = new AfterDamageEffect(effect, damage);
    state = store.reduceEffect(state, afterDamage);
  }
}

export function THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(
  damage: number,
  filterFn: (card: PokemonCard) => boolean = () => true,
  effect: AttackEffect
) {
  const player = effect.player;

  let pokemonCount = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof PokemonCard && filterFn(c)) {
      pokemonCount += 1;
    }
  });

  effect.damage = pokemonCount * damage;
}

export function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(
  damage: number,
  effect: AttackEffect,
  store: StoreLike,
  state: State
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const targets = opponent.getPokemonInPlay();
  if (targets.length === 0)
    return state;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
  ), selected => {
    const target = selected[0];
    let damageEffect: DealDamageEffect | PutDamageEffect;
    if (target === opponent.active) {
      damageEffect = new DealDamageEffect(effect, damage);
    } else {
      damageEffect = new PutDamageEffect(effect, damage);
    }
    damageEffect.target = target;
    store.reduceEffect(state, damageEffect);
  });
}

export function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(
  damage: number,
  effect: AttackEffect,
  store: StoreLike,
  state: State
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const targets = opponent.bench.filter(b => b.cards.length > 0);
  if (targets.length === 0) {
    return state;
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
  ), selected => {
    const target = selected[0];
    const damageEffect = new PutDamageEffect(effect, damage);
    damageEffect.target = target;
    store.reduceEffect(state, damageEffect);
  });
}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [SpecialCondition.ASLEEP]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [SpecialCondition.BURNED]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [SpecialCondition.CONFUSED]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [SpecialCondition.PARALYZED]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [SpecialCondition.POISONED]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_POKEMON(
  store: StoreLike,
  state: State,
  effect: BeforeDoingDamageEffect,
  cards: Card[]
): State {
  if (cards.length === 0) {
    return state;
  }

  const discardEffect = new DiscardCardsFromOpponentsActivePokemonEffect(effect.attackEffect, cards);
  return store.reduceEffect(state, discardEffect);
}

export function DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const energyCards = opponent.active.cards.filter(c => c.superType === SuperType.ENERGY);
  if (energyCards.length === 0) {
    return state;
  }

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    const cards = selected || [];
    if (cards.length > 0) {
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = opponent.active;
      store.reduceEffect(state, discardEnergy);
    }
  });
}

/**
 * You may put up to X Energy attached to your opponent's Active Pokémon into their hand.
 * Uses CardsToHandEffect (AbstractAttackEffect) so abilities like Charmeleon's Flare Veil can block it.
 */
export function PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  options?: { count?: number }
): State {
  const count = options?.count ?? 1;
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
  state = store.reduceEffect(state, checkEnergy);

  if (checkEnergy.energyMap.length === 0) {
    return state;
  }

  const cost = Array(count).fill(CardType.COLORLESS);

  return store.prompt(state, new ConfirmPrompt(
    player.id,
    GameMessage.WANT_TO_USE_ABILITY,
  ), wantToUse => {
    if (wantToUse) {
      const selectCount = Math.min(count, checkEnergy.energyMap.length);
      store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_HAND,
        checkEnergy.energyMap,
        cost.slice(0, selectCount),
        { allowCancel: false }
      ), energy => {
        const cards = (energy || []).slice(0, selectCount).map(e => e.card);
        if (cards.length > 0) {
          const toHandEffect = new CardsToHandEffect(effect, cards);
          toHandEffect.target = opponent.active;
          store.reduceEffect(state, toHandEffect);
        }
      });
    }
  });
}

export interface MoveOpponentEnergyOptions {
  min?: number;
  max?: number;
  allowCancel?: boolean;
  blockedFrom?: CardTarget[];
  blockedTo?: CardTarget[];
}

/**
 * Move an Energy from 1 of your opponent's Pokémon to another of their Pokémon.
 * Uses MoveOpponentEnergyEffect (AbstractAttackEffect) so abilities like Charmeleon's Flare Veil can block it.
 */
export function MOVE_AN_ENERGY_FROM_OPPONENTS_POKEMON_TO_ANOTHER(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  options?: MoveOpponentEnergyOptions
): State {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let hasEnergy = false;
  let pokemonCount = 0;

  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
    pokemonCount += 1;
    const energyAttached = cardList.cards.some(c => c instanceof EnergyCard);
    hasEnergy = hasEnergy || energyAttached;
  });

  if (!hasEnergy || pokemonCount <= 1) {
    return state;
  }

  const min = options?.min ?? 1;
  const max = options?.max ?? 1;
  const allowCancel = options?.allowCancel ?? false;
  const blockedFrom = options?.blockedFrom ?? [];
  const blockedTo = options?.blockedTo ?? [];

  return store.prompt(state, new MoveEnergyPrompt(
    player.id,
    GameMessage.MOVE_ENERGY_CARDS,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { superType: SuperType.ENERGY },
    { min, max, allowCancel, blockedFrom, blockedTo }
  ), result => {
    const transfers = result || [];
    transfers.forEach(transfer => {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const destination = StateUtils.getTarget(state, player, transfer.to);
      const moveEffect = new MoveOpponentEnergyEffect(effect, transfer.card, source, destination);
      store.reduceEffect(state, moveEffect);
    });
  });
}
