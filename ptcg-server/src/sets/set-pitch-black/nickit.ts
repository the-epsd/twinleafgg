import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Nickit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [D],
    damage: 10,
    text: '',
  },
  {
    name: 'Rear Kick',
    cost: [D, C],
    damage: 30,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '51';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nickit';
  public fullName: string = 'Nickit M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
