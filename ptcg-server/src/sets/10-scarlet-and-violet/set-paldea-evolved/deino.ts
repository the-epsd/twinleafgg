import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Ambush',
    cost: [D, C],
    damage: 20,
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set = 'PAL';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name = 'Deino';
  public fullName = 'Deino PAL';

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