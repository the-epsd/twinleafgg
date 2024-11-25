import { PokemonCard } from '../card/pokemon-card';
import { State, StateUtils } from '../..';
import { AttackEffect } from '../effects/game-effects';
import { HealTargetEffect, PutDamageEffect, PutCountersEffect } from '../effects/attack-effects';
import { StoreLike, Card, ChoosePokemonPrompt, PlayerType, SlotType, GameMessage } from '../..';
import { SuperType, TrainerType } from '../card/card-types';
import { AddSpecialConditionsEffect } from '../effects/attack-effects';
import { SpecialCondition } from '../card/card-types';
import { ChooseCardsPrompt, ShuffleDeckPrompt } from '../..';


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

export function SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(
  store: StoreLike, 
  state: State, 
  effect: AttackEffect){
  const player = effect.player;

  player.active.moveTo(player.deck);
  player.active.clearEffects();

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
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
    effect, [ SpecialCondition.ASLEEP ]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(
  store: StoreLike, 
  state: State, 
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [ SpecialCondition.BURNED ]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(
  store: StoreLike, 
  state: State, 
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [ SpecialCondition.CONFUSED ]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(
  store: StoreLike, 
  state: State, 
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [ SpecialCondition.PARALYZED ]
  );
  store.reduceEffect(state, specialConditionEffect);

}

export function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(
  store: StoreLike, 
  state: State, 
  effect: AttackEffect
) {
  const specialConditionEffect = new AddSpecialConditionsEffect(
    effect, [ SpecialCondition.POISONED ]
  );
  store.reduceEffect(state, specialConditionEffect);

}