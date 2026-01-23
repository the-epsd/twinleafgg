import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Foongus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Foongus';
  public fullName: string = 'Foongus NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
