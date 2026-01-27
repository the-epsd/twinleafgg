import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Duosion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Solosis';
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Duosion';
  public fullName: string = 'Duosion NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
