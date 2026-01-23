import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Tirtouga extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W, C],
    damage: 30,
    text: ''
  }, {
    name: 'Surf',
    cost: [W, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tirtouga';
  public fullName: string = 'Tirtouga NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
