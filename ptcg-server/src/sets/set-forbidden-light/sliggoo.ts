import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sliggoo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = N;
  public hp: number = 80;
  public weakness = [{ type: Y }];
  public retreat = [C, C];
  public evolvesFrom = 'Goomy';

  public attacks = [
    {
      name: 'Absorb',
      cost: [W, C],
      damage: 30,
      text: 'Heal 30 damage from this Pokémon.'
    },
    {
      name: 'Hammer In',
      cost: [W, Y, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Sliggoo';
  public fullName: string = 'Sliggoo FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Absorb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    return state;
  }
}