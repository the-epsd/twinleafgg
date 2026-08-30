import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Bubble',
    cost: [W, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage times the number of heads. If either of the coins is heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'SS';
  public name: string = 'Marill';
  public fullName: string = 'Marill SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });

        effect.damage = 10 * heads;
        if (heads > 0) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
