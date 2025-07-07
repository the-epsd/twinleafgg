import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Pignite2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tepig';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Flamethrower',
    cost: [R, R, C],
    damage: 70,
    text: 'Discard an Energy attached to this Pokémon.'
  }];

  public set: string = 'BLW';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite BLW 18';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}
