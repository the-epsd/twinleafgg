import { AttachEnergyOptions, AttachEnergyPrompt, Card, CardList, ChooseCardsOptions, ChooseCardsPrompt, ChoosePokemonPrompt, ChoosePrizePrompt, CoinFlipPrompt, ConfirmPrompt, EnergyCard, GameError, GameLog, GameMessage, Player, PlayerType, PokemonCardList, PowerType, SelectPrompt, ShowCardsPrompt, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike, TrainerCard } from '../..';
import { TrainerEffect, AttachEnergyEffect, ToolEffect } from '../effects/play-card-effects';
import { BoardEffect, CardTag, SpecialCondition, Stage, SuperType, TrainerType } from '../card/card-types';
import { GamePhase } from '../state/state';
import { PokemonCard } from '../card/pokemon-card';
import { ApplyWeaknessEffect, DealDamageEffect, DiscardCardsEffect, HealTargetEffect, PutDamageEffect } from '../effects/attack-effects';
import { AddSpecialConditionsPowerEffect, CheckHpEffect, CheckPrizesDestinationEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { AttackEffect, DrawPrizesEffect, EvolveEffect, KnockOutEffect, PowerEffect, RetreatEffect, SpecialEnergyEffect } from '../effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../effects/game-phase-effects';
import { MoveCardsEffect } from '../effects/game-effects';
import { preventRetreatEffect, preventDamageEffect } from '../effects/effect-of-attack-effects';
import { GameStatsTracker } from '../game-stats-tracker';

/**
 * 
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
export function WAS_ATTACK_USED(effect: Effect, index: number, user: PokemonCard): effect is AttackEffect {
  return effect instanceof AttackEffect && effect.attack === user.attacks[index];
}

export function DEAL_DAMAGE(effect: Effect): effect is DealDamageEffect {
  return effect instanceof DealDamageEffect;
}

export function PUT_DAMAGE(effect: Effect): effect is PutDamageEffect {
  return effect instanceof PutDamageEffect;
}

/**
 * 
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
export function WAS_POWER_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect {
  return effect instanceof PowerEffect && effect.power === user.powers[index];
}

export const AFTER_ATTACK = (effect: Effect, index: number, user: PokemonCard): effect is AfterAttackEffect => {
  return effect instanceof AfterAttackEffect && effect.attack === user.attacks[index];
};


/**
 * 
 * Checks whether or not the Pokemon just evolved.
 * @returns whether or not `effect` is an evolve effect from this card.
 */
export function JUST_EVOLVED(effect: Effect, card: PokemonCard): effect is EvolveEffect {
  return effect instanceof EvolveEffect && effect.pokemonCard === card;
}

/**
 * Adds the "ability used" board effect to the given Pokemon. 
 */
export function ABILITY_USED(player: Player, card: PokemonCard) {
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    if (cardList.getPokemonCard() === card) {
      cardList.addBoardEffect(BoardEffect.ABILITY_USED);
    }
  });
}

/**
 * 
 * A basic effect for checking whether or not a passive ability gets activated.
 * @returns whether or not a passive ability was activated.
 */
export function PASSIVE_ABILITY_ACTIVATED(effect: Effect, user: PokemonCard) {
  return effect instanceof KnockOutEffect && effect.target.cards.includes(user);
}

/**
 * 
 * @param state is the game state.
 * @returns the game state after discarding a stadium card in play.
 */
export function DISCARD_A_STADIUM_CARD_IN_PLAY(state: State) {
  const stadiumCard = StateUtils.getStadiumCard(state);
  if (stadiumCard !== undefined) {

    const cardList = StateUtils.findCardList(state, stadiumCard);
    const player = StateUtils.findOwner(state, cardList);
    cardList.moveTo(player.discard);
  }
}

/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
export function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store: StoreLike, state: State, player: Player, filter: Partial<PokemonCard> = {}, options: Partial<ChooseCardsOptions> = {}) {
  BLOCK_IF_DECK_EMPTY(player);
  const slots = GET_PLAYER_BENCH_SLOTS(player);
  BLOCK_IF_NO_SLOTS(slots);
  filter.superType = SuperType.POKEMON;

  return store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, filter, options,
  ), selected => {
    const cards = selected || [];
    cards.forEach((card, index) => {
      player.deck.moveCardTo(card, slots[index]);
      slots[index].pokemonPlayedTurn = state.turn;
    });
    SHUFFLE_DECK(store, state, player);
  });
}

/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
export function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store: StoreLike, state: State, player: Player, filter: Partial<PokemonCard> = {}, options: Partial<ChooseCardsOptions> = {}) {
  BLOCK_IF_DECK_EMPTY(player);
  const opponent = StateUtils.getOpponent(state, player);
  filter.superType = SuperType.POKEMON;

  return store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, filter, options,
  ), selected => {
    const cards = selected || [];
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
    SHUFFLE_DECK(store, state, player);
  });
}

export function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number) {
  effect.damage += damage;
  return state;
}

export function GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(player: Player, store: StoreLike, state: State) {
  let totalEnergy = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    checkProvidedEnergyEffect.energyMap.forEach(energy => {
      totalEnergy += 1;
    });
  });

  return totalEnergy;
}

export function DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect: AttackEffect, state: State, damage: number, ...cardTags: CardTag[]) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  const opponentActive = opponent.active.getPokemonCard();
  let includesAnyTags = false;
  for (const tag of cardTags) {
    if (opponentActive && opponentActive.tags.includes(tag)) {
      includesAnyTags = true;
    }
  }

  if (includesAnyTags) {
    effect.damage += damage;
  }
}

export function DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect: AttackEffect, state: State, damage: number) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  effect.damage = effect.attack.damage + (opponent.prizesTaken * damage);
}

