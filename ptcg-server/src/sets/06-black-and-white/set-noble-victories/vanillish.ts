import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Vanillish extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vanillite';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ice Beam',
    cost: [W, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
  }, {
    name: 'Frost Breath',
    cost: [W, W],
    damage: 40,
    text: ''
  }];

  public set: string = 'NVI';
  public name: string = 'Vanillish';
  public fullName: string = 'Vanillish NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
