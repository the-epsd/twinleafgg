import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE_AFTER_WEAKNESS_AND_RESISTANCE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Luxio';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Snarl',
    cost: [L, L, C],
    damage: 100,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public set: string = 'BKP';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snarl
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE_AFTER_WEAKNESS_AND_RESISTANCE(store, state, effect, this, 20);
    }

    return state;
  }
}