export function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect: AttackEffect, store: StoreLike, state: State, damage: number) {
  const player = effect.player;
  const healTargetEffect = new HealTargetEffect(effect, damage);
  healTargetEffect.target = player.active;
  state = store.reduceEffect(state, healTargetEffect);
  return state;
}

export function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect: AttackEffect, user: PokemonCard) {
  // TODO: Would like to check if Pokemon has damage without needing the effect
  const player = effect.player;
  const source = player.active;

  // Check if source Pokemon has damage
  const damage = source.damage;
  return damage > 0;
}

export function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect: Effect, state: State): effect is KnockOutEffect {
  // TODO: this shouldn't work for attacks with damage counters, but I think it will
  return effect instanceof KnockOutEffect;
}

export interface TakeSpecificPrizesOptions {
  destination?: CardList;
  skipReduce?: boolean;
}

export interface TakeXPrizesOptions extends TakeSpecificPrizesOptions {
  promptOptions?: {
    allowCancel?: boolean;
    blocked?: number[];
  };
}

export function TAKE_SPECIFIC_PRIZES(
  store: StoreLike,
  state: State,
  player: Player,
  prizes: CardList[],
  options: TakeSpecificPrizesOptions = {}
): void {
  let { destination = player.hand } = options;
  const { skipReduce = false } = options;
  let preventDefault: boolean = false;

  if (!skipReduce) {
    const drawPrizesEffect = new DrawPrizesEffect(
      player,
      prizes,
      destination
    );

    // Reduce the prizes destination for effects that override it and take place before any
    // DrawPrizesEffect is processed (e.g. Barbaracle LOR)
    const prizesDestinationEffect = new CheckPrizesDestinationEffect(player, drawPrizesEffect.destination);
    store.reduceEffect(state, prizesDestinationEffect);

    // If nothing prevented the override, apply the new destination
    if (!prizesDestinationEffect.preventDefault) {
      drawPrizesEffect.destination = prizesDestinationEffect.destination;
    }

    // Process the actual DrawPrizesEffect
    store.reduceEffect(state, drawPrizesEffect);

    preventDefault = drawPrizesEffect.preventDefault;
    destination = drawPrizesEffect.destination;
  } else {
    destination = player.hand;
  }

  if (!preventDefault) {
    let prizesTakenCount = 0;
    prizes.forEach(prize => {
      if (player.prizes.includes(prize)) {
        prize.moveTo(destination);

        if (destination === player.hand) {
          // If the destination is the hand, we've "taken" a prize
          player.prizesTaken += 1;
          player.prizesTakenThisTurn += 1;
          prizesTakenCount += 1;
        }
      }
    });

    // Track accurate prize count using GameStatsTracker
    if (prizesTakenCount > 0) {
      GameStatsTracker.trackPrizeTaken(player, prizesTakenCount);
    }
  }
}

export function TAKE_X_PRIZES(
  store: StoreLike,
  state: State,
  player: Player,
  count: number,
  options: TakeXPrizesOptions = {},
  callback?: (chosenPrizes: CardList[]) => void
): State {
  const { promptOptions = {}, ...takeOptions } = options;

  state = store.prompt(state, new ChoosePrizePrompt(
    player.id,
    GameMessage.CHOOSE_PRIZE_CARD,
    { count, allowCancel: false, ...promptOptions }
  ), result => {
    TAKE_SPECIFIC_PRIZES(store, state, player, result, takeOptions);
    if (callback) callback(result);
  });

  return state;
}

export function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State) {
  effect.prizeCount += 1;
  return state;
}

export function PLAY_POKEMON_FROM_HAND_TO_BENCH(state: State, player: Player, card: Card) {
  const slot = GET_FIRST_PLAYER_BENCH_SLOT(player);
  player.hand.moveCardTo(card, slot);
  slot.pokemonPlayedTurn = state.turn;
}

export function DEVOLVE_POKEMON(store: StoreLike, state: State, target: PokemonCardList, destination: CardList) {
  const pokemons = target.getPokemons();
  const pokemonCard = target.getPokemonCard();

  // Weird ass lv.x stuff (yes this is actually the way it works: https://www.pokebeach.com/forums/threads/devolving-lvl-x.34943/)
  if (pokemonCard?.tags.includes(CardTag.POKEMON_LV_X)) {
    // The lv.x is on a basic -> do nothing
    if (pokemons.length === 2 && pokemons.some(p => p.stage === Stage.BASIC)) {
      return state;
    } else {
      const cardsToDevolve = pokemons.filter(p => p.name === pokemonCard.name);
      MOVE_CARDS(store, state, target, destination, { cards: cardsToDevolve });
      target.clearEffects();
      target.pokemonPlayedTurn = state.turn;
    }
    return state;
  }

  // Handle normal devolutions
  if (pokemons.length > 1 && !pokemonCard?.tags.includes(CardTag.POKEMON_VUNION) && !pokemonCard?.tags.includes(CardTag.LEGEND)) {
    MOVE_CARD_TO(state, pokemonCard as Card, destination);
    target.clearEffects();
    target.pokemonPlayedTurn = state.turn;
  }
}

export function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, min: number, max: number, applyWeaknessAndResistance: boolean = false, slots?: SlotType[]) {
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
    slots ?? [SlotType.BENCH],
    { min: min, max: max, allowCancel: false }
  ), selected => {
    selected.forEach(target => {
      const damageEffect = new PutDamageEffect(effect, damage);
      damageEffect.target = target;

      if (applyWeaknessAndResistance && damage > 0) {
        const applyWeakness = new ApplyWeaknessEffect(effect, damage);
        applyWeakness.target = target; // Fix: should be the current target, not effect.target
        state = store.reduceEffect(state, applyWeakness);
        damageEffect.damage = applyWeakness.damage; // Fix: update the damage for this damageEffect, not effect.damage
      }

      store.reduceEffect(state, damageEffect);
    });
  });
}

