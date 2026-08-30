import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vanillish';
  public cardType: CardType[] = [W];
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Double Freeze',
    cost: [W, C],
    damage: 40,
    text: 'Flip 2 coins. This attack does 40 damage times the number of heads. ' +
    'If either of them is heads, the Defending Pokemon is now Paralyzed.'
  }, {
    name: 'Frost Breath',
    cost: [W, W],
    damage: 60,
    text: ''
  }];

  public set: string = 'NVI';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });

        effect.damage = 40 * heads;
        if (heads > 0) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
