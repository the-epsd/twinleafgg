import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Revavroom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Varoom';
  public hp: number = 140;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Suffocating Gas',
    cost: [M],
    damage: 30,
    text: ''
  },
  {
    name: 'Long Drive',
    cost: [M, M, M],
    damage: 100,
    text: 'Discard all Energy from this Pokémon. This attack also does 100 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Revavroom';
  public fullName: string = 'Revavroom FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Long Drive
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(100, effect, store, state);
    }

    return state;
  }
}
