import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Eelektross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Eelektrik';
  public cardType: CardType = L;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Coil',
    cost: [C],
    damage: 10,
    text: 'During your next turn, this Pokémon\'s attacks do 120 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Extreme Current',
    cost: [L, C],
    damage: 160,
    text: 'Discard 2 Energy from this Pokémon.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eelektross';
  public fullName: string = 'Eelektross LOR 61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Coil
    if (WAS_ATTACK_USED(effect, 0, this)) {
      NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, { source: this, bonusDamage: 120 });
    }

    // Extreme Current
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}