export function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store: StoreLike, state: State, effect: AttackEffect, amount: number) {
  const dealDamage = new DealDamageEffect(effect, amount);
  dealDamage.target = effect.source;
  return store.reduceEffect(state, dealDamage);
}

export function DAMAGE_OPPONENT_POKEMON(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  damage: number,
  targets: PokemonCardList[]
) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  targets.forEach(target => {
    // Use DealDamageEffect if target is opponent's active Pokémon (applies Weakness/Resistance)
    if (target === opponent.active) {
      const damageEffect = new DealDamageEffect(effect, damage);
      damageEffect.target = target;
      store.reduceEffect(state, damageEffect);
    } else {
      // Use PutDamageEffect for benched Pokémon (doesn't apply Weakness/Resistance)
      const damageEffect = new PutDamageEffect(effect, damage);
      damageEffect.target = target;
      store.reduceEffect(state, damageEffect);
    }
  });
}

export function ATTACH_ENERGY_PROMPT(store: StoreLike, state: State, player: Player, playerType: PlayerType, sourceSlot: SlotType, destinationSlots: SlotType[], filter: Partial<EnergyCard> = {}, options: Partial<AttachEnergyOptions> = {}): State {
  filter.superType = SuperType.ENERGY;
  const source = player.getSlot(sourceSlot);

  return store.prompt(state, new AttachEnergyPrompt(
    player.id, GameMessage.ATTACH_ENERGY_CARDS, source, playerType, destinationSlots, filter, options,
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      const energyCard = transfer.card as EnergyCard;
      const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
      store.reduceEffect(state, attachEnergyEffect);
    }
    if (sourceSlot === SlotType.DECK) {
      SHUFFLE_DECK(store, state, player);
    }
  });
}

export function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect: PowerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number): State {

  const player = effect.player;
  const hasEnergyInHand = player.hand.cards.some(c => {
    return c instanceof EnergyCard;
  });
  if (!hasEnergyInHand) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    { superType: SuperType.ENERGY },
    { allowCancel: false, min: minAmount, max: maxAmount }
  ), cards => {
    cards = cards || [];
    if (cards.length === 0) {
      return;
    }
    player.hand.moveCardsTo(cards, player.discard);
  });
}

export function DISCARD_ALL_ENERGY_FROM_POKEMON(store: StoreLike, state: State, effect: AttackEffect, card: Card) {
  const player = effect.player;
  const cardList = StateUtils.findCardList(state, card);
  if (!(cardList instanceof PokemonCardList))
    throw new GameError(GameMessage.INVALID_TARGET);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = cardList;
  store.reduceEffect(state, discardEnergy);
}

/**
 * A getter for the player's prize slots.
 * @returns A list of card lists containing the player's prize slots.
 */
export function GET_PLAYER_PRIZES(player: Player): CardList[] {
  return player.prizes.filter(p => p.cards.length > 0);
}


/**
 * A getter for all of a player's prizes.
 * @returns A Card[] of all the player's prize cards.
 */
export function GET_PRIZES_AS_CARD_ARRAY(player: Player): Card[] {
  const prizes = player.prizes.filter(p => p.cards.length > 0);
  const allPrizeCards: Card[] = [];
  prizes.forEach(p => allPrizeCards.push(...p.cards));
  return allPrizeCards;
}

/**
 * Shuffles the player's deck.
 */
export function SHUFFLE_DECK(store: StoreLike, state: State, player: Player): State {
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => player.deck.applyOrder(order));
}

/**
 * Puts a list of cards into the deck, then shuffles the deck.
 */
export function SHUFFLE_CARDS_INTO_DECK(store: StoreLike, state: State, player: Player, cards: Card[]) {
  cards.forEach(card => {
    player.deck.cards.unshift(card);
  });
  SHUFFLE_DECK(store, state, player);
}

/**
 * Shuffle the prize cards into the deck. 
 */
export function SHUFFLE_PRIZES_INTO_DECK(store: StoreLike, state: State, player: Player) {
  SHUFFLE_CARDS_INTO_DECK(store, state, player, GET_PRIZES_AS_CARD_ARRAY(player));
  GET_PLAYER_PRIZES(player).forEach(p => p.cards = []);
}

/**
 * Draws `count` cards, putting them into your hand.
 */
export function DRAW_CARDS(player: Player, count: number) {
  player.deck.moveTo(player.hand, Math.min(count, player.deck.cards.length));
}

/**
 * Draws up to `count` cards, letting the player choose to draw fewer than the maximum.
 * 
 * TODO: this should also allow the player to draw them 1 by 1 if they want
 */
export function DRAW_UP_TO_X_CARDS(store: StoreLike, state: State, player: Player, count: number) {
  if (count > 0) {
    const options: { message: string, value: number }[] = [];
    for (let i = count; i >= 0; i--) {
      options.push({ message: `Draw ${i} card(s)`, value: i });
    }

    store.prompt(state, new SelectPrompt(
      player.id,
      GameMessage.WANT_TO_DRAW_CARDS,
      options.map(c => c.message),
      { allowCancel: false }
    ), choice => {
      const numCardsToDraw = options[choice].value;
      DRAW_CARDS(player, numCardsToDraw);
    });
  }
}

/**
 * Draws cards until you have `count` cards in hand.
 */
export function DRAW_CARDS_UNTIL_CARDS_IN_HAND(player: Player, count: number) {
  player.deck.moveTo(player.hand, Math.max(count - player.hand.cards.length, 0));
}

/**
 * Draws `count` cards from the top of your deck as face down prize cards.
 */
export function DRAW_CARDS_AS_FACE_DOWN_PRIZES(player: Player, count: number) {
  // Draw cards from the top of the deck to the prize cards
  for (let i = 0; i < count; i++) {
    const card = player.deck.cards.pop();
    if (card) {
      const prize = player.prizes.find(p => p.cards.length === 0);
      if (prize) {
        prize.cards.push(card);
      } else {
        player.deck.cards.push(card);
      }
    }
  }

  // Set the new prize cards to be face down
  player.prizes.forEach(p => p.isSecret = true);
}

