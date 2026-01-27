import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Combustion',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NXD';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Growlithe';
  public fullName: string = 'Growlithe NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
