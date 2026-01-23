import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Munna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NXD';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Munna';
  public fullName: string = 'Munna NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