export function SEARCH_DECK_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, sourceCard: Card, filter: Partial<Card> = {}, options: Partial<ChooseCardsOptions> = {}, sourceEffect?: any) {
  if (player.deck.cards.length === 0)
    return;
  const opponent = StateUtils.getOpponent(state, player);

  store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, filter, options,
  ), selected => {
    const cards = selected || [];
    if (Object.keys(filter).length > 0) {
      cards.forEach(card => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    }
    MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard, sourceEffect });
    SHUFFLE_DECK(store, state, player);
  });
}

// Made this so that we can easily change behavior for older formats in the future
export function CLEAN_UP_SUPPORTER(effect: TrainerEffect, player: Player) {
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
}

/**
 * Search discard pile for card, show it to the opponent, put it into `player`'s hand.
 * A `filter` can be provided for the prompt as well.
 */
export function SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, sourceCard: Card, filter: Partial<Card> = {}, options: Partial<ChooseCardsOptions> = {}, sourceEffect?: any,) {
  if (player.discard.cards.length === 0)
    return;
  const opponent = StateUtils.getOpponent(state, player);

  store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, player.discard, filter, options,
  ), selected => {
    const cards = selected || [];
    cards.forEach(card => {
      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard, sourceEffect });
  });
}

export function GET_CARDS_ON_BOTTOM_OF_DECK(player: Player, amount: number = 1): Card[] {
  const start = player.deck.cards.length < amount ? 0 : player.deck.cards.length - amount;
  const end = player.deck.cards.length;
  return player.deck.cards.slice(start, end);
}

/**
 * Checks if abilities are blocked on `card` for `player`.
 * @returns `true` if the ability is blocked, `false` if the ability is able to go thru.
 */
export function IS_ABILITY_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.ABILITY,
      text: ''
    }, card));
  } catch {
    return true;
  }
  return false;
}

/**
 * Checks if pokebodies are blocked on `card` for `player`.
 * @returns `true` if the pokebody is blocked, `false` if the pokebody is able to go thru.
 */
export function IS_POKEBODY_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  // Try to reduce PowerEffect, to check if something is blocking our pokebody
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEBODY,
      text: ''
    }, card));
  } catch {
    return true;
  }
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEMON_POWER,
      text: ''
    }, card));
  } catch {
    return true;
  }
  return false;
}

/**
 * Checks if pokepowers are blocked on `card` for `player`.
 * @returns `true` if the pokepower is blocked, `false` if the pokepower is able to go thru.
 */
export function IS_POKEPOWER_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  // Try to reduce PowerEffect, to check if something is blocking our pokepower
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEPOWER,
      text: ''
    }, card));
  } catch {
    return true;
  }
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEMON_POWER,
      text: ''
    }, card));
  } catch {
    return true;
  }
  return false;
}

/**
 * Checks if pokemon powers are blocked on `card` for `player`.
 * @returns `true` if the pokemon power is blocked, `false` if the pokepower is able to go thru.
 */
export function IS_POKEMON_POWER_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  // Try to reduce PowerEffect for POKEMON_POWER
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEMON_POWER,
      text: ''
    }, card));
  } catch {
    return true;
  }
  // Try both POKEPOWER and POKEBODY, return true only if BOTH are blocked
  let pokePowerBlocked = false;
  let pokeBodyBlocked = false;
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEPOWER,
      text: ''
    }, card));
  } catch {
    pokePowerBlocked = true;
  }
  try {
    store.reduceEffect(state, new PowerEffect(player, {
      name: 'test',
      powerType: PowerType.POKEBODY,
      text: ''
    }, card));
  } catch {
    pokeBodyBlocked = true;
  }
  // Return true only if both POKEPOWER and POKEBODY are blocked
  return pokePowerBlocked && pokeBodyBlocked;
  // Ruling: if both pokePower and pokeBody are blocked, then the pokemon power is blocked.
}

/**
 * Checks if a tool's effect is being blocked 
 * @returns `true` if the tool's effect is blocked, `false` if the tool's effect is able to activate.
 */
export function IS_TOOL_BLOCKED(store: StoreLike, state: State, player: Player, card: TrainerCard): boolean {
  // Try to reduce ToolEffect, to check if something is blocking the tool from working
  try {
    const stub = new ToolEffect(player, card);
    store.reduceEffect(state, stub);
  } catch {
    return true;
  }
  return false;
}

/**
 * Checks if a special energy's effect is being blocked for the given player and Pokemon it is attached to. Do not use in CheckProvidedEnergyEffect.
 * @returns `true` if the special energy's effect is blocked, `false` if the special energy's effect is able to activate.
 */
export function IS_SPECIAL_ENERGY_BLOCKED(store: StoreLike, state: State, player: Player, card: EnergyCard, attachedTo: PokemonCardList, exemptFromOpponentsSpecialEnergyBlockingAbility = false): boolean {
  // Try to reduce SpecialEnergyEffect, to check if something is blocking the effect
  try {
    const stub = new SpecialEnergyEffect(player, card, attachedTo, exemptFromOpponentsSpecialEnergyBlockingAbility);
    store.reduceEffect(state, stub);
  } catch {
    return true;
  }
  return false;
}

export function CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state: State, player: Player, pokemon: PokemonCardList) {
  if (state.turn === 2) {
    player.canEvolve = true;
    pokemon.pokemonPlayedTurn = state.turn - 1;
  }
}

/**
 * Finds `card` and moves it from its current CardList to `destination`.
 */
export function MOVE_CARD_TO(state: State, card: Card, destination: CardList) {
  StateUtils.findCardList(state, card).moveCardTo(card, destination);
}

