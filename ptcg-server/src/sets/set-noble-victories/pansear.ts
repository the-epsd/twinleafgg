import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pansear extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beat',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'Lunge',
    cost: [R, C, C],
    damage: 60,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '16';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pansear';
  public fullName: string = 'Pansear NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
