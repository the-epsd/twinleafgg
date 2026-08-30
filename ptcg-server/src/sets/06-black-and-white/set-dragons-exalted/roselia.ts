import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect, RemoveSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Roselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Whip',
    cost: [C],
    damage: 10,
    text: 'Flip 2 coins. This attack does 10 damage times the number ' +
    'of heads.'
  }, {
    name: 'Relaxing Fragrance',
    cost: [G],
    damage: 0,
    text: 'Heal 30 damage and remove all Special Conditions from ' +
    'this Pokemon.'
  }];

  public set: string = 'DRX';
  public name: string = 'Roselia';
  public fullName: string = 'Roselia DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      return state;
    }

    return state;
  }

}