export function SWITCH_ACTIVE_WITH_BENCHED(store: StoreLike, state: State, player: Player) {
  const hasBenched = player.bench.some(b => b.cards.length > 0);
  if (!hasBenched)
    return state;

  store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false },
  ), selected => {
    if (!selected || selected.length === 0)
      return state;
    const target = selected[0];
    player.switchPokemon(target, store, state);
  });
}

export function LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store: StoreLike, state: State, choosingPlayer: Player, deckPlayer: Player) {
  {
    BLOCK_IF_DECK_EMPTY(deckPlayer);
    const deckTop = new CardList();
    deckPlayer.deck.moveTo(deckTop, 1);
    SHOW_CARDS_TO_PLAYER(store, state, choosingPlayer, deckTop.cards);
    SELECT_PROMPT_WITH_OPTIONS(store, state, choosingPlayer, GameMessage.CHOOSE_OPTION, [{
      message: GameMessage.DISCARD_FROM_TOP_OF_DECK,
      action: () => deckTop.moveToTopOfDestination(deckPlayer.discard),
    },
    {
      message: GameMessage.RETURN_TO_TOP_OF_DECK,
      action: () => deckTop.moveToTopOfDestination(deckPlayer.deck),
    }]);
  }
}

export function MOVE_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, cards: Card[]) {
  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, player.hand);
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });
}

export function SHOW_CARDS_TO_PLAYER(store: StoreLike, state: State, player: Player, cards: Card[]): State {
  if (cards.length === 0)
    return state;
  return store.prompt(state, new ShowCardsPrompt(
    player.id,
    GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
    cards,
  ), () => { });
}

export function SELECT_PROMPT(store: StoreLike, state: State, player: Player, values: string[], callback: (result: number) => void): State {
  return store.prompt(state, new SelectPrompt(player.id, GameMessage.CHOOSE_OPTION, values, { allowCancel: false }), callback);
}

export function SELECT_PROMPT_WITH_OPTIONS(store: StoreLike, state: State, player: Player, message: GameMessage, options: { message: GameMessage, action: () => void }[]) {
  return store.prompt(state, new SelectPrompt(
    player.id, message, options.map(opt => opt.message), { allowCancel: false }
  ), choice => {
    const option = options[choice];
    option.action();
  });
}

export function CONFIRMATION_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void, message: GameMessage = GameMessage.WANT_TO_USE_ABILITY): State {
  return store.prompt(state, new ConfirmPrompt(player.id, message), callback);
}

export function COIN_FLIP_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void): State {
  return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), callback);
}

export function MULTIPLE_COIN_FLIPS_PROMPT(store: StoreLike, state: State, player: Player, amount: number, callback: (results: boolean[]) => void): State {
  const prompts: CoinFlipPrompt[] = new Array(amount).fill(0).map((_) => new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP));
  return store.prompt(state, prompts, callback);
}

export function SIMULATE_COIN_FLIP(store: StoreLike, state: State, player: Player): boolean {
  const result = Math.random() < 0.5;
  const gameMessage = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
  store.log(state, gameMessage, { name: player.name });
  return result;
}

export function GET_FIRST_PLAYER_BENCH_SLOT(player: Player): PokemonCardList {
  const slots = GET_PLAYER_BENCH_SLOTS(player);
  BLOCK_IF_NO_SLOTS(slots);
  return slots[0];
}

export function GET_PLAYER_BENCH_SLOTS(player: Player): PokemonCardList[] {
  return player.bench.filter(b => b.cards.length === 0);
}

export function BLOCK_IF_NO_SLOTS(slots: PokemonCardList[]) {
  if (slots.length === 0)
    throw new GameError(GameMessage.NO_BENCH_SLOTS_AVAILABLE);
}

export function BLOCK_IF_DECK_EMPTY(player: Player) {
  if (player.deck.cards.length === 0)
    throw new GameError(GameMessage.NO_CARDS_IN_DECK);
}

export function BLOCK_IF_DISCARD_EMPTY(player: Player) {
  if (player.discard.cards.length === 0)
    throw new GameError(GameMessage.NO_CARDS_IN_DISCARD);
}

export function BLOCK_IF_GX_ATTACK_USED(player: Player) {
  if (player.usedGX === true)
    throw new GameError(GameMessage.LABEL_GX_USED);
}

export function BLOCK_IF_HAS_SPECIAL_CONDITION(player: Player, source: Card) {
  if (player.active.getPokemonCard() === source && player.active.specialConditions.length > 0)
    throw new GameError(GameMessage.CANNOT_USE_POWER);
}

export function BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player: Player, source: Card) {
  // "any Pokemon Power on any Pokemon that says it stops working if the Pokemon is Paralyzed, Asleep, or Confused, 
  // now should ALSO include Poisoned, or Burned as well." - (Jan 17, 2002 WotC Chat, Q1278 & Q1284)
  // I was unaware of this errata when I originally made this and BLOCK_IF_HAS_SPECIAL_CONDITION, so I updated it to do the same thing. 
  if (player.active.getPokemonCard() === source && player.active.specialConditions.length > 0)
    throw new GameError(GameMessage.CANNOT_USE_POWER);
}

//#region Special Conditions
export function ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(
  store: StoreLike, state: State, player: Player, source: Card,
  specialConditions: SpecialCondition[], poisonDamage: number = 10, burnDamage: number = 20, sleepFlips: number = 1
) {
  store.reduceEffect(state, new AddSpecialConditionsPowerEffect(
    player, source, player.active, specialConditions, poisonDamage, burnDamage, sleepFlips));
}

export function ADD_SLEEP_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, sleepFlips: number = 1) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.ASLEEP], 10, 20, sleepFlips);
}

export function ADD_POISON_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, poisonDamage: number = 10) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.POISONED], poisonDamage);
}

export function ADD_BURN_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card, burnDamage: number = 20) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.BURNED], 10, burnDamage);
}

