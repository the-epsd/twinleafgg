import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Pansear extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flare',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'NXD';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pansear';
  public fullName: string = 'Pansear NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
