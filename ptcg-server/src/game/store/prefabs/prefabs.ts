import { AttachEnergyPrompt, Card, CardList, ChooseCardsPrompt, ChooseEnergyPrompt, ChoosePokemonPrompt, ConfirmPrompt, EnergyCard, GameError, GameMessage, Player, PlayerType, PowerType, ShowCardsPrompt, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../..';
import { BoardEffect, CardType, EnergyType, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { DealDamageEffect, DiscardCardsEffect, HealTargetEffect, PutDamageEffect } from '../effects/attack-effects';
import { AddSpecialConditionsPowerEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { AttackEffect, EvolveEffect, KnockOutEffect, PowerEffect } from '../effects/game-effects';

/**
 * 
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
export function WAS_ATTACK_USED(effect: Effect, index: number, user: PokemonCard): effect is AttackEffect {
  return effect instanceof AttackEffect && effect.attack === user.attacks[index];
}

/**
 * 
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
export function WAS_POWER_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect {
  return effect instanceof PowerEffect && effect.power === user.powers[index];
}

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

export function SEARCH_YOUR_DECK_FOR_STAGE_OF_POKEMON_AND_PUT_THEM_ONTO_YOUR_BENCH(store: StoreLike, state: State, effect: AttackEffect, min: number, max: number, stage: Stage) {
  const player = effect.player;
  const slots = player.bench.filter(b => b.cards.length === 0);

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage },
    { min, max: slots.length < max ? slots.length : max, allowCancel: true }
  ), selected => {
    const cards = selected || [];

    cards.forEach((card, index) => {
      player.deck.moveCardTo(card, slots[index]);
      slots[index].pokemonPlayedTurn = state.turn;
    });
  });
}

/**
 * Search deck for `type` of Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 */
export function SEARCH_YOUR_DECK_FOR_TYPE_OF_POKEMON_AND_PUT_INTO_HAND(store: StoreLike, state: State, player: Player, min: number, max: number, type: CardType) {

  if (player.deck.cards.length === 0)
    throw new GameError(GameMessage.NO_CARDS_IN_DECK);

  const opponent = StateUtils.getOpponent(state, player);

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, cardType: type },
    { min, max, allowCancel: true },
  ), selected => {
    const cards = selected || [];
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
    SHUFFLE_DECK(store, state, player)
  });
}

export function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number) {
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

export function FLIP_IF_HEADS() {
  console.log('Heads again!');
}

export function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect: AttackEffect, store: StoreLike, state: State, damage: number) {
  effect.damage += damage;
  return state;
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

export function TAKE_X_MORE_PRIZE_CARDS(effect: KnockOutEffect, state: State) {
  effect.prizeCount += 1;
  return state;
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

export function ATTACH_X_NUMBER_OF_BASIC_ENERGY_CARDS_FROM_YOUR_DISCARD_TO_YOUR_BENCHED_POKEMON(effect: AttackEffect, store: StoreLike, state: State, amount: number) {

  const player = effect.player;

  state = store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.discard,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: true, min: amount, max: amount },
  ), transfers => {
    transfers = transfers || [];
    // cancelled by user
    if (transfers.length === 0) {
      return state;
    }
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.discard.moveCardTo(transfer.card, target);
    }
  });
}

export function SHUFFLE_DECK(store: StoreLike, state: State, player: Player): State {
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => player.deck.applyOrder(order));
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
  player.deck.moveTo(player.hand, Math.max(count - player.hand.cards.length, 0))
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
 * Finds `card` and moves it from its current CardList to `destination`.
 */
export function MOVE_CARD_TO(state: State, card: Card, destination: CardList) {
  StateUtils.findCardList(state, card).moveCardTo(card, destination);
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

export function CONFIRMATION_PROMPT(store: StoreLike, state: State, player: Player, callback: (result: boolean) => void): State {
  return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), callback);
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

export function ADD_CONFUSED_TO_PLAYER_ACTIVE(store: StoreLike, state: State, player: Player, source: Card) {
  ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [SpecialCondition.CONFUSED]);
}
//#endregion

export function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store: StoreLike, state: State, effect: AttackEffect) {
  const dealDamage = new DealDamageEffect(effect, 30);
  dealDamage.target = effect.source;
  return store.reduceEffect(state, dealDamage);
}