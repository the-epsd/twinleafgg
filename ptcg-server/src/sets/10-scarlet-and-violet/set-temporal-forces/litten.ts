import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Litten extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Fake Out', cost: [R], damage: 10, text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed. '
  }];

  public set: string = 'TEF';
  public setNumber = '32';
  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Litten';
  public fullName: string = 'Litten TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          return store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }

}
