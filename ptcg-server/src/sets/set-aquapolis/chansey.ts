import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: '',
  },
  {
    name: 'Double-edge',
    cost: [C, C, C],
    damage: 40,
    text: 'Chansey does 40 damage to itself.',
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
    }

    return state;
  }
}
