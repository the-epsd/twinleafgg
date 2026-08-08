import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Chimchar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'H';
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Firebreathing',
    cost: [R, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'TWM';
  public name: string = 'Chimchar';
  public fullName: string = 'Chimchar TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }

}
