import { AttachEnergyOptions, AttachEnergyPrompt, Card, CardList, ChooseCardsOptions, ChooseCardsPrompt, ChoosePokemonPrompt, ChoosePrizePrompt, CoinFlipPrompt, ConfirmPrompt, EnergyCard, GameError, GameLog, GameMessage, Player, PlayerType, PokemonCardList, PowerType, SelectPrompt, ShowCardsPrompt, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike, TrainerCard } from '../..';
import { BoardEffect, CardTag, SpecialCondition, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { DealDamageEffect, DiscardCardsEffect, HealTargetEffect, PutDamageEffect } from '../effects/attack-effects';
import { AddSpecialConditionsPowerEffect, CheckPrizesDestinationEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { AttackEffect, DrawPrizesEffect, EvolveEffect, KnockOutEffect, PowerEffect, RetreatEffect } from '../effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../effects/game-phase-effects';
import { MoveCardsEffect } from '../effects/game-effects';
import { AttachEnergyEffect, ToolEffect } from '../effects/play-card-effects';

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

export const AFTER_ATTACK = (effect: Effect): effect is AfterAttackEffect => {
  return effect instanceof AfterAttackEffect;
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
    prizes.forEach(prize => {
      if (player.prizes.includes(prize)) {
        prize.moveTo(destination);

        if (destination === player.hand) {
          // If the destination is the hand, we've "taken" a prize
          player.prizesTaken += 1;
        }
      }
    });
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

export function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage: number, effect: AttackEffect, store: StoreLike, state: State, min: number, max: number) {
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
    { min: min, max: max, allowCancel: false }
  ), selected => {
    const target = selected[0];
    const damageEffect = new PutDamageEffect(effect, damage);
    damageEffect.target = target;
    store.reduceEffect(state, damageEffect);
  });
}

export function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store: StoreLike, state: State, effect: AttackEffect, amount: number) {
  const dealDamage = new DealDamageEffect(effect, amount);
  dealDamage.target = effect.source;
  return store.reduceEffect(state, dealDamage);
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

export function SEARCH_DECK_FOR_CARDS_TO_HAND(store: StoreLike, state: State, player: Player, min: number = 0, max: number = 1) {
  if (player.deck.cards.length === 0)
    return;
  let cards: Card[] = [];
  store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: min, max: max, allowCancel: false }
  ), selected => {
    cards = selected || [];
    player.deck.moveCardsTo(cards, player.hand);
  });

  SHUFFLE_DECK(store, state, player);
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
  return false;
}

/**
 * Checks if pokemon powers are blocked on `card` for `player`.
 * @returns `true` if the pokemon power is blocked, `false` if the pokepower is able to go thru.
 */
export function IS_POKEMON_POWER_BLOCKED(store: StoreLike, state: State, player: Player, card: PokemonCard): boolean {
  // Try to reduce PowerEffect, to check if something is blocking our pokepower
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

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false },
  ), selected => {
    if (!selected || selected.length === 0)
      return state;
    const target = selected[0];
    player.switchPokemon(target);
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
  if (player.active.cards[0] === source && player.active.specialConditions.length > 0)
    throw new GameError(GameMessage.CANNOT_USE_POWER);
}

export function BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player: Player, source: Card) {
  if (player.active.cards[0] === source &&
    player.active.specialConditions.includes(SpecialCondition.ASLEEP) ||
    player.active.specialConditions.includes(SpecialCondition.CONFUSED) ||
    player.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
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
    skipCleanup?: boolean
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
