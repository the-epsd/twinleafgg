import { State, StoreLike } from '../../../game';

import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Roselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Petal Dance',
    cost: [G, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 30 damage for each heads. This Pokémon is now Confused.'
  }];

  public set: string = 'UPR';
  public name: string = 'Roselia';
  public fullName: string = 'Roselia UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });

        effect.damage = 30 * heads;
      });

      const addSpecialConditionsEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      addSpecialConditionsEffect.target = player.active;
      store.reduceEffect(state, addSpecialConditionsEffect);

      return state;
    }

    return state;
  }

}
