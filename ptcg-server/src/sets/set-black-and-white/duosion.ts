import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Duosion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Solosis';
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Recover',
    cost: [C],
    damage: 0,
    text: 'Discard an Energy attached to this Pokémon and heal all damage from this Pokémon.'
  },
  {
    name: 'Rollout',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Duosion';
  public fullName: string = 'Duosion BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 999);
    }

    return state;
  }
}