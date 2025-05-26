import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Monferno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = R;
  public evolvesFrom = 'Chimchar';
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flare',
    cost: [R],
    damage: 30,
    text: ''
  },
  {
    name: 'Flamethrower',
    cost: [R, C],
    damage: 50,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set = 'BRS';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name = 'Monferno';
  public fullName = 'Monferno BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}