import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Geodude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Stone Barrage',
    cost: [F, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'FO';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Geodude';
  public fullName: string = 'Geodude FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
      effect.damage = 10 * heads;
    });
    }
    return state;
  }
}