export function ADD_PARALYZED_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.PARALYZED]);
}

export function ADD_CONFUSION_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.CONFUSED]);
}
//#endregion

//#region Markers

export function ADD_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source: Card) {
  owner.marker.addMarker(marker, source);
}

export function REMOVE_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card) {
  return owner.marker.removeMarker(marker, source);
}

export function HAS_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card): boolean {
  return owner.marker.hasMarker(marker, source);
}

export function BLOCK_EFFECT_IF_MARKER(marker: string, owner: Player | Card | PokemonCard | PokemonCardList, source?: Card) {
  if (HAS_MARKER(marker, owner, source))
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
}

export function PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect: Effect, marker: string, source?: Card) {
  if (effect instanceof PutDamageEffect && HAS_MARKER(marker, effect.target, source))
    effect.preventDefault = true;
}

export function PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect: Effect, tag: string, source: Card) {
  if (effect instanceof PutDamageEffect && HAS_TAG(tag, source))
    effect.preventDefault = true;
}

export function HAS_TAG(tag: string, source: Card): boolean {
  return source.tags.includes(tag);
}

export function REMOVE_MARKER_AT_END_OF_TURN(effect: Effect, marker: string, source: Card) {
  if (effect instanceof EndTurnEffect && HAS_MARKER(marker, effect.player, source))
    REMOVE_MARKER(marker, effect.player, source);
}

export function REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect: Effect, marker: string, source: Card) {
  if (effect instanceof EndTurnEffect && HAS_MARKER(marker, effect.player.active, source))
    REMOVE_MARKER(marker, effect.player.active, source);
}

export function REPLACE_MARKER_AT_END_OF_TURN(effect: Effect, oldMarker: string, newMarker: string, source: Card) {
  if (effect instanceof EndTurnEffect && HAS_MARKER(oldMarker, effect.player, source)) {
    REMOVE_MARKER(oldMarker, effect.player, source);
    ADD_MARKER(newMarker, effect.player, source);
  }
}

/**
 * If an EndTurnEffect is given, will check for `clearerMarker` on the player whose turn it is,
 * and clear all of the player or opponent's `pokemonMarker`s.
 * Useful for "During your opponent's next turn" effects.
 */
export function CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state: State, effect: Effect, clearerMarker: string, pokemonMarker: string, source: Card) {
  if (effect instanceof EndTurnEffect && HAS_MARKER(clearerMarker, effect.player, source)) {
    REMOVE_MARKER(clearerMarker, effect.player, source);
    const opponent = StateUtils.getOpponent(state, effect.player);
    REMOVE_MARKER(pokemonMarker, opponent, source);
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => REMOVE_MARKER(pokemonMarker, cardList, source));
  }
}

export function BLOCK_RETREAT_IF_MARKER(effect: Effect, marker: string, source: Card) {
  if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(marker, source))
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
}

//#endregion

export function MOVE_CARDS(
  store: StoreLike,
  state: State,
  source: CardList | PokemonCardList,
  destination: CardList | PokemonCardList,
  options: {
    cards?: Card[],
    count?: number,
    toTop?: boolean,
    toBottom?: boolean,
    skipCleanup?: boolean,
    sourceCard?: Card,
    sourceEffect?: any
  } = {}
): State {
  return store.reduceEffect(state, new MoveCardsEffect(source, destination, options));
}

// export function REMOVE_TOOL(store: StoreLike, state: State, source: PokemonCardList, tool: Card, destinationSlot: SlotType): State {
//   if (!source.cards.includes(tool)) {
//     return state;
//   }
//   const owner = StateUtils.findOwner(state, source);
//   state = MOVE_CARDS(store, state, source, owner.getSlot(destinationSlot), { cards: [tool] });
//   source.removeTool(tool);
//   return state;
// }

// export function REMOVE_TOOLS_FROM_POKEMON_PROMPT(store: StoreLike, state: State, player: Player, target: PokemonCardList, destinationSlot: SlotType, min: number, max: number): State {
//   if (target.tools.length === 0) {
//     return state;
//   }
//   if (target.tools.length === 1) {
//     return REMOVE_TOOL(store, state, target, target.tools[0], destinationSlot);
//   } else {
//     const blocked: number[] = [];
//     target.cards.forEach((card, index) => {
//       if (!target.tools.includes(card)) {
//         blocked.push(index);
//       }
//     });
//     let tools: Card[] = [];
//     return store.prompt(state, new ChooseCardsPrompt(
//       player,
//       GameMessage.CHOOSE_CARD_TO_DISCARD,
//       target,
//       {},
//       { min, max, allowCancel: false, blocked }
//     ), selected => {
//       tools = selected || [];
//       for (const tool of tools) {
//         return REMOVE_TOOL(store, state, target, tool, destinationSlot);
//       }
//     });
//   }
// }

// export function CHOOSE_TOOLS_TO_REMOVE_PROMPT(store: StoreLike, state: State, player: Player, playerType: PlayerType, destinationSlot: SlotType, min: number, max: number): State {
//   const opponent = StateUtils.getOpponent(state, player);

//   let hasPokemonWithTool = false;
//   let players: Player[] = [];
//   switch (playerType) {
//     case PlayerType.TOP_PLAYER:
//       players = [opponent];
//       break;
//     case PlayerType.BOTTOM_PLAYER:
//       players = [player];
//       break;
//     case PlayerType.ANY:
//       players = [player, opponent];
//       break;
//   }
//   const blocked: CardTarget[] = [];

//   for (const p of players) {
//     let pt: PlayerType = PlayerType.BOTTOM_PLAYER;
//     if (p === opponent) {
//       pt = PlayerType.TOP_PLAYER;
//     }
//     p.forEachPokemon(pt, (cardList, card, target) => {
//       if (cardList.tools.length > 0) {
//         hasPokemonWithTool = true;
//       } else {
//         blocked.push(target);
//       }
//     });
//   }

