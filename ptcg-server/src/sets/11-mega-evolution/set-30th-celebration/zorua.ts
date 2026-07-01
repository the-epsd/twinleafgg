import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

export class Zorua extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C];
  public attacks = [{
    name: 'Darkness Fang',
    cost: [D, D],
    damage: 40,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = 'MF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Zorua';
  public fullName: string = 'Zorua MF';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
