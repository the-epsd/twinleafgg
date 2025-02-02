/* eslint-disable indent */
import { DamageMap, GameMessage, PlayerType, PutDamagePrompt, SlotType, StateUtils } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WalkingWake extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Aurora Gain',
      cost: [CardType.WATER],
      damage: 20,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Undulating Slice',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'Put up to 9 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Walking Wake';

  public fullName: string = 'Walking Wake TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healEffect = new HealEffect(player, effect.player.active, 20);
      state = store.reduceEffect(state, healEffect);

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = attack(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}

function* attack(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const maxAllowedDamage: DamageMap[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(player, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp + 90 });
  });

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE],
    90,
    maxAllowedDamage,
    { allowCancel: false, allowPlacePartialDamage: true }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
      effect.damage = result.damage * 2;
    }
  });
}