//   if (!hasPokemonWithTool) {
//     return state;
//   }

//   let targets: PokemonCardList[] = [];
//   return store.prompt(state, new ChoosePokemonPrompt(
//     player.id,
//     GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
//     playerType,
//     [SlotType.ACTIVE, SlotType.BENCH],
//     { min, max, allowCancel: false, blocked }
//   ), results => {
//     targets = results || [];
//     if (targets.length === 0) {
//       return state;
//     }
//     let toolsRemoved = 0;
//     for (const target of targets) {
//       if (target.tools.length === 0 || toolsRemoved >= max) {
//         continue;
//       }
//       if (target.tools.length === 1) {
//         REMOVE_TOOL(store, state, target, target.tools[0], destinationSlot);
//         toolsRemoved += 1;
//       } else {
//         const blocked: number[] = [];
//         target.cards.forEach((card, index) => {
//           if (!target.tools.includes(card)) {
//             blocked.push(index);
//           }
//         });
//         let tools: Card[] = [];
//         return store.prompt(state, new ChooseCardsPrompt(
//           player,
//           GameMessage.CHOOSE_CARD_TO_DISCARD,
//           target,
//           {},
//           { min: Math.min(min, max - toolsRemoved), max: max - toolsRemoved, allowCancel: false, blocked }
//         ), selected => {
//           tools = selected || [];
//           for (const tool of tools) {
//             REMOVE_TOOL(store, state, target, tool, destinationSlot);
//             toolsRemoved += 1;
//           }
//         });
//       }
//     }
//   });

/**
 * Validates if a supporter card can be played under current game conditions
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The supporter card to validate
 * @param bypassSupporterTurn If true, temporarily bypasses the supporterTurn check (for abilities that copy supporters)
 * @returns true if the card can be played, false otherwise
 */
export function CAN_PLAY_SUPPORTER_CARD(store: StoreLike, state: State, player: Player, trainerCard: TrainerCard, bypassSupporterTurn: boolean = false): boolean {
  try {
    // Store original supporterTurn value if bypassing
    const originalSupporterTurn = bypassSupporterTurn ? player.supporterTurn : undefined;
    
    // Temporarily set supporterTurn to 0 if bypassing the check
    if (bypassSupporterTurn) {
      player.supporterTurn = 0;
    }

    try {
      // Create a temporary TrainerEffect to test if the card can be played
      const testEffect = new TrainerEffect(player, trainerCard);

      // Try to reduce the effect to see if it throws an error
      // We need to catch the error to prevent the game from crashing
      try {
        store.reduceEffect(state, testEffect);
        return true;
      } catch (error) {
        return false;
      }
    } finally {
      // Restore original supporterTurn value if we bypassed it
      if (bypassSupporterTurn && originalSupporterTurn !== undefined) {
        player.supporterTurn = originalSupporterTurn;
      }
    }
  } catch (error) {
    return false;
  }
}

/**
 * Validates if a trainer card can be played under current game conditions
 * Dynamically checks by attempting to execute the card's logic and catching GameError
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The trainer card to validate
 * @returns true if the card can be played, false otherwise
 */
export function CAN_PLAY_TRAINER_CARD(store: StoreLike, state: State, player: Player, trainerCard: TrainerCard): boolean {
  try {
    // Only check during player's turn
    if (state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
      return false;
    }

    // Check basic trainer type restrictions first (fast path)
    switch (trainerCard.trainerType) {
      case TrainerType.SUPPORTER:
        // Can't play supporter on turn 1 unless card allows it
        if (state.turn === 1 && !trainerCard.firstTurn) {
          return false;
        }
        // Can't play supporter if one already played this turn
        // Check supporterTurn (incremented when supporter is played) and supporter.cards (card in play area)
        if (player.supporterTurn > 0) {
          return false;
        }
        break;
      case TrainerType.STADIUM:
        // Can't play stadium if one already played this turn
        if (player.stadiumPlayedTurn === state.turn) {
          return false;
        }
        // Can't play same stadium already in play
        const stadium = StateUtils.getStadiumCard(state);
        if (stadium && stadium.name === trainerCard.name) {
          return false;
        }
        break;
      case TrainerType.TOOL:
        // Tools need a Pokemon target - basic check only
        const hasPokemon = player.active.cards.length > 0 || player.bench.some(b => b.cards.length > 0);
        if (!hasPokemon) {
          return false;
        }
        break;
      // Items have no basic restrictions beyond being in player's turn
    }

    // Check for Item/Tool blocking effects directly (no cloning needed)
    if (trainerCard.trainerType === TrainerType.ITEM) {
      // Check for marker-based blocks (Budew, etc.)
      if (player.marker.hasMarker('OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER')) {
        return false;
      }

      // Check for ability-based blocks (Jellicent ex, etc.)
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.name === 'Jellicent ex') {
        // Check if ability is blocked
        if (!IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
          return false; // Blocked by ability
        }
      }

      // Check for ATTACK_EFFECT_ITEM_LOCK marker
      if (player.marker.hasMarker(player.ATTACK_EFFECT_ITEM_LOCK)) {
        return false;
      }
    }

    if (trainerCard.trainerType === TrainerType.TOOL) {
      // Check for ability-based blocks (Jellicent ex, etc.)
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.name === 'Jellicent ex') {
        // Check if ability is blocked
        if (!IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
          return false; // Blocked by ability
        }
      }

      // Check for ATTACK_EFFECT_TOOL_LOCK marker
      if (player.marker.hasMarker(player.ATTACK_EFFECT_TOOL_LOCK)) {
        return false;
      }
    }

    // Rely on canPlay method for card-specific validation
    if (trainerCard.canPlay) {
      const canPlayResult = trainerCard.canPlay(store, state, player);
      if (canPlayResult !== undefined) {
        return canPlayResult; // Use canPlay result
      }
    }

    // If canPlay is not implemented or returns undefined, don't show as playable
    // We can't validate card-specific requirements without canPlay, so err on the side of caution
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Validates if an energy card can be played under current game conditions
 * NOTE: This only checks basic conditions, not card-specific requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param energyCard The energy card to validate
 * @returns true if the card can be played, false otherwise
 */
