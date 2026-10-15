import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class ShellosWestSea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Spatter',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Recover',
    cost: [W],
    damage: 0,
    text: 'Discard a Water Energy attached to Shellos West Sea and remove all damage counters from Shellos West Sea.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Shellos West Sea';
  public fullName: string = 'Shellos West Sea SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Recover
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.WATER);
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, effect.player.active.damage);
    }

    return state;
  }
}
