import { Card, ChooseCardsPrompt, ChoosePokemonPrompt, DamageMap, GameMessage, PlayerType, PutDamagePrompt, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../..';
import { SpecialCondition, SuperType, TrainerType } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { AddSpecialConditionsEffect, AfterDamageEffect, ApplyWeaknessEffect, DealDamageEffect, HealTargetEffect, PutCountersEffect, PutDamageEffect } from '../effects/attack-effects';
import { CheckHpEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { COIN_FLIP_PROMPT } from './prefabs';


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
  let damageLeft = 0;
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, cardList);
    store.reduceEffect(state, checkHpEffect);
    damageLeft += checkHpEffect.hp - cardList.damage;
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  const damage = Math.min(10 * x, damageLeft);
  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    slotTypes,
    damage,
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
  effect: AttackEffect) {
  const player = effect.player;

  player.active.moveTo(player.deck);
  player.active.clearEffects();

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export function FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  amount: number
) {
  COIN_FLIP_PROMPT(store, state, effect.player, (result => {
    if (result) {
      effect.damage += amount;
    }
  }));
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
    if (target === player.active) {
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