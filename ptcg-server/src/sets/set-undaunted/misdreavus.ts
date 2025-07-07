import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mummble',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Dual Draw',
    cost: [P],
    damage: 0,
    text: 'Each player draws 3 cards.'
  }];

  public set: string = 'UD';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DRAW_CARDS(effect.player, 3);
      DRAW_CARDS(effect.opponent, 3);
    }

    return state;
  }

}