export function CAN_PLAY_ENERGY_CARD(store: StoreLike, state: State, player: Player, energyCard: EnergyCard): boolean {
  try {
    // Only check during player's turn
    if (state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
      return false;
    }

    // Check if player has any Pokemon in play to attach energy to
    const hasActivePokemon = player.active.cards.length > 0;
    const hasBenchPokemon = player.bench.some(bench => bench.cards.length > 0);

    if (!hasActivePokemon && !hasBenchPokemon) {
      return false;
    }

    // Check if energy was already played this turn (unless unlimited)
    if (!player.usedDragonsWish && !state.rules.unlimitedEnergyAttachments) {
      if (player.energyPlayedTurn === state.turn) {
        return false;
      }
    }

    // Basic validation passed - return true
    // Card-specific requirements will be validated when actually playing
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates if a pokemon card can be played under current game conditions
 * Checks basic conditions and evolution requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param pokemonCard The pokemon card to validate
 * @returns true if the card can be played, false otherwise
 */
export function CAN_PLAY_POKEMON_CARD(store: StoreLike, state: State, player: Player, pokemonCard: PokemonCard): boolean {
  try {
    // Only check during player's turn
    if (state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
      return false;
    }

    // Check if there's space on bench (max 5 bench Pokemon)
    const benchCount = player.bench.filter(b => b.cards.length > 0).length;
    if (benchCount >= 5 && pokemonCard.stage === Stage.BASIC) {
      return false;
    }

    // For evolution cards, check if base Pokemon is in play AND can be evolved
    if (pokemonCard.stage !== Stage.BASIC) {
      // Check active Pokemon
      const activePokemon = player.active.getPokemonCard();
      let canEvolveActive = false;
      if (activePokemon) {
        const matchesEvolution = activePokemon.name === pokemonCard.evolvesFrom ||
          activePokemon.evolvesTo.includes(pokemonCard.name) ||
          activePokemon.evolvesToStage.includes(pokemonCard.stage);
        if (matchesEvolution) {
          // Check if Pokemon was played this turn (can't evolve if played this turn)
          if (player.active.pokemonPlayedTurn < state.turn) {
            canEvolveActive = true;
          }
        }
      }

      // Check bench Pokemon
      let canEvolveBench = false;
      for (const bench of player.bench) {
        const benchPokemon = bench.getPokemonCard();
        if (benchPokemon) {
          const matchesEvolution = benchPokemon.name === pokemonCard.evolvesFrom ||
            benchPokemon.evolvesTo.includes(pokemonCard.name) ||
            benchPokemon.evolvesToStage.includes(pokemonCard.stage);
          if (matchesEvolution) {
            // Check if Pokemon was played this turn (can't evolve if played this turn)
            if (bench.pokemonPlayedTurn < state.turn) {
              canEvolveBench = true;
              break;
            }
          }
        }
      }

      if (!canEvolveActive && !canEvolveBench) {
        return false;
      }
    }

    // Basic validation passed
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Universal function to check if any card can be played
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param card The card to validate
 * @returns true if the card can be played, false otherwise
 */
export function CAN_PLAY_CARD(store: StoreLike, state: State, player: Player, card: Card): boolean {
  try {
    if (card instanceof TrainerCard) {
      return CAN_PLAY_TRAINER_CARD(store, state, player, card);
    } else if (card instanceof EnergyCard) {
      return CAN_PLAY_ENERGY_CARD(store, state, player, card);
    } else if (card instanceof PokemonCard) {
      return CAN_PLAY_POKEMON_CARD(store, state, player, card);
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Creates and reduces a prevent retreat effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent the defending Pokemon from retreating.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
export function BLOCK_RETREAT(store: StoreLike, state: State, effect: AttackEffect, source: Card): State {
  const retreatEffect = preventRetreatEffect(effect, source);
  return store.reduceEffect(state, retreatEffect);
}

/**
 * Creates and reduces a prevent damage effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent damage during the opponent's next turn.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
export function PREVENT_DAMAGE(store: StoreLike, state: State, effect: AttackEffect, source: Card): State {
  const damageEffect = preventDamageEffect(effect, source);
  return store.reduceEffect(state, damageEffect);
}

/**
 * Checks if the a Pokemon is at full HP and that the damage dealt is enough to knock it out.
 * TODO: This doesn't work if the an attack changes the result of a CheckHpEffect (e.g. discards an hp-modifying stadium)
 */
export function DAMAGED_FROM_FULL_HP(store: StoreLike, state: State, effect: PutDamageEffect, player: Player, target: PokemonCardList): boolean {
  if (effect.target.damage != 0) {
    return false;
  }
  const checkHpEffect = new CheckHpEffect(player, target);
  store.reduceEffect(state, checkHpEffect);
  return effect.damage >= checkHpEffect.hp;
}

/**
 * Tera Rule: Prevents damage effects from being applied to non-active Pokémon.
 * This is commonly used by Tera Pokémon to prevent damage to benched Pokémon.
 * @param effect The effect being processed
 * @param state The current game state
 * @param source The source card that created this effect
 */
export function TERA_RULE(effect: Effect, state: State, source: Card): void {
  if (effect instanceof PutDamageEffect && effect.target.cards.includes(source) && effect.target.getPokemonCard() === source) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);

    // Target is not Active
    if (effect.target === player.active || effect.target === opponent.active) {
      return;
    }

    effect.preventDefault = true;
  }
}
